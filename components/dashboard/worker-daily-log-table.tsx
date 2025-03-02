// "use client";

// import { useEffect, useState } from "react";
// import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useWorkersStore,
//   useLogsStore,
//   useFirmsStore,
//   useSettingsStore,
// } from "@/lib/store";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// interface WorkerDailyLog {
//   date: string; // Date in dd/MM/yy format
//   workerName: string;
//   kgsProcessed: number;
//   advancesGiven: number;
//   advancesCleared: number;
//   netAdvances: number;
//   totalAmountEarned: number; // Total earnings of the worker
//   payoutsMade: number; // Total payouts made to the worker
//   pendingPayable: number; // Pending payable amount
// }

// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   // useEffect(() => {
//   //   if (!selectedFirmId) return;

//   //   const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//   //   // Calculate logs for the selected month
//   //   const startOfMonthDate = startOfMonth(selectedMonth);
//   //   const endOfMonthDate = endOfMonth(selectedMonth);

//   //   const logs: WorkerDailyLog[] = firmWorkers.map((worker) => {
//   //     const workerLogs = workLogs.filter(
//   //       (log) =>
//   //         log.workerId === worker.id &&
//   //         new Date(log.date) >= startOfMonthDate &&
//   //         new Date(log.date) <= endOfMonthDate
//   //     );

//   //     const advancesGiven = payments
//   //       .filter(
//   //         (payment) =>
//   //           payment.workerId === worker.id && payment.type === "advance"
//   //       )
//   //       .reduce((sum, payment) => sum + payment.amount, 0);

//   //     const advancesCleared = payments
//   //       .filter(
//   //         (payment) =>
//   //           payment.workerId === worker.id && payment.type === "clear_advance"
//   //       )
//   //       .reduce((sum, payment) => sum + payment.amount, 0);

//   //     const netAdvances = advancesGiven - advancesCleared;

//   //     const payoutsMade = payments
//   //       .filter(
//   //         (payment) =>
//   //           payment.workerId === worker.id && payment.type === "payout"
//   //       )
//   //       .reduce((sum, payment) => sum + payment.amount, 0);

//   //     // Use worker.totalAmount for total amount earned
//   //     const totalAmountEarned = worker.totalAmount;

//   //     // Calculate pending payable amount
//   //     const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;

//   //     return {
//   //       date: format(startOfMonthDate, "dd/MM/yy"), // Date in dd/MM/yy format
//   //       workerName: worker.name,
//   //       kgsProcessed: workerLogs.reduce((sum, log) => sum + log.kgsProcessed, 0),
//   //       advancesGiven,
//   //       advancesCleared,
//   //       netAdvances,
//   //       totalAmountEarned, // Total earnings of the worker
//   //       payoutsMade, // Total payouts made to the worker
//   //       pendingPayable, // Pending payable amount
//   //     };
//   //   });

//   //   setDailyLogs(logs);
//   // }, [workers, workLogs, payments, selectedFirmId, selectedMonth]);

//   useEffect(() => {
//     if (!selectedFirmId) return;
  
//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);
  
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
//             payment.workerId === worker.id && payment.type === "advance"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);
  
//       const advancesCleared = payments
//         .filter(
//           (payment) =>
//             payment.workerId === worker.id && payment.type === "clear_advance"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);
  
//       const netAdvances = advancesGiven - advancesCleared;
  
//       const payoutsMade = payments
//         .filter(
//           (payment) =>
//             payment.workerId === worker.id && payment.type === "payout"
//         )
//         .reduce((sum, payment) => sum + payment.amount, 0);
  
//       const totalAmountEarned = worker.totalAmount;
//       const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;
  
//       // Use actual log dates
//       const logDates = workerLogs.map((log) => format(new Date(log.date), "dd/MM/yyyy"));
  
//       return {
//         date: logDates.join(", "), // Combine all log dates into a single string
//         workerName: worker.name,
//         kgsProcessed: workerLogs.reduce((sum, log) => sum + log.kgsProcessed, 0),
//         advancesGiven,
//         advancesCleared,
//         netAdvances,
//         totalAmountEarned,
//         payoutsMade,
//         pendingPayable,
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
//     const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
//     const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
//     const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
//     const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       [
//         "Date",
//         "Worker Name",
//         "Kgs Processed",
//         "Advances Given",
//         // "Advances Cleared",
//         "Net Advances",
//         "Total Amount Earned",
//         "Payouts Made",
//         "Pending Payable",
//       ],
//       ...dailyLogs.map((log) => [
//         log.date,
//         log.workerName,
//         log.kgsProcessed,
//         log.advancesGiven,
//         // log.advancesCleared,
//         log.netAdvances,
//         log.totalAmountEarned,
//         log.payoutsMade,
//         log.pendingPayable,
//       ]),
//       [],
//       [
//         "Totals",
//         "",
//         totalKgsProcessed,
//         totalAdvancesGiven,
//         // "",
//         "",
//         totalAmountEarned,
//         totalPayoutsMade,
//         totalPendingPayable,
//       ],
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
//     <Card>
//       {/* Header Section */}
//       <CardHeader className="space-y-4">
//         {/* Title */}
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
//         </div>

//         {/* Month Dropdown and Export Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           {/* Month Dropdown */}
//           <Select
//             value={format(selectedMonth, "yyyy-MM")}
//             onValueChange={(value) => setSelectedMonth(new Date(value))}
//             className="w-full sm:w-[200px]"
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select Month" />
//             </SelectTrigger>
//             <SelectContent>
//               {[...Array(12)].map((_, i) => {
//                 const month = subMonths(new Date(), i);
//                 return (
//                   <SelectItem key={i} value={format(month, "yyyy-MM")}>
//                     {format(month, "MMMM yyyy")}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>

