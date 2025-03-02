// // import { MainNav } from "@/components/layout/main-nav";
// // import { DailySummary } from "@/components/dashboard/daily-summary";
// // import { RecentActivity } from "@/components/dashboard/recent-activity";
// // import { SummaryCard } from "@/components/dashboard/summary-card";
// // import { 
// //   Package, 
// //   Users, 
// //   Wallet, 
// //   ArrowUpRight 
// // } from "lucide-react";

// // export default function Home() {
// //   return (
// //     <div className="flex min-h-screen flex-col">
// //       <MainNav />
// //       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
// //         <div className="flex items-center justify-between">
// //           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
// //         </div>
        
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           <SummaryCard
// //             title="Total Workers"
// //             value={0}
// //             icon={<Users className="h-4 w-4" />}
// //             description="Active workers in selected firm"
// //           />
// //           <SummaryCard
// //             title="Total Processed"
// //             value={0}
// //             type="kg"
// //             icon={<Package className="h-4 w-4" />}
// //             description="Total kilograms processed"
// //           />
// //           <SummaryCard
// //             title="Total Payable"
// //             value={0}
// //             type="currency"
// //             icon={<Wallet className="h-4 w-4" />}
// //             description="Amount to be paid to workers"
// //           />
// //           <SummaryCard
// //             title="Total Advances"
// //             value={0}
// //             type="currency"
// //             icon={<ArrowUpRight className="h-4 w-4" />}
// //             description="Advances given to workers"
// //           />
// //         </div>
        
// //         <div className="grid gap-4 md:grid-cols-2">
// //           <DailySummary />
// //           <RecentActivity />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { MainNav } from "@/components/layout/main-nav";
// import { DailySummary } from "@/components/dashboard/daily-summary";
// import { RecentActivity } from "@/components/dashboard/recent-activity";
// import { SummaryCard } from "@/components/dashboard/summary-card";
// import { WorkerDailyLogTable } from "@/components/dashboard/worker-daily-log-table";
// import { Last7DaysSummaryTable } from "@/components/dashboard/last-7-days-summary-table";
// import {
//   Package,
//   Users,
//   Wallet,
//   ArrowUpRight,
// } from "lucide-react";
// import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore, initializePayoutsMade } from "@/lib/store";
// import { useEffect } from "react";

// export default function Home() {

//   useEffect(() => {
//     initializePayoutsMade()

//   },[])


//   const { workers } = useWorkersStore();
//   const { workLogs, payments } = useLogsStore();
//   const { selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   // Calculate summary values
//   const totalWorkers = workers.filter((worker) => worker.firmId === selectedFirmId).length;

//   const totalProcessed = workLogs
//     .filter((log) => log.firmId === selectedFirmId)
//     .reduce((sum, log) => sum + log.kgsProcessed, 0);


// // Calculate total payable for all workers in the selected firm
// const totalPayable = workers
//   .filter((worker) => worker.firmId === selectedFirmId)
//   .reduce((sum, worker) => {
//     // Calculate total advances given to the worker
//     const advancesGiven = payments
//       .filter(
//         (payment) =>
//           payment.workerId === worker.id &&
//           payment.type === "advance"
//       )
//       .reduce((acc, payment) => acc + payment.amount, 0);

//     // Calculate total advances cleared for the worker
//     const advancesCleared = payments
//       .filter(
//         (payment) =>
//           payment.workerId === worker.id &&
//           payment.type === "clear_advance"
//       )
//       .reduce((acc, payment) => acc + payment.amount, 0);

//     // Calculate net advances
//     const netAdvances = advancesGiven - advancesCleared;

//     // Calculate total payable for the worker
//     return sum + worker.totalAmount - netAdvances;
//   }, 0);

//   const totalAdvances = payments
//     .filter((payment) => payment.firmId === selectedFirmId && payment.type === "advance")
//     .reduce((sum, payment) => sum + payment.amount, 0);

//   return (
//     <div className="flex min-h-screen flex-col">
//       <MainNav />
//       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//         </div>

