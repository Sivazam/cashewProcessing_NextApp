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
import { useLogsStore, useFirmsStore, useSettingsStore, useWorkersStore } from "@/lib/store";

export function DailySummary() {
  const [todayKgs, setTodayKgs] = useState(0);
  const [todayAmount, setTodayAmount] = useState(0);
  const [todayAdvances, setTodayAdvances] = useState(0);
  const [todayPayouts, setTodayPayouts] = useState(0);
  
  const { workLogs, payments } = useLogsStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();
  const { workers } = useWorkersStore();

  useEffect(() => {
    if (!selectedFirmId) return;

    const today = format(new Date(), "yyyy-MM-dd");
    
    // Calculate today's processed kgs and amount
    const todayLogs = workLogs.filter(
      log => log.firmId === selectedFirmId && log.date === today
    );
    
    const kgsProcessed = todayLogs.reduce((sum, log) => sum + log.kgsProcessed, 0);
    const amountEarned = todayLogs.reduce((sum, log) => sum + log.amountEarned, 0);
    
    // Calculate today's advances and payouts
    const todayPayments = payments.filter(
      payment => payment.firmId === selectedFirmId && payment.date === today
    );
    
    const advances = todayPayments
      .filter(payment => payment.type === "advance")
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    const payouts = todayPayments
      .filter(payment => payment.type === "payout")
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    setTodayKgs(kgsProcessed);
    setTodayAmount(amountEarned);
    setTodayAdvances(advances);
    setTodayPayouts(payouts);
  }, [workLogs, payments, selectedFirmId, workers]);


  

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
          <CardDescription>
            Please select a firm to view today's summary
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle>Today's Summary</CardTitle>
          <CardDescription>
            {format(new Date(), "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Processed</p>
              <p className="text-2xl font-bold">{todayKgs} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Amount Earned by all workers</p>
              <p className="text-2xl font-bold">{settings.currency} {todayAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Advances</p>
              <p className="text-2xl font-bold">{settings.currency} {todayAdvances}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Payouts Made</p>
              <p className="text-2xl font-bold">{settings.currency} {todayPayouts}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}