//           {/* Export Button */}
//           <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
//             Export as CSV
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Worker Name</th>
//                 <th className="px-4 py-2 text-left">Kgs Processed</th>
//                 <th className="px-4 py-2 text-left">Advances Given</th>
//                 {/* <th className="px-4 py-2 text-left">Advances Cleared</th> */}
//                 <th className="px-4 py-2 text-left">Net Advances</th>
//                 <th className="px-4 py-2 text-left">Total Amount Earned</th>
//                 <th className="px-4 py-2 text-left">Payouts Made</th>
//                 <th className="px-4 py-2 text-left">Pending Payable</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {dailyLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{log.date}</td>
//                   <td className="px-4 py-2">{log.workerName}</td>
//                   <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                   <td className="px-4 py-2">
//                     {settings.currency} {log.advancesGiven}
//                   </td>
//                   {/* <td className="px-4 py-2">
//                     {settings.currency} {log.advancesCleared}
//                   </td> */}
//                   <td className="px-4 py-2">
//                     {settings.currency} {log.netAdvances}
//                   </td>
//                   <td className="px-4 py-2">
//                     {settings.currency} {log.totalAmountEarned}
//                   </td>
//                   <td className="px-4 py-2">
//                     {settings.currency} {log.payoutsMade}
//                   </td>
//                   <td className="px-4 py-2">
//                     {settings.currency} {log.pendingPayable}
//                   </td>
//                 </tr>
//               ))}
//               {/* Summary Row */}
//               <tr className="bg-muted">
//                 <td colSpan={2} className="px-4 py-2 font-bold">
//                   Totals
//                 </td>
//                 <td className="px-4 py-2 font-bold">
//                   {dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg
//                 </td>
//                 <td className="px-4 py-2 font-bold">
//                   {settings.currency}{" "}
//                   {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0)}
//                 </td>
//                   {/* <td></td> */}
//                   <td></td>
//                   <td className="px-4 py-2 font-bold">
//                   {settings.currency}{" "}
//                   {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0)}
//                 </td>
                  
//                 <td className="px-4 py-2 font-bold">
//                   {settings.currency}{" "}
//                   {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0)}
//                 </td>

//                 <td className="px-4 py-2 font-bold">
//                   {settings.currency}{" "}
//                   {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }



// Version 1 - working wihtou all workers option

// "use client";

// import { useEffect, useState } from "react";
// import { format, startOfMonth, endOfMonth, parseISO, subMonths } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore } from "@/lib/store";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// interface WorkerDailyLog {
//   date: string; // Date in dd/MM/yyyy format
//   workerName: string;
//   kgsProcessed: number;
//   advancesGiven: number;
//   advancesCleared: number;
//   netAdvances: number;
//   totalAmountEarned: number;
//   payoutsMade: number;
//   pendingPayable: number;
// }

// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//     // Determine the date range for filtering logs
//     const startOfMonthDate = startDate ? parseISO(startDate) : startOfMonth(selectedMonth);
//     const endOfMonthDate = endDate ? parseISO(endDate) : endOfMonth(selectedMonth);

//     const logs: WorkerDailyLog[] = firmWorkers
//       .filter((worker) => !selectedWorkerId || worker.id === selectedWorkerId) // Filter by selected worker
//       .map((worker) => {
//         const workerLogsForPeriod = workLogs.filter(
//           (log) =>
//             log.workerId === worker.id &&
//             new Date(log.date) >= startOfMonthDate &&
//             new Date(log.date) <= endOfMonthDate
//         );

//         // Aggregate logs by day
//         const dailyAggregatedLogs = workerLogsForPeriod.reduce((acc, log) => {
//           const logDate = format(parseISO(log.date), "dd/MM/yyyy");
//           if (!acc[logDate]) {
//             acc[logDate] = {
//               date: logDate,
//               workerName: worker.name,
//               kgsProcessed: 0,
//               advancesGiven: 0,
//               advancesCleared: 0,
//               netAdvances: 0,
//               totalAmountEarned: 0,
//               payoutsMade: 0,
//               pendingPayable: 0,
//             };
//           }
//           acc[logDate].kgsProcessed += log.kgsProcessed;
//           acc[logDate].totalAmountEarned += log.amountEarned || 0;
//           return acc;
//         }, {} as Record<string, WorkerDailyLog>);

//         // Calculate advances and payouts for the period
//         const advancesGiven = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "advance" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const advancesCleared = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "clear_advance" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const payoutsMade = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "payout" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const netAdvances = advancesGiven - advancesCleared;
//         const pendingPayable = Object.values(dailyAggregatedLogs).reduce(
//           (sum, log) => sum + log.totalAmountEarned,
//           0
//         ) - payoutsMade - netAdvances;

//         // Merge aggregated logs into a single array
//         return Object.values(dailyAggregatedLogs).map((log) => ({
//           ...log,
//           advancesGiven,
//           advancesCleared,
//           netAdvances,
//           payoutsMade,
//           pendingPayable,
//         }));
//       })
//       .flat();

//     setDailyLogs(logs);
//   }, [workers, workLogs, payments, selectedFirmId, selectedMonth, selectedWorkerId, startDate, endDate]);

//   const exportToCSV = () => {
//     const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
//     const firmName = selectedFirm?.name || "Unknown Firm";

//     const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
//     const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
//     const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
//     const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
//     const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       ["Date", "Worker Name", "Kgs Processed", "Advances Given", "Net Advances", "Total Amount Earned", "Payouts Made", "Pending Payable"],
//       ...dailyLogs.map((log) => [
//         log.date,
//         log.workerName,
//         log.kgsProcessed,
//         log.advancesGiven,
//         log.netAdvances,
//         log.totalAmountEarned,
//         log.payoutsMade,
//         log.pendingPayable,
//       ]),
//       [],
//       ["Totals", "", totalKgsProcessed, totalAdvancesGiven, "", totalAmountEarned, totalPayoutsMade, totalPendingPayable],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(csvData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
//   };

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Worker Daily Logs</CardTitle>
//           <p className="text-sm text-muted-foreground">Please select a firm to view worker daily logs</p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="space-y-4">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           {/* Worker Dropdown */}
//           <Select value={selectedWorkerId || ""} onValueChange={(value) => setSelectedWorkerId(value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Worker" />
//             </SelectTrigger>
//             <SelectContent>
//               {workers.map((worker) => (
//                 <SelectItem key={worker.id} value={worker.id}>
//                   {worker.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Month Dropdown */}
//           <Select value={format(selectedMonth, "yyyy-MM")} onValueChange={(value) => setSelectedMonth(new Date(value))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Month" />
//             </SelectTrigger>
//             <SelectContent>
//               {[...Array(12)].map((_, i) => {
//                 const month = subMonths(new Date(), i);
//                 return (
//                   <SelectItem key={i} value={format(month, "yyyy-MM")}>
//                     {format(month, "MMMM yyyy")}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>

//           {/* Date Range Inputs */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//           </div>

