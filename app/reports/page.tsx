"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { MainNav } from "@/components/layout/main-nav";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { ReportChart } from "@/components/reports/report-chart";
import { WorkerPerformance } from "@/components/reports/worker-performance";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
            className="w-full md:w-auto"
          />
        </div>
        
        <div className="space-y-4">
          <ReportChart dateRange={dateRange} />
          <WorkerPerformance dateRange={dateRange} />
        </div>
      </div>
     </div>
  );
}