//          {/* Summary Cards */}
//          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <SummaryCard
//             title="Total Workers"
//             value={totalWorkers}
//             icon={<Users className="h-4 w-4" />}
//             description="Active workers in selected firm"
//           />
//           <SummaryCard
//             title="Total Processed"
//             value={totalProcessed}
//             type="kg"
//             icon={<Package className="h-4 w-4" />}
//             description="Total kilograms processed"
//           />
//           <SummaryCard
//             title="Total Payable"
//             value={totalPayable}
//             type="currency"
//             icon={<Wallet className="h-4 w-4" />}
//             description="Amount to be paid to workers"
//           />
//           <SummaryCard
//             title="Total Advances"
//             value={totalAdvances}
//             type="currency"
//             icon={<ArrowUpRight className="h-4 w-4" />}
//             description="Advances given to workers"
//           />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <DailySummary />
//           <Last7DaysSummaryTable />
//         </div>

//         {/* Worker Daily Log Table */}
//         <WorkerDailyLogTable />

//         {/* Last 7 Days Summary Table */}
       
//         <RecentActivity />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DailySummary } from "@/components/dashboard/daily-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { WorkerDailyLogTable } from "@/components/dashboard/worker-daily-log-table";
import { Last7DaysSummaryTable } from "@/components/dashboard/last-7-days-summary-table";
import {
  Package,
  Users,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { useWorkersStore, useLogsStore, useFirmsStore, useSettingsStore, initializePayoutsMade } from "@/lib/store";

export default function Home() {
  // Initialize payoutsMade for all workers on component mount
  useEffect(() => {
    initializePayoutsMade();
  }, []);

  const { workers } = useWorkersStore();
  const { workLogs, payments } = useLogsStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();

  // Calculate summary values
  const totalWorkers = workers.filter((worker) => worker.firmId === selectedFirmId).length;

  const totalProcessed = workLogs
    .filter((log) => log.firmId === selectedFirmId)
    .reduce((sum, log) => sum + log.kgsProcessed, 0);

  // Calculate total payable for all workers in the selected firm
  const totalPayable = workers
    .filter((worker) => worker.firmId === selectedFirmId)
    .reduce((sum, worker) => {
      // Calculate total advances given to the worker
      const advancesGiven = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id &&
            payment.type === "advance"
        )
        .reduce((acc, payment) => acc + payment.amount, 0);

      // Calculate total advances cleared for the worker
      const advancesCleared = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id &&
            payment.type === "clear_advance"
        )
        .reduce((acc, payment) => acc + payment.amount, 0);

      // Calculate net advances
      const netAdvances = advancesGiven - advancesCleared;

      // Calculate total payouts made to the worker
      const payoutsMade = payments
        .filter(
          (payment) =>
            payment.workerId === worker.id &&
            payment.type === "payout"
        )
        .reduce((acc, payment) => acc + payment.amount, 0);

      // Calculate total payable for the worker
      return sum + worker.totalAmount - netAdvances - payoutsMade;
    }, 0);

  const totalAdvances = payments
    .filter((payment) => payment.firmId === selectedFirmId && payment.type === "advance")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex min-h-screen flex-col pb-20">
      {/* Main Navigation */}
      <MainNav />

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Workers"
            value={totalWorkers}
            icon={<Users className="h-4 w-4" />}
            description="Active workers in selected firm"
          />
          <SummaryCard
            title="Total Processed"
            value={totalProcessed}
            type="kg"
            icon={<Package className="h-4 w-4" />}
            description="Total kilograms processed"
          />
          <SummaryCard
            title="Total Balance Payable"
            value={totalPayable}
            type="currency"
            icon={<Wallet className="h-4 w-4" />}
            description="Amount to be paid to workers"
          />
          <SummaryCard
            title="Total Advances Given"
            value={totalAdvances}
            type="currency"
            icon={<ArrowUpRight className="h-4 w-4" />}
            description="Advances given to workers"
          />
        </div>

        {/* Daily Summary and Last 7 Days Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <DailySummary />
          <Last7DaysSummaryTable />
        </div>

        {/* Worker Daily Log Table */}
        <WorkerDailyLogTable />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}