//           {/* Export Button */}
//           <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
//             Export as CSV
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Worker Name</th>
//                 <th className="px-4 py-2 text-left">Kgs Processed</th>
//                 <th className="px-4 py-2 text-left">Advances Given</th>
//                 <th className="px-4 py-2 text-left">Net Advances</th>
//                 <th className="px-4 py-2 text-left">Total Amount Earned</th>
//                 <th className="px-4 py-2 text-left">Payouts Made</th>
//                 <th className="px-4 py-2 text-left">Pending Payable</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {dailyLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{log.date}</td>
//                   <td className="px-4 py-2">{log.workerName}</td>
//                   <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                   <td className="px-4 py-2">{settings.currency} {log.advancesGiven}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.netAdvances}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.totalAmountEarned}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.payoutsMade}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.pendingPayable}</td>
//                 </tr>
//               ))}

//               {/* Totals Row */}
//               <tr className="bg-muted">
//                 <td colSpan={2} className="px-4 py-2 font-bold">
//                   Totals
//                 </td>
//                 <td className="px-4 py-2 font-bold">{dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0)}</td>
//                 <td></td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// Version 2 - working with all workers option but merged dates version

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
//   workerName: string;
//   dates: string; // Comma-separated dates
//   kgsProcessed: number;
//   advancesGiven: number;
//   netAdvances: number;
//   totalAmountEarned: number;
//   payoutsMade: number;
//   pendingPayable: number;
// }

// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [selectedWorkerId, setSelectedWorkerId] = useState<string | "all">("all");
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//     // Determine the date range for filtering logs
//     const startOfMonthDate = startDate ? new Date(startDate) : startOfMonth(selectedMonth);
//     const endOfMonthDate = endDate ? new Date(endDate) : endOfMonth(selectedMonth);

//     const logs: WorkerDailyLog[] = firmWorkers
//       .filter((worker) => selectedWorkerId === "all" || worker.id === selectedWorkerId)
//       .map((worker) => {
//         const workerLogsForPeriod = workLogs.filter(
//           (log) =>
//             log.workerId === worker.id &&
//             new Date(log.date) >= startOfMonthDate &&
//             new Date(log.date) <= endOfMonthDate
//         );

//         // Aggregate logs by worker
//         const kgsProcessed = workerLogsForPeriod.reduce((sum, log) => sum + log.kgsProcessed, 0);
//         const totalAmountEarned = workerLogsForPeriod.reduce((sum, log) => sum + log.amountEarned, 0);

//         // Calculate advances and payouts for the period
//         const advancesGiven = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "advance" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const advancesCleared = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "clear_advance" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const payoutsMade = payments
//           .filter(
//             (payment) =>
//               payment.workerId === worker.id &&
//               payment.type === "payout" &&
//               new Date(payment.date) >= startOfMonthDate &&
//               new Date(payment.date) <= endOfMonthDate
//           )
//           .reduce((sum, payment) => sum + payment.amount, 0);

//         const netAdvances = advancesGiven - advancesCleared;
//         const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;

//         // Combine dates into a comma-separated string
//         const dates = workerLogsForPeriod
//           .map((log) => format(new Date(log.date), "MMM dd"))
//           .join(", ");

//         return {
//           workerName: worker.name,
//           dates,
//           kgsProcessed,
//           advancesGiven,
//           netAdvances,
//           totalAmountEarned,
//           payoutsMade,
//           pendingPayable,
//         };
//       })
//       .filter((log) => log.dates); // Exclude workers with no logs

//     setDailyLogs(logs);
//   }, [workers, workLogs, payments, selectedFirmId, selectedMonth, startDate, endDate, selectedWorkerId]);

//   const exportToCSV = () => {
//     const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
//     const firmName = selectedFirm?.name || "Unknown Firm";

//     const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
//     const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
//     const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
//     const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
//     const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       ["Dates", "Worker Name", "Kgs Processed", "Advances Given", "Net Advances", "Total Amount Earned", "Payouts Made", "Pending Payable"],
//       ...dailyLogs.map((log) => [
//         log.dates,
//         log.workerName,
//         `${log.kgsProcessed} kg`,
//         `${settings.currency} ${log.advancesGiven}`,
//         `${settings.currency} ${log.netAdvances}`,
//         `${settings.currency} ${log.totalAmountEarned}`,
//         `${settings.currency} ${log.payoutsMade}`,
//         `${settings.currency} ${log.pendingPayable}`,
//       ]),
//       [],
//       ["Totals", "", totalKgsProcessed, totalAdvancesGiven, "", totalAmountEarned, totalPayoutsMade, totalPendingPayable],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(csvData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
//   };

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Worker Daily Logs</CardTitle>
//           <p className="text-sm text-muted-foreground">Please select a firm to view worker daily logs</p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="space-y-4">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           {/* Worker Dropdown */}
//           <Select value={selectedWorkerId} onValueChange={(value) => setSelectedWorkerId(value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Worker" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Workers</SelectItem>
//               {workers.map((worker) => (
//                 <SelectItem key={worker.id} value={worker.id}>
//                   {worker.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Month Dropdown */}
//           <Select value={format(selectedMonth, "yyyy-MM")} onValueChange={(value) => setSelectedMonth(new Date(value))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Month" />
//             </SelectTrigger>
//             <SelectContent>
//               {[...Array(12)].map((_, i) => {
//                 const month = subMonths(new Date(), i);
//                 return (
//                   <SelectItem key={i} value={format(month, "yyyy-MM")}>
//                     {format(month, "MMMM yyyy")}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>

//           {/* Date Range Inputs */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//           </div>

//           {/* Export Button */}
//           <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
//             Export as CSV
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Dates</th>
//                 <th className="px-4 py-2 text-left">Worker Name</th>
//                 <th className="px-4 py-2 text-left">Kgs Processed</th>
//                 <th className="px-4 py-2 text-left">Advances Given</th>
//                 <th className="px-4 py-2 text-left">Net Advances</th>
//                 <th className="px-4 py-2 text-left">Total Amount Earned</th>
//                 <th className="px-4 py-2 text-left">Payouts Made</th>
//                 <th className="px-4 py-2 text-left">Pending Payable</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {dailyLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{log.dates}</td>
//                   <td className="px-4 py-2">{log.workerName}</td>
//                   <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                   <td className="px-4 py-2">{settings.currency} {log.advancesGiven}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.netAdvances}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.totalAmountEarned}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.payoutsMade}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.pendingPayable}</td>
//                 </tr>
//               ))}

//               {/* Totals Row */}
//               <tr className="bg-muted">
//                 <td colSpan={2} className="px-4 py-2 font-bold">
//                   Totals
//                 </td>
//                 <td className="px-4 py-2 font-bold">{dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0)}</td>
//                 <td></td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// Version 3 - working with all workers option and individual logs

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
//   netAdvances: number;
//   totalAmountEarned: number;
//   payoutsMade: number;
//   pendingPayable: number;
// }

// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [selectedWorkerId, setSelectedWorkerId] = useState<string | "all">("all");
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//     // Determine the date range for filtering logs
//     const startOfMonthDate = startDate ? new Date(startDate) : startOfMonth(selectedMonth);
//     const endOfMonthDate = endDate ? new Date(endDate) : endOfMonth(selectedMonth);

//     let logs: WorkerDailyLog[] = [];

//     if (selectedWorkerId === "all") {
//       // Merge logs for all workers
//       logs = firmWorkers
//         .filter((worker) => selectedWorkerId === "all" || worker.id === selectedWorkerId)
//         .map((worker) => {
//           const workerLogsForPeriod = workLogs.filter(
//             (log) =>
//               log.workerId === worker.id &&
//               new Date(log.date) >= startOfMonthDate &&
//               new Date(log.date) <= endOfMonthDate
//           );

//           // Aggregate logs by worker
//           const kgsProcessed = workerLogsForPeriod.reduce((sum, log) => sum + log.kgsProcessed, 0);
//           const totalAmountEarned = workerLogsForPeriod.reduce((sum, log) => sum + log.amountEarned, 0);

//           // Calculate advances and payouts for the period
//           const advancesGiven = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === worker.id &&
//                 payment.type === "advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const advancesCleared = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === worker.id &&
//                 payment.type === "clear_advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const payoutsMade = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === worker.id &&
//                 payment.type === "payout" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const netAdvances = advancesGiven - advancesCleared;
//           const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;

//           // Combine dates into a comma-separated string
//           const dates = workerLogsForPeriod
//             .map((log) => format(new Date(log.date), "MMM dd"))
//             .join(", ");

//           return {
//             date: dates,
//             workerName: worker.name,
//             kgsProcessed,
//             advancesGiven,
//             netAdvances,
//             totalAmountEarned,
//             payoutsMade,
//             pendingPayable,
//           };
//         })
//         .filter((log) => log.date); // Exclude workers with no logs
//     } else {
//       // Show individual logs for the selected worker
//       const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId);
//       if (selectedWorker) {
//         const workerLogsForPeriod = workLogs.filter(
//           (log) =>
//             log.workerId === selectedWorker.id &&
//             new Date(log.date) >= startOfMonthDate &&
//             new Date(log.date) <= endOfMonthDate
//         );

//         logs = workerLogsForPeriod.map((log) => {
//           const advancesGiven = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const advancesCleared = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "clear_advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const payoutsMade = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "payout" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const netAdvances = advancesGiven - advancesCleared;
//           const pendingPayable = log.amountEarned - payoutsMade - netAdvances;

//           return {
//             date: format(new Date(log.date), "dd/MM/yyyy"),
//             workerName: selectedWorker.name,
//             kgsProcessed: log.kgsProcessed,
//             advancesGiven,
//             netAdvances,
//             totalAmountEarned: log.amountEarned,
//             payoutsMade,
//             pendingPayable,
//           };
//         });
//       }
//     }

//     setDailyLogs(logs);
//   }, [workers, workLogs, payments, selectedFirmId, selectedMonth, startDate, endDate, selectedWorkerId]);

//   const exportToCSV = () => {
//     const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
//     const firmName = selectedFirm?.name || "Unknown Firm";

//     const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
//     const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
//     const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
//     const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
//     const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       ["Date", "Worker Name", "Kgs Processed", "Advances Given", "Net Advances", "Total Amount Earned", "Payouts Made", "Pending Payable"],
//       ...dailyLogs.map((log) => [
//         log.date,
//         log.workerName,
//         `${log.kgsProcessed} kg`,
//         `${settings.currency} ${log.advancesGiven}`,
//         `${settings.currency} ${log.netAdvances}`,
//         `${settings.currency} ${log.totalAmountEarned}`,
//         `${settings.currency} ${log.payoutsMade}`,
//         `${settings.currency} ${log.pendingPayable}`,
//       ]),
//       [],
//       ["Totals", "", totalKgsProcessed, totalAdvancesGiven, "", totalAmountEarned, totalPayoutsMade, totalPendingPayable],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(csvData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
//   };

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Worker Daily Logs</CardTitle>
//           <p className="text-sm text-muted-foreground">Please select a firm to view worker daily logs</p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="space-y-4">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           {/* Worker Dropdown */}
//           <Select value={selectedWorkerId} onValueChange={(value) => setSelectedWorkerId(value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Worker" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Workers</SelectItem>
//               {workers.map((worker) => (
//                 <SelectItem key={worker.id} value={worker.id}>
//                   {worker.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Month Dropdown */}
//           <Select value={format(selectedMonth, "yyyy-MM")} onValueChange={(value) => setSelectedMonth(new Date(value))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Month" />
//             </SelectTrigger>
//             <SelectContent>
//               {[...Array(12)].map((_, i) => {
//                 const month = subMonths(new Date(), i);
//                 return (
//                   <SelectItem key={i} value={format(month, "yyyy-MM")}>
//                     {format(month, "MMMM yyyy")}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>

//           {/* Date Range Inputs */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//           </div>

//           {/* Export Button */}
//           <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
//             Export as CSV
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Worker Name</th>
//                 <th className="px-4 py-2 text-left">Kgs Processed</th>
//                 <th className="px-4 py-2 text-left">Advances Given</th>
//                 <th className="px-4 py-2 text-left">Net Advances</th>
//                 <th className="px-4 py-2 text-left">Total Amount Earned</th>
//                 <th className="px-4 py-2 text-left">Payouts Made</th>
//                 <th className="px-4 py-2 text-left">Pending Payable</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {dailyLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{log.date}</td>
//                   <td className="px-4 py-2">{log.workerName}</td>
//                   <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                   <td className="px-4 py-2">{settings.currency} {log.advancesGiven}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.netAdvances}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.totalAmountEarned}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.payoutsMade}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.pendingPayable}</td>
//                 </tr>
//               ))}

//               {/* Totals Row */}
//               <tr className="bg-muted">
//                 <td colSpan={2} className="px-4 py-2 font-bold">
//                   Totals
//                 </td>
//                 <td className="px-4 py-2 font-bold">{dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0)}</td>
//                 <td></td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { format, startOfMonth, endOfMonth, parseISO, subMonths } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore } from "@/lib/store";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// interface WorkerDailyLog {
//   date: string; // Date in dd/MM/yyyy format
//   workerName: string;
//   kgsProcessed: number;
//   advancesGiven: number;
//   netAdvances: number;
//   totalAmountEarned: number;
//   payoutsMade: number;
//   pendingPayable: number;
// }



