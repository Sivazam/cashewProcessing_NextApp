"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useWorkersStore,
  useLogsStore,
  useFirmsStore,
  useSettingsStore,
} from "@/lib/store";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface WorkerDailyLog {
  date: string; // Date in dd/MM/yy format
  workerName: string;
  kgsProcessed: number;
  advancesGiven: number;
  advancesCleared: number;
  netAdvances: number;
  totalAmountEarned: number; // Total earnings of the worker
  payoutsMade: number; // Total payouts made to the worker
  pendingPayable: number; // Pending payable amount
}

export function WorkerDailyLogTable() {
  const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { workers } = useWorkersStore();
  const { workLogs, payments } = useLogsStore();
  const { firms, selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!selectedFirmId) return;

    const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

    // Calculate logs for the selected month
    const startOfMonthDate = startOfMonth(selectedMonth);
    const endOfMonthDate = endOfMonth(selectedMonth);

    const logs: WorkerDailyLog[] = firmWorkers.map((worker) => {
      const workerLogs = workLogs.filter(
        (log) =>
          log.workerId === worker.id &&
          new Date(log.date) >= startOfMonthDate &&
          new Date(log.date) <= endOfMonthDate
      );

      const advancesGiven = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id && payment.type === "advance"
        )
        .reduce((sum, payment) => sum + payment.amount, 0);

      const advancesCleared = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id && payment.type === "clear_advance"
        )
        .reduce((sum, payment) => sum + payment.amount, 0);

      const netAdvances = advancesGiven - advancesCleared;

      const payoutsMade = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id && payment.type === "payout"
        )
        .reduce((sum, payment) => sum + payment.amount, 0);

      // Use worker.totalAmount for total amount earned
      const totalAmountEarned = worker.totalAmount;

      // Calculate pending payable amount
      const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;

      return {
        date: format(startOfMonthDate, "dd/MM/yy"), // Date in dd/MM/yy format
        workerName: worker.name,
        kgsProcessed: workerLogs.reduce((sum, log) => sum + log.kgsProcessed, 0),
        advancesGiven,
        advancesCleared,
        netAdvances,
        totalAmountEarned, // Total earnings of the worker
        payoutsMade, // Total payouts made to the worker
        pendingPayable, // Pending payable amount
      };
    });

    setDailyLogs(logs);
  }, [workers, workLogs, payments, selectedFirmId, selectedMonth]);

  const exportToCSV = () => {
    // Get the selected firm's name
    const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
    const firmName = selectedFirm?.name || "Unknown Firm";

    // Add summary rows to the CSV
    const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
    const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

    const csvData = [
      ["Firm Name", firmName],
      ["Month", format(selectedMonth, "MMMM yyyy")],
      [],
      [
        "Date",
        "Worker Name",
        "Kgs Processed",
        "Advances Given",
        "Advances Cleared",
        "Net Advances",
        "Total Amount Earned",
        "Payouts Made",
        "Pending Payable",
      ],
      ...dailyLogs.map((log) => [
        log.date,
        log.workerName,
        log.kgsProcessed,
        log.advancesGiven,
        log.advancesCleared,
        log.netAdvances,
        log.totalAmountEarned,
        log.payoutsMade,
        log.pendingPayable,
      ]),
      [],
      [
        "Totals",
        "",
        totalKgsProcessed,
        "",
        "",
        "",
        "",
        "",
        totalPendingPayable,
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
  };

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Worker Daily Logs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please select a firm to view worker daily logs
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header Section */}
      <CardHeader className="space-y-4">
        {/* Title */}
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
        </div>

        {/* Month Dropdown and Export Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Month Dropdown */}
          <Select
            value={format(selectedMonth, "yyyy-MM")}
            onValueChange={(value) => setSelectedMonth(new Date(value))}
            className="w-full sm:w-[200px]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => {
                const month = subMonths(new Date(), i);
                return (
                  <SelectItem key={i} value={format(month, "yyyy-MM")}>
                    {format(month, "MMMM yyyy")}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
            Export as CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Worker Name</th>
                <th className="px-4 py-2 text-left">Kgs Processed</th>
                <th className="px-4 py-2 text-left">Advances Given</th>
                <th className="px-4 py-2 text-left">Advances Cleared</th>
                <th className="px-4 py-2 text-left">Net Advances</th>
                <th className="px-4 py-2 text-left">Total Amount Earned</th>
                <th className="px-4 py-2 text-left">Payouts Made</th>
                <th className="px-4 py-2 text-left">Pending Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dailyLogs.map((log, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{log.date}</td>
                  <td className="px-4 py-2">{log.workerName}</td>
                  <td className="px-4 py-2">{log.kgsProcessed} kg</td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.advancesGiven}
                  </td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.advancesCleared}
                  </td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.netAdvances}
                  </td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.totalAmountEarned}
                  </td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.payoutsMade}
                  </td>
                  <td className="px-4 py-2">
                    {settings.currency} {log.pendingPayable}
                  </td>
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="bg-muted">
                <td colSpan={2} className="px-4 py-2 font-bold">
                  Totals
                </td>
                <td className="px-4 py-2 font-bold">
                  {dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="px-4 py-2 font-bold">
                  {settings.currency}{" "}
                  {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore } from "@/lib/store";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// interface WorkerDailyLog {
//   date: string; // Date in dd/MM/yy format
//   workerName: string;
//   kgsProcessed: number;
//   advancesGiven: number;
//   advancesCleared: number;
//   netAdvances: number;
//   payoutEarnedToday: number;
//   totalPayable: number;
// }

// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//     // Calculate logs for the selected month
//     const startOfMonthDate = startOfMonth(selectedMonth);
//     const endOfMonthDate = endOfMonth(selectedMonth);

//     const logs: WorkerDailyLog[] = firmWorkers.map((worker) => {
//       const workerLogs = workLogs.filter(
//         (log) =>
//           log.workerId === worker.id &&
//           new Date(log.date) >= startOfMonthDate &&
//           new Date(log.date) <= endOfMonthDate
//       );

//       const advancesGiven = payments
//         .filter(
//           (payment) =>
//             payment.workerId === worker.id &&
//             payment.type === "advance"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);

//       const advancesCleared = payments
//         .filter(
//           (payment) =>
//             payment.workerId === worker.id &&
//             payment.type === "clear_advance"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);

//       const netAdvances = advancesGiven - advancesCleared;

//       const payouts = payments
//         .filter(
//           (payment) =>
//             payment.workerId === worker.id &&
//             payment.type === "payout"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);

//       const totalPayable = payouts - netAdvances;

//       return {
//         date: format(startOfMonthDate, "dd/MM/yy"), // Date in dd/MM/yy format
//         workerName: worker.name,
//         kgsProcessed: workerLogs.reduce((sum, log) => sum + log.kgsProcessed, 0),
//         advancesGiven,
//         advancesCleared,
//         netAdvances,
//         payoutEarnedToday: payouts,
//         totalPayable,
//       };
//     });

//     setDailyLogs(logs);
//   }, [workers, workLogs, payments, selectedFirmId, selectedMonth]);

//   const exportToCSV = () => {
//     // Get the selected firm's name
//     const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
//     const firmName = selectedFirm?.name || "Unknown Firm";

//     // Add summary rows to the CSV
//     const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
//     const totalPayable = dailyLogs.reduce((sum, log) => sum + log.totalPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       ["Date", "Worker Name", "Kgs Processed", "Advances Given", "Advances Cleared", "Net Advances", "Payout Earned Today", "Total Payable"],
//       ...dailyLogs.map((log) => [
//         log.date,
//         log.workerName,
//         log.kgsProcessed,
//         log.advancesGiven,
//         log.advancesCleared,
//         log.netAdvances,
//         log.payoutEarnedToday,
//         log.totalPayable,
//       ]),
//       [],
//       ["Totals", "", totalKgsProcessed, "", "", "", "", totalPayable],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(csvData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
//   };

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Worker Daily Logs</CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Please select a firm to view worker daily logs
//           </p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
    // <Card>
    //   {/* Header Section */}
    //   <CardHeader className="space-y-4">
    //     {/* Title */}
    //     <div className="flex justify-between items-center">
    //       <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
    //     </div>

    //     {/* Month Dropdown and Export Button */}
    //     <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    //       {/* Month Dropdown */}
    //       <Select
    //         value={format(selectedMonth, "yyyy-MM")}
    //         onValueChange={(value) => setSelectedMonth(new Date(value))}
    //         className="w-full sm:w-[200px]"
    //       >
    //         <SelectTrigger>
    //           <SelectValue placeholder="Select Month" />
    //         </SelectTrigger>
    //         <SelectContent>
    //           {[...Array(12)].map((_, i) => {
    //             const month = subMonths(new Date(), i);
    //             return (
    //               <SelectItem key={i} value={format(month, "yyyy-MM")}>
    //                 {format(month, "MMMM yyyy")}
    //               </SelectItem>
    //             );
    //           })}
    //         </SelectContent>
    //       </Select>

    //       {/* Export Button */}
    //       <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
    //         Export as CSV
    //       </Button>
    //     </div>
    //   </CardHeader>

//       {/* Table Content */}
//       <CardContent className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Worker Name</th>
//               <th className="px-4 py-2 text-left">Kgs Processed</th>
//               <th className="px-4 py-2 text-left">Advances Given</th>
//               <th className="px-4 py-2 text-left">Advances Cleared</th>
//               <th className="px-4 py-2 text-left">Net Advances</th>
//               <th className="px-4 py-2 text-left">Payout Earned Today</th>
//               <th className="px-4 py-2 text-left">Total Payable</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-border">
//             {dailyLogs.map((log, index) => (
//               <tr key={index}>
//                 <td className="px-4 py-2">{log.date}</td>
//                 <td className="px-4 py-2">{log.workerName}</td>
//                 <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                 <td className="px-4 py-2">{settings.currency} {log.advancesGiven}</td>
//                 <td className="px-4 py-2">{settings.currency} {log.advancesCleared}</td>
//                 <td className="px-4 py-2">{settings.currency} {log.netAdvances}</td>
//                 <td className="px-4 py-2">{settings.currency} {log.payoutEarnedToday}</td>
//                 <td className="px-4 py-2">{settings.currency} {log.totalPayable}</td>
//               </tr>
//             ))}
//             {/* Summary Row */}
//             <tr className="bg-muted">
//               <td colSpan={2} className="px-4 py-2 font-bold">
//                 Totals
//               </td>
//               <td className="px-4 py-2 font-bold">{dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg</td>
//               <td></td>
//               <td></td>
//               <td></td>
//               <td></td>
//               <td className="px-4 py-2 font-bold">
//                 {settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalPayable, 0)}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </CardContent>
//     </Card>
//   );
// }