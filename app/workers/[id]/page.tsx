"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/main-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ChevronLeft, 
  PlusCircle, 
  Wallet,
  CalendarDays,
  CreditCard,
  RefreshCcw
} from "lucide-react";
import { useWorkersStore, useLogsStore, useSettingsStore } from "@/lib/store";
import { AddWorkLogDialog } from "@/components/work-logs/add-work-log-dialog";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { toast } from "sonner";
import Image from "next/image";



export default function WorkerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.id as string;
  
  const { workers, updateWorker } = useWorkersStore();
  const { workLogs, payments, getWorkLogsByWorker, getPaymentsByWorker } = useLogsStore();
  const { settings } = useSettingsStore();
  
  const [worker, setWorker] = useState(workers.find(w => w.id === workerId));
  const [workerLogs, setWorkerLogs] = useState(getWorkLogsByWorker(workerId));
  const [workerPayments, setWorkerPayments] = useState(getPaymentsByWorker(workerId));
  
  const [showAddWorkLogDialog, setShowAddWorkLogDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'advance' | 'payout'>('advance');
  const [showClearAdvanceAlert, setShowClearAdvanceAlert] = useState(false);



  useEffect(() => {
    setWorker(workers.find(w => w.id === workerId));
    setWorkerLogs(getWorkLogsByWorker(workerId));
    setWorkerPayments(getPaymentsByWorker(workerId));
  }, [workerId, workers, workLogs, payments, getWorkLogsByWorker, getPaymentsByWorker]);

  const handleClearAdvance = () => {
    if (!worker) return;
    
    updateWorker(workerId, {
      advanceAmount: 0
    });
    setShowClearAdvanceAlert(false);
    toast.success(`Advance cleared for ${worker.name}`);
  };



  const openPaymentDialog = (type: 'advance' | 'payout') => {
    setPaymentType(type);
    setShowAddPaymentDialog(true);
  };

  if (!worker) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Worker not found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The worker you're looking for doesn't exist or has been deleted
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push("/workers")}
              >
                Go to Workers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sort logs and payments by date (newest first)
  const sortedLogs = [...workerLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const sortedPayments = [...workerPayments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // const pendingAmount = worker.totalAmount - worker.advanceAmount;

  const payoutsMade = payments
  .filter((payment) => payment.workerId === worker.id && payment.type === "payout")
  .reduce((sum, payment) => sum + payment.amount, 0);

const pendingAmount = worker.totalAmount - worker.advanceAmount - payoutsMade;

  console.log("///////worker",worker);
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 pb-20 md:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            
              <div className="flex items-center gap-3">
                          {/* Avatar that can display headshot from worker onboarding */}
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                            {worker.avatar ? (
                              <Image 
                                src={worker?.avatar} 
                                alt={worker.name} 
                                fill 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                {worker.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <h2 className="text-3xl font-bold tracking-tight">{worker.name}</h2>
            {worker.phone && (
              <p className="text-muted-foreground">{worker.phone}</p>
            )}
                          </div>
          
          </div>
        </motion.div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{worker.totalKgsProcessed} kg</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.currency} {worker.totalAmount}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span>Advances</span>
                    {worker.advanceAmount > 0 && (
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
                        onClick={() => setShowClearAdvanceAlert(true)}
                      >
                        <RefreshCcw className="h-3 w-3 mr-1" />
                        Clear
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.currency} {worker.advanceAmount}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.currency} {pendingAmount}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <h3 className="text-xl font-semibold">Worker History</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAddWorkLogDialog(true)}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Work
            </Button>
            <Button 
              onClick={() => openPaymentDialog('advance')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mr-2"
            >
              <Wallet className="mr-2 h-4 w-4" /> Give Advance
            </Button>
            <Button 
              onClick={() => openPaymentDialog('payout')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Wallet className="mr-2 h-4 w-4" /> Process Payout
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Tabs defaultValue="work-logs">
            <TabsList className="bg-muted">
              <TabsTrigger value="work-logs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CalendarDays className="mr-2 h-4 w-4" /> Work Logs
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard className="mr-2 h-4 w-4" /> Payments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work-logs">
              <Card>
                <CardHeader>
                  <CardTitle>Work History</CardTitle>
                  <CardDescription>
                    Record of all work done by {worker.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedLogs.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">No work logs found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get started by adding a work log
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddWorkLogDialog(true)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Work Log
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Kgs Processed</TableHead>
                            <TableHead className="text-right">Amount Earned</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                {format(parseISO(log.date), "PPP")}
                              </TableCell>
                              <TableCell className="text-right">
                                {log.kgsProcessed} kg
                              </TableCell>
                              <TableCell className="text-right">
                                {settings.currency} {log.amountEarned}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Record of all payments to {worker.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedPayments.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">No payments found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get started by recording a payment
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => openPaymentDialog('advance')}
                        >
                          <Wallet className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {format(parseISO(payment.date), "PPP")}
                              </TableCell>
                              <TableCell className="capitalize">
                                {payment.type}
                              </TableCell>
                              <TableCell className="text-right">
                                {settings.currency} {payment.amount}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Clear Advance Alert Dialog */}
      <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Advance?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the advance amount of {settings.currency} {worker.advanceAmount} for {worker.name}.
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAdvance} className="bg-primary text-primary-foreground">
              Clear Advance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AddWorkLogDialog 
        open={showAddWorkLogDialog} 
        onOpenChange={setShowAddWorkLogDialog}
        workerId={worker.id}
      />
      
      <AddPaymentDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        workerId={worker.id}
        defaultType={paymentType}
      />

      {/* Mobile Bottom Tabs - Only visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2 z-50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center text-xs py-1 h-auto"
          onClick={() => setShowAddWorkLogDialog(true)}
        >
          <PlusCircle className="h-5 w-5 mb-1" />
          <span>Work</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center text-xs py-1 h-auto"
          onClick={() => openPaymentDialog('advance')}
        >
          <Wallet className="h-5 w-5 mb-1" />
          <span>Advance</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center text-xs py-1 h-auto"
          onClick={() => openPaymentDialog('payout')}
        >
          <Wallet className="h-5 w-5 mb-1" />
          <span>Payout</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center text-xs py-1 h-auto"
          onClick={() => router.push("/workers")}
        >
          <ChevronLeft className="h-5 w-5 mb-1" />
          <span>Back</span>
        </Button>
      </div>
    </div>
  );
}