// export function WorkerDailyLogTable() {
//   const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [selectedWorkerId, setSelectedWorkerId] = useState<string | "all">("all");
//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);

//     // Determine the date range for filtering logs
//     const startOfMonthDate = startDate ? new Date(startDate) : startOfMonth(selectedMonth);
//     const endOfMonthDate = endDate ? new Date(endDate) : endOfMonth(selectedMonth);

//     let logs: WorkerDailyLog[] = [];

//     if (selectedWorkerId === "all") {
//       // Merge logs for all workers
//       logs = firmWorkers
//         .filter((worker) => selectedWorkerId === "all" || worker.id === selectedWorkerId)
//         .map((worker) => {
//           const workerLogsForPeriod = workLogs
//             .filter(
//               (log) =>
//                 log.workerId === worker.id &&
//                 new Date(log.date) >= startOfMonthDate &&
//                 new Date(log.date) <= endOfMonthDate
//             )
//             .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort dates in ascending order

//           // Aggregate logs by worker
//           const kgsProcessed = workerLogsForPeriod.reduce((sum, log) => sum + log.kgsProcessed, 0);
//           const totalAmountEarned = workerLogsForPeriod.reduce((sum, log) => sum + log.amountEarned, 0);

//           // // Calculate advances and payouts for the period
//           // const advancesGiven = payments
//           //   .filter(
//           //     (payment) =>
//           //       payment.workerId === worker.id &&
//           //       payment.type === "advance" &&
//           //       new Date(payment.date) >= startOfMonthDate &&
//           //       new Date(payment.date) <= endOfMonthDate
//           //   )
//           //   .reduce((sum, payment) => sum + payment.amount, 0);

//           // const advancesCleared = payments
//           //   .filter(
//           //     (payment) =>
//           //       payment.workerId === worker.id &&
//           //       payment.type === "clear_advance" &&
//           //       new Date(payment.date) >= startOfMonthDate &&
//           //       new Date(payment.date) <= endOfMonthDate
//           //   )
//           //   .reduce((sum, payment) => sum + payment.amount, 0);

//           // const payoutsMade = payments
//           //   .filter(
//           //     (payment) =>
//           //       payment.workerId === worker.id &&
//           //       payment.type === "payout" &&
//           //       new Date(payment.date) >= startOfMonthDate &&
//           //       new Date(payment.date) <= endOfMonthDate
//           //   )
//           //   .reduce((sum, payment) => sum + payment.amount, 0);

//           // const netAdvances = advancesGiven - advancesCleared;
//           // const pendingPayable = totalAmountEarned - payoutsMade - netAdvances;


//           const advancesGiven = payments
//             .filter((payment) => payment.workerId === worker.id && payment.type === "advance")
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const advancesCleared = payments
//             .filter((payment) => payment.workerId === worker.id && payment?.type === "clear_advance")
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const payoutsMade = payments
//             .filter((payment) => payment.workerId === worker.id && payment.type === "payout")
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const netAdvances = advancesGiven - advancesCleared;
//           const pendingPayable = worker.totalAmount - netAdvances - payoutsMade;

//           // Combine dates into a comma-separated string
//           const dates = workerLogsForPeriod
//             .map((log) => format(parseISO(log.date), "MMM dd"))
//             .join(", ");

//           return {
//             date: dates,
//             workerName: worker.name,
//             kgsProcessed,
//             advancesGiven,
//             netAdvances,
//             totalAmountEarned,
//             payoutsMade,
//             pendingPayable,
//           };
//         })
//         .filter((log) => log.date); // Exclude workers with no logs
//     } else {
//       // Show individual logs for the selected worker
//       const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId);
//       if (selectedWorker) {
//         const workerLogsForPeriod = workLogs
//           .filter(
//             (log) =>
//               log.workerId === selectedWorker.id &&
//               new Date(log.date) >= startOfMonthDate &&
//               new Date(log.date) <= endOfMonthDate
//           )
//           .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort dates in ascending order

//         logs = workerLogsForPeriod.map((log) => {
//           const advancesGiven = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const advancesCleared = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "clear_advance" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const payoutsMade = payments
//             .filter(
//               (payment) =>
//                 payment.workerId === selectedWorker.id &&
//                 payment.type === "payout" &&
//                 new Date(payment.date) >= startOfMonthDate &&
//                 new Date(payment.date) <= endOfMonthDate
//             )
//             .reduce((sum, payment) => sum + payment.amount, 0);

//           const netAdvances = advancesGiven - advancesCleared;
//           const pendingPayable = log.amountEarned - payoutsMade - netAdvances;

//           return {
//             date: format(parseISO(log.date), "dd/MM/yyyy"),
//             workerName: selectedWorker.name,
//             kgsProcessed: log.kgsProcessed,
//             advancesGiven,
//             netAdvances,
//             totalAmountEarned: log.amountEarned,
//             payoutsMade,
//             pendingPayable,
//           };
//         });
//       }
//     }

//     setDailyLogs(logs);
//   }, [workers, workLogs, payments, selectedFirmId, selectedMonth, startDate, endDate, selectedWorkerId]);

//   const exportToCSV = () => {
//     const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
//     const firmName = selectedFirm?.name || "Unknown Firm";

//     const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
//     const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
//     const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
//     const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
//     const totalPendingPayable = dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0);

