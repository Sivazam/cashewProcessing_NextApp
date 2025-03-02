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
  RefreshCcw,
  Users,
  Scale,
  AlertCircle,
  DollarSign,
  ArrowDownCircle,
  Clock,
  Wallet2Icon,
  CalendarX,
  Phone,
  IndianRupee
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
      <div className="flex min-h-screen flex-col bg-background">
        <MainNav />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center bg-card p-8 rounded-xl shadow-sm border border-border">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-xl font-medium text-foreground">Worker not found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                The worker you're looking for doesn't exist or has been deleted
              </p>
              <Button 
                onClick={() => router.push("/workers")}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
  
  // // Calculate pending amount (total - advances - payouts)
  // const payoutsMade = payments
  //   .filter((payment) => payment.workerId === worker.id && payment.type === "payout")
  //   .reduce((sum, payment) => sum + payment.amount, 0);
  
  // const pendingAmount = worker.totalAmount - worker.advanceAmount - payoutsMade;
  
    const advancesGiven = workerPayments
    .filter((payment) => payment.type === "advance")
    .reduce((sum, payment) => sum + payment.amount, 0);

    const payoutsMade = workerPayments
      .filter((payment) => payment.type === "payout")
      .reduce((sum, payment) => sum + payment.amount, 0);

    const pendingAmount = worker.totalAmount - advancesGiven - payoutsMade;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <MainNav />
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-24 md:pb-8">
        {/* Header Section with Worker Details */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6"
        >
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border shadow-sm">
                {worker.avatar ? (
                  <Image 
                    src={worker?.avatar} 
                    alt={worker.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold">
                    {worker.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{worker.name}</h2>
                {worker.phone && (
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1" />
                    {worker.phone}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddWorkLogDialog(true)}
                className="text-foreground hover:bg-accent transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4 text-primary" /> Add Work
              </Button>
              <Button 
                onClick={() => openPaymentDialog('advance')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Wallet className="mr-2 h-4 w-4" /> Give Advance
              </Button>
              <Button 
                onClick={() => openPaymentDialog('payout')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Wallet className="mr-2 h-4 w-4" /> Process Payout
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Scale className="h-4 w-4 mr-2 text-primary/70" />
                  Total Processed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{worker.totalKgsProcessed} kg</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2 text-primary/70" />
                  Total Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{settings.currency} {worker.totalAmount}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowDownCircle className="h-4 w-4 mr-2 text-primary/70" />
                      <span>Advances</span>
                    </div>
                    {worker.advanceAmount > 0 && (
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent text-muted-foreground ml-2 transition-colors"
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
                <div className="text-2xl font-bold text-foreground">{settings.currency} {worker.advanceAmount}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary/70" />
                  Pending Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${pendingAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                  {settings.currency} {pendingAmount}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Worker History</h3>
          <Tabs defaultValue="work-logs" className="w-full">
            <TabsList className="w-full flex mb-6 bg-muted p-1 rounded-lg">
              <TabsTrigger 
                value="work-logs" 
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <CalendarDays className="mr-2 h-4 w-4" /> Work Logs
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Payments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="work-logs" className="mt-0">
              {sortedLogs.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                  <div className="text-center p-6">
                    <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground">No work logs found</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Get started by adding a work log
                    </p>
                    <Button 
                      onClick={() => setShowAddWorkLogDialog(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Work Log
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="hover:bg-muted/30">
                        <TableHead className="w-1/3 text-muted-foreground">Date</TableHead>
                        <TableHead className="text-right text-muted-foreground">Kgs Processed</TableHead>
                        <TableHead className="text-right text-muted-foreground">Amount Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/30 border-b border-border">
                          <TableCell className="font-medium text-foreground">
                            {format(parseISO(log.date), "PPP")}
                          </TableCell>
                          <TableCell className="text-right text-foreground">
                            {log.kgsProcessed} kg
                          </TableCell>
                          <TableCell className="text-right font-medium text-foreground">
                            {settings.currency} {log.amountEarned}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              {sortedPayments.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                  <div className="text-center p-6">
                    <Wallet2Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground">No payments found</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Get started by recording a payment
                    </p>
                    <Button 
                      onClick={() => openPaymentDialog('advance')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Wallet className="mr-2 h-4 w-4" /> Record Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="hover:bg-muted/30">
                        <TableHead className="w-1/3 text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPayments.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-muted/30 border-b border-border">
                          <TableCell className="font-medium text-foreground">
                            {format(parseISO(payment.date), "PPP")}
                          </TableCell>
                          <TableCell className="text-foreground">
                            <Badge 
                              variant={payment.type === 'advance' ? 'outline' : 'default'} 
                              className={payment.type === 'advance' 
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/60' 
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/60'
                              }
                            >
                              {payment.type === 'advance' ? 'Advance' : 'Payout'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-foreground">
                            {settings.currency} {payment.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Clear Advance Alert Dialog */}
        <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
          <AlertDialogContent className="bg-background rounded-2xl border-border shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Clear Advance?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will clear the advance amount of {settings.currency} {worker.advanceAmount} for {worker.name}.
                Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-muted transition-colors">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearAdvance} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Clear Advance
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Add Work Log Dialog */}
        <AddWorkLogDialog 
          open={showAddWorkLogDialog} 
          onOpenChange={setShowAddWorkLogDialog}
          workerId={worker.id}
        />
        
        {/* Add Payment Dialog */}
        <AddPaymentDialog
          open={showAddPaymentDialog}
          onOpenChange={setShowAddPaymentDialog}
          workerId={worker.id}
          defaultType={paymentType}
        />
  
        {/* Mobile Bottom Tabs - Only visible on small screens */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg flex justify-around p-3 z-50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs py-1 h-auto text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setShowAddWorkLogDialog(true)}
          >
            <PlusCircle className="h-5 w-5 mb-1" />
            <span>Add Work</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs py-1 h-auto text-muted-foreground hover:text-primary transition-colors"
            onClick={() => openPaymentDialog('advance')}
          >
            <Wallet className="h-5 w-5 mb-1" />
            <span>Advance</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs py-1 h-auto text-muted-foreground hover:text-primary transition-colors"
            onClick={() => openPaymentDialog('payout')}
          >
            <Wallet className="h-5 w-5 mb-1" />
            <span>Payout</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs py-1 h-auto text-muted-foreground hover:text-primary transition-colors"
            onClick={() => router.push("/workers")}
          >
            <Users className="h-5 w-5 mb-1" />
            <span>All Workers</span>
          </Button>
        </div>
      </div>
    </div>
  )};