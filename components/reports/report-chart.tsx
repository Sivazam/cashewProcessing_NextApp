"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLogsStore, useFirmsStore } from "@/lib/store";

interface ReportChartProps {
  dateRange: DateRange | undefined;
}

export function ReportChart({ dateRange }: ReportChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const { workLogs } = useLogsStore();
  const { selectedFirmId } = useFirmsStore();

  useEffect(() => {
    if (!selectedFirmId || !dateRange?.from) return;

    const filteredLogs = workLogs.filter((log) => {
      const logDate = parseISO(log.date);
      return (
        log.firmId === selectedFirmId &&
        isWithinInterval(logDate, {
          start: dateRange.from!,
          end: dateRange.to || dateRange.from!,
        })
      );
    });

    // Group logs by date
    const groupedData: Record<string, { date: string; kgs: number; amount: number }> = {};

    filteredLogs.forEach((log) => {
      const date = log.date;
      if (!groupedData[date]) {
        groupedData[date] = {
          date,
          kgs: 0,
          amount: 0,
        };
      }
      groupedData[date].kgs += log.kgsProcessed;
      groupedData[date].amount += log.amountEarned;
    });

    // Convert to array and sort by date
    const chartDataArray = Object.values(groupedData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format dates for display
    const formattedData = chartDataArray.map((item) => ({
      ...item,
      formattedDate: format(parseISO(item.date), "MMM dd"),
    }));

    setChartData(formattedData);
  }, [workLogs, selectedFirmId, dateRange]);

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Report</CardTitle>
          <CardDescription>
            Please select a firm to view reports
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dateRange?.from) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Report</CardTitle>
          <CardDescription>
            Please select a date range to view reports
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Report</CardTitle>
        <CardDescription>
          {dateRange.from && dateRange.to
            ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
            : dateRange.from
            ? `${format(dateRange.from, "PPP")}`
            : "Select date range"}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No data available for selected period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="kgs"
                name="Kilograms Processed"
                fill="hsl(var(--chart-1))"
              />
              <Bar
                yAxisId="right"
                dataKey="amount"
                name="Amount Payable"
                fill="hsl(var(--chart-2))"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}