//     const csvData = [
//       ["Firm Name", firmName],
//       ["Month", format(selectedMonth, "MMMM yyyy")],
//       [],
//       ["Date", "Worker Name", "Kgs Processed", "Advances Given", "Total Amount Earned", "Payouts Made", "Pending Payable"],
//       ...dailyLogs.map((log) => [
//         log.date,
//         log.workerName,
//         `${log.kgsProcessed} kg`,
//         `${settings.currency} ${log.advancesGiven}`,
//         // `${settings.currency} ${log.netAdvances}`,
//         `${settings.currency} ${log.totalAmountEarned}`,
//         `${settings.currency} ${log.payoutsMade}`,
//         `${settings.currency} ${log.pendingPayable}`,
//       ]),
//       [],
//       ["Totals", "", totalKgsProcessed, totalAdvancesGiven, totalAmountEarned, totalPayoutsMade, totalPendingPayable],
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(csvData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Logs");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(blob, `monthly_logs_${format(selectedMonth, "yyyy-MM")}.xlsx`);
//   };

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Worker Daily Logs</CardTitle>
//           <p className="text-sm text-muted-foreground">Please select a firm to view worker daily logs</p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="space-y-4">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg sm:text-xl font-bold">Worker Daily Logs</CardTitle>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           {/* Worker Dropdown */}
//           <Select value={selectedWorkerId} onValueChange={(value) => setSelectedWorkerId(value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Worker" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Workers</SelectItem>
//               {workers.map((worker) => (
//                 <SelectItem key={worker.id} value={worker.id}>
//                   {worker.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Month Dropdown */}
//           <Select value={format(selectedMonth, "yyyy-MM")} onValueChange={(value) => setSelectedMonth(new Date(value))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Month" />
//             </SelectTrigger>
//             <SelectContent>
//               {[...Array(12)].map((_, i) => {
//                 const month = new Date(new Date().setMonth(new Date().getMonth() - i));
//                 return (
//                   <SelectItem key={i} value={format(month, "yyyy-MM")}>
//                     {format(month, "MMMM yyyy")}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>

//           {/* Date Range Inputs */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="border rounded px-2 py-1"
//             />
//           </div>

//           {/* Export Button */}
//           <Button onClick={exportToCSV} disabled={dailyLogs.length === 0} className="w-full sm:w-auto">
//             Export as CSV
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Worker Name</th>
//                 <th className="px-4 py-2 text-left">Kgs Processed</th>
//                 <th className="px-4 py-2 text-left">Advances Given</th>
//                 {/* <th className="px-4 py-2 text-left">Net Advances</th> */}
//                 <th className="px-4 py-2 text-left">Total Amount Earned</th>
//                 <th className="px-4 py-2 text-left">Payouts Made</th>
//                 <th className="px-4 py-2 text-left">Pending Payable</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {dailyLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{log.date}</td>
//                   <td className="px-4 py-2">{log.workerName}</td>
//                   <td className="px-4 py-2">{log.kgsProcessed} kg</td>
//                   <td className="px-4 py-2">{settings.currency} {log.advancesGiven}</td>
//                   {/* <td className="px-4 py-2">{settings.currency} {log.netAdvances}</td> */}
//                   <td className="px-4 py-2">{settings.currency} {log.totalAmountEarned}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.payoutsMade}</td>
//                   <td className="px-4 py-2">{settings.currency} {log.pendingPayable}</td>
//                 </tr>
//               ))}

//               {/* Totals Row */}
//               <tr className="bg-muted">
//                 <td colSpan={2} className="px-4 py-2 font-bold">
//                   Totals
//                 </td>
//                 <td className="px-4 py-2 font-bold">{dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0)} kg</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0)}</td>
//                 <td className="px-4 py-2 font-bold">{settings.currency} {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, parseISO, isSameDay, isAfter, isBefore, isEqual } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore } from "@/lib/store";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { CalendarIcon, Download } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";

interface WorkerDailyLog {
  date: string; // Date in dd/MM/yyyy format
  workerName: string;
  kgsProcessed: number;
  advancesGiven: number;
  payoutsMade: number;
  totalAmountEarned: number;
  pendingPayable: number;
  rawDate?: Date; // For sorting
}

export function WorkerDailyLogTable() {
  const [dailyLogs, setDailyLogs] = useState<WorkerDailyLog[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth(new Date()));
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | "all">("all");
  const [viewType, setViewType] = useState<"monthly" | "custom">("monthly");
  const { workers } = useWorkersStore();
  const { workLogs, payments } = useLogsStore();
  const { firms, selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();
  const { theme } = useTheme();

  // Update date range when month changes
  useEffect(() => {
    if (viewType === "monthly" && selectedMonth) {
      setStartDate(startOfMonth(selectedMonth));
      setEndDate(endOfMonth(selectedMonth));
    }
  }, [selectedMonth, viewType]);

  // Main data processing effect
  useEffect(() => {
    if (!selectedFirmId) return;

    const firmWorkers = workers.filter((worker) => worker.firmId === selectedFirmId);
    
    // Ensure we have valid dates
    const startOfPeriod = startDate || startOfMonth(selectedMonth);
    const endOfPeriod = endDate || endOfMonth(selectedMonth);

    let logs: WorkerDailyLog[] = [];

    if (selectedWorkerId === "all") {
      // Process data for all workers (summary view)
      logs = firmWorkers.map((worker) => {
        // Get all work logs for this worker within the period
        const workerLogsInPeriod = workLogs.filter(
          (log) => 
            log.workerId === worker.id &&
            isAfter(new Date(log.date), new Date(startOfPeriod.setHours(0, 0, 0, 0))) &&
            isBefore(new Date(log.date), new Date(endOfPeriod.setHours(23, 59, 59, 999)))
        );
        
        // Calculate total kgs processed and amount earned in this period
        const kgsProcessed = workerLogsInPeriod.reduce((sum, log) => sum + log.kgsProcessed, 0);
        const periodAmountEarned = workerLogsInPeriod.reduce((sum, log) => sum + log.amountEarned, 0);
        
        // Get payments within the period
        const periodAdvances = payments.filter(
          (payment) => 
            payment.workerId === worker.id && 
            payment.type === "advance" &&
            isAfter(new Date(payment.date), new Date(startOfPeriod.setHours(0, 0, 0, 0))) &&
            isBefore(new Date(payment.date), new Date(endOfPeriod.setHours(23, 59, 59, 999)))
        );
        
        const periodPayouts = payments.filter(
          (payment) => 
            payment.workerId === worker.id && 
            payment.type === "payout" &&
            isAfter(new Date(payment.date), new Date(startOfPeriod.setHours(0, 0, 0, 0))) &&
            isBefore(new Date(payment.date), new Date(endOfPeriod.setHours(23, 59, 59, 999)))
        );
        
        // Calculate totals for the period
        const advancesGiven = periodAdvances.reduce((sum, payment) => sum + payment.amount, 0);
        const payoutsMade = periodPayouts.reduce((sum, payment) => sum + payment.amount, 0);
        
        // For accurate pending payable, calculate total lifetime values
        const totalAdvancesGiven = payments
          .filter(payment => payment.workerId === worker.id && payment.type === "advance")
          .reduce((sum, payment) => sum + payment.amount, 0);
          
        const totalAdvancesCleared = payments
          .filter(payment => payment.workerId === worker.id && payment.type === "clear_advance")
          .reduce((sum, payment) => sum + payment.amount, 0);
          
        const totalPayoutsMade = payments
          .filter(payment => payment.workerId === worker.id && payment.type === "payout")
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculate the net advances (outstanding)
        const netAdvances = totalAdvancesGiven - totalAdvancesCleared;
        
        // Calculate pending payable based on worker's total lifetime earnings minus advances and payouts
        const pendingPayable = worker.totalAmount - netAdvances - totalPayoutsMade;
        
        // Create a comma-separated string of dates with activity
        const activeDates = [...new Set([
          ...workerLogsInPeriod.map(log => format(new Date(log.date), "MMM dd")),
          ...periodAdvances.map(payment => format(new Date(payment.date), "MMM dd")),
          ...periodPayouts.map(payment => format(new Date(payment.date), "MMM dd"))
        ])].sort().join(", ");
        
        return {
          date: activeDates || "No activity",
          workerName: worker.name,
          kgsProcessed,
          advancesGiven,
          payoutsMade,
          totalAmountEarned: periodAmountEarned,
          pendingPayable,
          rawDate: endOfPeriod // For sorting
        };
      }).filter(log => 
        log.kgsProcessed > 0 || log.advancesGiven > 0 || log.payoutsMade > 0
      );
    } else {
      // Show daily logs for the selected worker
      const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId);
      
      if (selectedWorker) {
        // Get all dates in the period where there was activity
        const allActiveDates = new Set<string>();
        
        // Add dates from work logs
        workLogs
          .filter(log => 
            log.workerId === selectedWorker.id &&
            isAfter(new Date(log.date), new Date(startOfPeriod.setHours(0, 0, 0, 0))) &&
            isBefore(new Date(log.date), new Date(endOfPeriod.setHours(23, 59, 59, 999)))
          )
          .forEach(log => allActiveDates.add(format(new Date(log.date), "yyyy-MM-dd")));
          
        // Add dates from payments
        payments
          .filter(payment => 
            payment.workerId === selectedWorker.id &&
            (payment.type === "advance" || payment.type === "payout" || payment.type === "clear_advance") &&
            isAfter(new Date(payment.date), new Date(startOfPeriod.setHours(0, 0, 0, 0))) &&
            isBefore(new Date(payment.date), new Date(endOfPeriod.setHours(23, 59, 59, 999)))
          )
          .forEach(payment => allActiveDates.add(format(new Date(payment.date), "yyyy-MM-dd")));
        
        // Sort the dates
        const sortedDates = Array.from(allActiveDates).sort();
        
        // Calculate cumulative totals up to the start of our period
        // This gives us the starting point for our running calculations
        const beforePeriodLogs = workLogs.filter(log => 
          log.workerId === selectedWorker.id &&
          isBefore(new Date(log.date), new Date(startOfPeriod))
        );
        
        const beforePeriodEarnings = beforePeriodLogs.reduce(
          (sum, log) => sum + log.amountEarned, 0
        );
        
        const beforePeriodAdvances = payments
          .filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "advance" &&
            isBefore(new Date(payment.date), new Date(startOfPeriod))
          )
          .reduce((sum, payment) => sum + payment.amount, 0);
          
        const beforePeriodAdvancesCleared = payments
          .filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "clear_advance" &&
            isBefore(new Date(payment.date), new Date(startOfPeriod))
          )
          .reduce((sum, payment) => sum + payment.amount, 0);
          
        const beforePeriodPayouts = payments
          .filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "payout" &&
            isBefore(new Date(payment.date), new Date(startOfPeriod))
          )
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Starting values for running totals
        let runningEarnings = beforePeriodEarnings;
        let runningAdvances = beforePeriodAdvances;
        let runningAdvancesCleared = beforePeriodAdvancesCleared;
        let runningPayouts = beforePeriodPayouts;
        
        // Create daily logs
        logs = sortedDates.map(dateStr => {
          const date = new Date(dateStr);
          
          // Get work logs for this specific day
          const dayLogs = workLogs.filter(log => 
            log.workerId === selectedWorker.id && 
            isSameDay(new Date(log.date), date)
          );
          
          // Get payments for this specific day
          const dayAdvances = payments.filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "advance" && 
            isSameDay(new Date(payment.date), date)
          );
          
          const dayAdvancesCleared = payments.filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "clear_advance" && 
            isSameDay(new Date(payment.date), date)
          );
          
          const dayPayouts = payments.filter(payment => 
            payment.workerId === selectedWorker.id && 
            payment.type === "payout" && 
            isSameDay(new Date(payment.date), date)
          );
          
          // Calculate day totals
          const dayKgsProcessed = dayLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
          const dayEarnings = dayLogs.reduce((sum, log) => sum + log.amountEarned, 0);
          const dayAdvancesAmount = dayAdvances.reduce((sum, payment) => sum + payment.amount, 0);
          const dayAdvancesClearedAmount = dayAdvancesCleared.reduce((sum, payment) => sum + payment.amount, 0);
          const dayPayoutsAmount = dayPayouts.reduce((sum, payment) => sum + payment.amount, 0);
          
          // Update running totals
          runningEarnings += dayEarnings;
          runningAdvances += dayAdvancesAmount;
          runningAdvancesCleared += dayAdvancesClearedAmount;
          runningPayouts += dayPayoutsAmount;
          
          // Calculate net advances and pending payable as of this day
          const netAdvances = runningAdvances - runningAdvancesCleared;
          const pendingPayable = runningEarnings - netAdvances - runningPayouts;
          
          return {
            date: format(date, "dd/MM/yyyy"),
            workerName: selectedWorker.name,
            kgsProcessed: dayKgsProcessed,
            advancesGiven: dayAdvancesAmount,
            payoutsMade: dayPayoutsAmount,
            totalAmountEarned: dayEarnings,
            pendingPayable: pendingPayable,
            rawDate: date // For sorting
          };
        });
      }
    }
    
    // Sort logs by date (most recent first for all workers, chronological for single worker)
    if (selectedWorkerId === "all") {
      logs.sort((a, b) => b.workerName.localeCompare(a.workerName));
    } else {
      logs.sort((a, b) => (a.rawDate?.getTime() || 0) - (b.rawDate?.getTime() || 0));
    }
    
    setDailyLogs(logs);
  }, [workers, workLogs, payments, selectedFirmId, selectedMonth, startDate, endDate, selectedWorkerId]);

  const exportToExcel = () => {
    const selectedFirm = firms.find((firm) => firm.id === selectedFirmId);
    const firmName = selectedFirm?.name || "Unknown Firm";
    
    const dateRangeText = startDate && endDate 
      ? `${format(startDate, "dd MMM yyyy")} to ${format(endDate, "dd MMM yyyy")}`
      : format(selectedMonth, "MMMM yyyy");

    const workerName = selectedWorkerId !== "all"
      ? workers.find(w => w.id === selectedWorkerId)?.name || "Unknown Worker"
      : "All Workers";

    const totalKgsProcessed = dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
    const totalAdvancesGiven = dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0);
    const totalAmountEarned = dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0);
    const totalPayoutsMade = dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0);
    const totalPendingPayable = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1].pendingPayable : 0;

    const excelData = [
      ["Firm Name", firmName],
      ["Period", dateRangeText],
      ["Worker", workerName],
      [],
      ["Date", "Worker Name", "Kgs Processed", "Advances Given", "Amount Earned", "Payouts Made", "Pending Payable"],
      ...dailyLogs.map((log) => [
        log.date,
        log.workerName,
        log.kgsProcessed,
        log.advancesGiven,
        log.totalAmountEarned,
        log.payoutsMade,
        log.pendingPayable,
      ]),
      [],
      ["Totals", "", totalKgsProcessed, totalAdvancesGiven, totalAmountEarned, totalPayoutsMade, totalPendingPayable],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    // Format numbers with currency
    [3, 4, 5, 6].forEach(col => {
      for (let row = 5; row < 5 + dailyLogs.length; row++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].z = settings.currency === '₹' ? '[$₹]#,##0.00' : '$#,##0.00';
        }
      }
      // Format totals row
      const totalCellRef = XLSX.utils.encode_cell({ r: 5 + dailyLogs.length + 2, c: col });
      if (worksheet[totalCellRef]) {
        worksheet[totalCellRef].z = settings.currency === '₹' ? '[$₹]#,##0.00' : '$#,##0.00';
      }
    });
    
    // Format kg column
    for (let row = 5; row < 5 + dailyLogs.length; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: 2 });
      if (worksheet[cellRef]) {
        worksheet[cellRef].z = '#,##0.00 "kg"';
      }
    }
    const kgTotalCellRef = XLSX.utils.encode_cell({ r: 5 + dailyLogs.length + 2, c: 2 });
    if (worksheet[kgTotalCellRef]) {
      worksheet[kgTotalCellRef].z = '#,##0.00 "kg"';
    }
    
    // Apply styling (bold headers)
    const headerRow = 4;
    for (let col = 0; col < 7; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { t: 's', v: '' };
      worksheet[cellRef].s = { font: { bold: true } };
    }
    
    // Apply styling (bold totals)
    const totalsRow = 5 + dailyLogs.length + 2;
    for (let col = 0; col < 7; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: totalsRow, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { t: 's', v: '' };
      worksheet[cellRef].s = { font: { bold: true } };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Worker Logs");
    
    // Column widths
    worksheet['!cols'] = [
      { wch: 12 }, // Date
      { wch: 20 }, // Worker Name
      { wch: 15 }, // Kgs
      { wch: 15 }, // Advances
      { wch: 15 }, // Amount
      { wch: 15 }, // Payouts
      { wch: 15 }, // Pending
    ];
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
    // Construct filename
    let filename = "worker_logs";
    if (selectedWorkerId !== "all") {
      const worker = workers.find(w => w.id === selectedWorkerId);
      if (worker) filename += `_${worker.name.toLowerCase().replace(/\s+/g, "_")}`;
    }
    
    if (startDate && endDate) {
      filename += `_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}`;
    } else {
      filename += `_${format(selectedMonth, "yyyy-MM")}`;
    }
    
    saveAs(blob, `${filename}.xlsx`);
  };

  if (!selectedFirmId) {
    return (
      <Card className="shadow-md border-0 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Worker Daily Logs</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please select a firm to view worker daily logs</p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-0 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
            Worker Daily Logs
          </CardTitle>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
          {/* Worker Dropdown */}
          <div className="w-full sm:w-auto">
            <Select value={selectedWorkerId} onValueChange={(value) => setSelectedWorkerId(value)}>
              <SelectTrigger className="w-full sm:w-48 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Worker" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all">All Workers</SelectItem>
                {workers
                  .filter(worker => worker.firmId === selectedFirmId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Month Dropdown */}
          <div className="w-full sm:w-auto">
            <Select 
              value={format(selectedMonth, "yyyy-MM")} 
              onValueChange={(value) => setSelectedMonth(new Date(value))}
            >
              <SelectTrigger className="w-full sm:w-48 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => {
                  const month = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
                  return (
                    <SelectItem key={i} value={format(month, "yyyy-MM")}>
                      {format(month, "MMMM yyyy")}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal focus:ring-2 focus:ring-blue-500"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd MMM yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-gray-500">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal focus:ring-2 focus:ring-blue-500"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd MMM yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Export Button */}
          <Button 
            onClick={exportToExcel} 
            disabled={dailyLogs.length === 0} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export as Excel
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Worker Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kgs Processed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Advances Given</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Amount Earned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payouts Made</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pending Payable</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dailyLogs.length > 0 ? (
                dailyLogs.map((log, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{log.workerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.kgsProcessed.toFixed(1)} kg</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{settings.currency} {log.advancesGiven.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{settings.currency} {log.totalAmountEarned.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{settings.currency} {log.payoutsMade.toFixed(2)}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${log.pendingPayable < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {settings.currency} {log.pendingPayable.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No logs found for the selected period
                  </td>
                </tr>
              )}

              {/* Totals Row */}
              {dailyLogs.length > 0 && (
                <tr className="bg-gray-100 dark:bg-gray-700 font-semibold text-sm">
                  <td colSpan={2} className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                    Totals
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                    {dailyLogs.reduce((sum, log) => sum + log.kgsProcessed, 0).toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                    {settings.currency} {dailyLogs.reduce((sum, log) => sum + log.advancesGiven, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                    {settings.currency} {dailyLogs.reduce((sum, log) => sum + log.totalAmountEarned, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                    {settings.currency} {dailyLogs.reduce((sum, log) => sum + log.payoutsMade, 0).toFixed(2)}
                  </td>
                  {/* <td className={`px-4 py-3 whitespace-nowrap font-bold ${dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {settings.currency} {dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0).toFixed(2)}
                  </td> */}
                  <td className={`px-4 py-3 whitespace-nowrap font-bold ${dailyLogs.reduce((sum, log) => sum + log.pendingPayable, 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {settings.currency} {dailyLogs.reduce((sum, log) => log.pendingPayable, 0).toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}