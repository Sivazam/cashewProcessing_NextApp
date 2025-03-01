"use client";

import { useState, useEffect } from "react";
import { parseISO, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";

interface WorkerPerformanceProps {
  dateRange: DateRange | undefined;
}

interface WorkerPerformanceData {
  workerId: string;
  name: string;
  totalKgs: number;
  totalAmount: number;
  daysWorked: number;
  avgKgsPerDay: number;
}

export function WorkerPerformance({ dateRange }: WorkerPerformanceProps) {
  const [performanceData, setPerformanceData] = useState<WorkerPerformanceData[]>([]);
  const { workLogs } = useLogsStore();
  const { workers } = useWorkersStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();

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

    // Group logs by worker
    const workerData: Record<string, WorkerPerformanceData> = {};

    filteredLogs.forEach((log) => {
      const { workerId, kgsProcessed, amountEarned, date } = log;
      const worker = workers.find((w) => w.id === workerId);
      
      if (!worker) return;
      
      if (!workerData[workerId]) {
        workerData[workerId] = {
          workerId,
          name: worker.name,
          totalKgs: 0,
          totalAmount: 0,
          daysWorked: 0,
          avgKgsPerDay: 0,
        };
      }
      
      workerData[workerId].totalKgs += kgsProcessed;
      workerData[workerId].totalAmount += amountEarned;
      
      // Count unique days worked
      const uniqueDays = new Set();
      filteredLogs
        .filter((l) => l.workerId === workerId)
        .forEach((l) => uniqueDays.add(l.date));
      
      workerData[workerId].daysWorked = uniqueDays.size;
      workerData[workerId].avgKgsPerDay = 
        uniqueDays.size > 0 
          ? workerData[workerId].totalKgs / uniqueDays.size 
          : 0;
    });

    // Convert to array and sort by total kgs
    const performanceArray = Object.values(workerData).sort(
      (a, b) => b.totalKgs - a.totalKgs
    );

    setPerformanceData(performanceArray);
  }, [workLogs, workers, selectedFirmId, dateRange]);

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Worker Performance</CardTitle>
          <CardDescription>
            Please select a firm to view worker performance
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dateRange?.from) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Worker Performance</CardTitle>
          <CardDescription>
            Please select a date range to view worker performance
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Worker Performance</CardTitle>
        <CardDescription>
          Comparison of worker productivity during selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {performanceData.length === 0 ? (
            <p className="text-muted-foreground py-4">No data available for selected period</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead className="text-right">Total Kgs</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Days Worked</TableHead>
                  <TableHead className="text-right">Avg Kgs/Day</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((worker) => (
                  <TableRow key={worker.workerId}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell className="text-right">{worker.totalKgs.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{settings.currency} {worker.totalAmount.toFixed(0)}</TableCell>
                    <TableCell className="text-right">{worker.daysWorked}</TableCell>
                    <TableCell className="text-right">{worker.avgKgsPerDay.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}