"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";

type ActivityItem = {
  id: string;
  type: "workLog" | "payment"; 
  date: string;
  description: string;
  timestamp: string;
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const { workLogs, payments } = useLogsStore();
  const { workers } = useWorkersStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!selectedFirmId) return;

    const firmWorkLogs = workLogs.filter(log => log.firmId === selectedFirmId);
    const firmPayments = payments.filter(payment => payment.firmId === selectedFirmId);

    const workLogActivities: ActivityItem[] = firmWorkLogs.map(log => {
      const worker = workers.find(w => w.id === log.workerId);
      return {
        id: log.id,
        type: "workLog",
        date: log.date,
        description: `${worker?.name || "Worker"} processed ${log.kgsProcessed} kg`,
        timestamp: log.createdAt,
      };
    });

    const paymentActivities: ActivityItem[] = firmPayments.map(payment => {
      const worker = workers.find(w => w.id === payment.workerId);
      const actionType = payment.type === "advance" ? "received an advance of" : "was paid";
      return {
        id: payment.id,
        type: "payment",
        date: payment.date,
        description: `${worker?.name || "Worker"} ${actionType} ${settings.currency}${payment.amount}`,
        timestamp: payment.createdAt,
      };
    });

    const allActivities = [...workLogActivities, ...paymentActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    setActivities(allActivities);
  }, [workLogs, payments, workers, selectedFirmId, settings]);

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Please select a firm to view recent activities
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest activities in your processing unit
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            ) : (
              activities.map((activity, index) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                >
                  <div className="min-w-10 pt-1">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === "workLog" ? "bg-primary" : "bg-accent"
                    }`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.date), "PPP")}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}