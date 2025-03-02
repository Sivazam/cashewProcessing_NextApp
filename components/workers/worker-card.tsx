
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
// import { PlusCircle, Trash, Wallet, RefreshCcw } from "lucide-react";
// import { Worker } from "@/lib/types";
// import { useWorkersStore, useSettingsStore, useLogsStore } from "@/lib/store";
// import { AddWorkLogDialog } from "@/components/work-logs/add-work-log-dialog";
// import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
// import { toast } from "sonner";

// interface WorkerCardProps {
//   worker: Worker;
// }

// export function WorkerCard({ worker }: WorkerCardProps) {
//   const router = useRouter();
//   const { deleteWorker, updateWorker } = useWorkersStore();
//   const { settings } = useSettingsStore();
//   const { addPayment } = useLogsStore();
//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [showAddWorkLogDialog, setShowAddWorkLogDialog] = useState(false);
//   const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
//   const [showClearAdvanceAlert, setShowClearAdvanceAlert] = useState(false);

//   const handleDelete = () => {
//     deleteWorker(worker.id);
//     setShowDeleteAlert(false);
//     toast.success(`${worker.name} has been deleted`);
//   };

//   const handleClearAdvance = () => {
//     updateWorker(worker.id, {
//       advanceAmount: 0,
//     });

//     // Log the "Clear Advance" action as a payment activity
//     addPayment({
//       id: crypto.randomUUID(),
//       firmId: worker.firmId,
//       workerId: worker.id,
//       type: "clear_advance",
//       amount: worker.advanceAmount || 0,
//       date: new Date().toISOString().split("T")[0],
//       createdAt: new Date().toISOString(),
//     });

//     setShowClearAdvanceAlert(false);
//     toast.success(`Advance cleared for ${worker.name}`);
//   };

//   const pendingAmount = (worker.totalAmount || 0) - (worker.advanceAmount || 0);

//   return (
//     <Card className="relative min-h-[350px]">
//       {/* Details Button */}
//       <Button
//         onClick={() => router.push(`/workers/${worker.id}`)}
//         className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
//       >
//         Details
//       </Button>

//       <CardHeader>
//         <CardTitle>{worker.name}</CardTitle>
//         {worker.phone && <CardDescription>{worker.phone}</CardDescription>}
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div>
//           <strong>Total Processed:</strong> {worker.totalKgsProcessed} kg
//         </div>
//         <div>
//           <strong>Total Earned:</strong> {settings.currency} {worker.totalAmount || 0}
//         </div>
//         <div className="flex items-center gap-2">
//           <strong>Advances:</strong> {settings.currency} {worker.advanceAmount || 0}
//           {worker.advanceAmount > 0 && (
//             <Badge
//               onClick={() => setShowClearAdvanceAlert(true)}
//               className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600"
//             >
//               Clear
//             </Badge>
//           )}
//         </div>
//         <div>
//           <strong>Pending:</strong> {settings.currency} {pendingAmount}
//         </div>
//       </CardContent>

//       <CardFooter className="flex flex-wrap gap-2">
//         <Button
//           onClick={() => setShowAddWorkLogDialog(true)}
//           className="bg-green-500 text-white hover:bg-green-600"
//         >
//           Add Work Log
//         </Button>
//         <Button
//           onClick={() => setShowAddPaymentDialog(true)}
//           className="bg-blue-500 text-white hover:bg-blue-600"
//         >
//           Give Advance
//         </Button>
//         <Button
//           onClick={() => setShowAddPaymentDialog(true)}
//           className="bg-purple-500 text-white hover:bg-purple-600"
//         >
//           Process Payout
//         </Button>
//         <Button
//           onClick={() => setShowDeleteAlert(true)}
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Delete
//         </Button>
//       </CardFooter>

//       {/* Delete Alert Dialog */}
//       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete {worker.name} and all associated records. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Clear Advance Alert Dialog */}
//       <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear Advance?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will clear the advance amount of {settings.currency} {worker.advanceAmount} for {worker.name}. Are you sure you want to proceed?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleClearAdvance}>Clear Advance</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Add Work Log Dialog */}
//       <AddWorkLogDialog
//         open={showAddWorkLogDialog}
//         onOpenChange={setShowAddWorkLogDialog}
//         workerId={worker.id}
//       />

//       {/* Add Payment Dialog */}
//       <AddPaymentDialog
//         open={showAddPaymentDialog}
//         onOpenChange={setShowAddPaymentDialog}
//         workerId={worker.id}
//       />
//     </Card>
//   );
// }



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { PlusCircle, Trash, Wallet, RefreshCcw } from "lucide-react";
// import { Worker } from "@/lib/types";
// import { useWorkersStore, useSettingsStore, useLogsStore } from "@/lib/store";
// import { AddWorkLogDialog } from "@/components/work-logs/add-work-log-dialog";
// import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
// import { toast } from "sonner";

// interface WorkerCardProps {
//   worker: Worker;
// }

// export function WorkerCard({ worker }: WorkerCardProps) {
//   const router = useRouter();
//   const { deleteWorker, updateWorker } = useWorkersStore();
//   const { settings } = useSettingsStore();
//   const { addPayment } = useLogsStore();
//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [showAddWorkLogDialog, setShowAddWorkLogDialog] = useState(false);
//   const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
//   const [paymentType, setPaymentType] = useState<"advance" | "payout">("advance");
//   const [showClearAdvanceAlert, setShowClearAdvanceAlert] = useState(false);

//   const handleDelete = () => {
//     deleteWorker(worker.id);
//     setShowDeleteAlert(false);
//     toast.success(`${worker.name} has been deleted`);
//   };

//   const handleClearAdvance = () => {
//     updateWorker(worker.id, {
//       advanceAmount: 0,
//     });

//     // Log the "Clear Advance" action as a payment activity
//     addPayment({
//       id: crypto.randomUUID(),
//       firmId: worker.firmId,
//       workerId: worker.id,
//       type: "clear_advance",
//       amount: worker.advanceAmount || 0,
//       date: new Date().toISOString().split("T")[0],
//       createdAt: new Date().toISOString(),
//     });

//     setShowClearAdvanceAlert(false);
//     toast.success(`Advance cleared for ${worker.name}`);
//   };

//   const openPaymentDialog = (type: "advance" | "payout") => {
//     setPaymentType(type);
//     setShowAddPaymentDialog(true);
//   };

//   const pendingAmount = (worker.totalAmount || 0) - (worker.advanceAmount || 0);

//   return (
//     <Card className="relative min-h-[350px]">
//       {/* Details Button in Top Right Corner */}
//       <Button
//         onClick={() => router.push(`/workers/${worker.id}`)}
//         className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
//       >
//         Details
//       </Button>

//       <CardHeader>
//         <CardTitle>{worker.name}</CardTitle>
//         {worker.phone && <CardDescription>{worker.phone}</CardDescription>}
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div>
//           <strong>Total Processed:</strong> {worker.totalKgsProcessed} kg
//         </div>
//         <div>
//           <strong>Total Earned:</strong> {settings.currency} {worker.totalAmount || 0}
//         </div>
//         <div className="flex items-center gap-2">
//           <strong>Advances:</strong> {settings.currency} {worker.advanceAmount || 0}
//           {worker.advanceAmount > 0 && (
//             <Badge
//               onClick={() => setShowClearAdvanceAlert(true)}
//               className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600"
//             >
//               Clear
//             </Badge>
//           )}
//         </div>
//         <div>
//           <strong>Pending:</strong> {settings.currency} {pendingAmount}
//         </div>
//       </CardContent>

//       <CardFooter className="flex flex-wrap gap-2">
//         <Button
//           onClick={() => setShowAddWorkLogDialog(true)}
//           className="bg-green-500 text-white hover:bg-green-600"
//         >
//           Add Work Log
//         </Button>
//         <Button
//           onClick={() => openPaymentDialog("advance")}
//           className="bg-blue-500 text-white hover:bg-blue-600"
//         >
//           Give Advance
//         </Button>
//         <Button
//           onClick={() => openPaymentDialog("payout")}
//           className="bg-purple-500 text-white hover:bg-purple-600"
//         >
//           Process Payout
//         </Button>
//         <Button
//           onClick={() => setShowDeleteAlert(true)}
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Delete
//         </Button>
//       </CardFooter>

//       {/* Delete Alert Dialog */}
//       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete {worker.name} and all associated records. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Clear Advance Alert Dialog */}
//       <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear Advance?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will clear the advance amount of {settings.currency} {worker.advanceAmount} for {worker.name}.
//               Are you sure you want to proceed?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleClearAdvance}>Clear Advance</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Add Work Log Dialog */}
//       <AddWorkLogDialog
//         open={showAddWorkLogDialog}
//         onOpenChange={setShowAddWorkLogDialog}
//         workerId={worker.id}
//       />

//       {/* Add Payment Dialog */}
//       <AddPaymentDialog
//         open={showAddPaymentDialog}
//         onOpenChange={setShowAddPaymentDialog}
//         workerId={worker.id}
//         paymentType={paymentType}
//       />
//     </Card>
//   );
// }



// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { PlusCircle, Trash, Wallet, RefreshCcw } from "lucide-react";
// import { Worker } from "@/lib/types";
// import { useWorkersStore, useSettingsStore, useLogsStore } from "@/lib/store";
// import { AddWorkLogDialog } from "@/components/work-logs/add-work-log-dialog";
// import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
// import { toast } from "sonner";

// interface WorkerCardProps {
//   worker: Worker;
// }

// export function WorkerCard({ worker }: WorkerCardProps) {
//   const router = useRouter();
//   const { deleteWorker, updateWorker } = useWorkersStore();
//   const { settings } = useSettingsStore();
//   const { payments, addPayment } = useLogsStore();
//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [showAddWorkLogDialog, setShowAddWorkLogDialog] = useState(false);
//   const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
//   const [paymentType, setPaymentType] = useState<"advance" | "payout">("advance");
//   const [showClearAdvanceAlert, setShowClearAdvanceAlert] = useState(false);

//   // Calculate advances and payouts dynamically
//   const advancesGiven = worker.advanceAmount || 0;
//   const payoutsMade = payments
//     .filter((p) => p.workerId === worker.id && p.type === "payout")
//     .reduce((sum, payment) => sum + payment.amount, 0);

//   // Calculate pending amount dynamically
//   // const pendingAmount = worker.totalAmount - (advancesGiven - payoutsMade);
//   const pendingAmount = worker.totalAmount - worker.advanceAmount - payoutsMade;

//   console.log("////////////workerz",worker);
//   console.log("///////payoutsMade",payoutsMade);


//   console.log("Debugging Pending Amount:");
//   console.log("Total Amount:", worker.totalAmount);
//   console.log("Advances Given:", worker.advanceAmount);
//   console.log("Payouts Made:", payoutsMade);
//   console.log("Pending Amount:", pendingAmount);

//   const handleDelete = () => {
//     deleteWorker(worker.id);
//     setShowDeleteAlert(false);
//     toast.success(`${worker.name} has been deleted`);
//   };

//   const handleClearAdvance = () => {
//     updateWorker(worker.id, {
//       advanceAmount: 0,
//     });

//     // Log the "Clear Advance" action as a payment activity
//     addPayment({
//       id: crypto.randomUUID(),
//       firmId: worker.firmId,
//       workerId: worker.id,
//       type: "clear_advance",
//       amount: worker.advanceAmount || 0,
//       date: new Date().toISOString().split("T")[0],
//       createdAt: new Date().toISOString(),
//     });

//     setShowClearAdvanceAlert(false);
//     toast.success(`Advance cleared for ${worker.name}`);
//   };

//   const openPaymentDialog = (type: "advance" | "payout") => {
//     setPaymentType(type);
//     setShowAddPaymentDialog(true);
//   };

//   return (
//     <Card className="relative min-h-[350px]">
//       {/* Details Button in Top Right Corner */}
//       <Button
//         onClick={() => router.push(`/workers/${worker.id}`)}
//         className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
//       >
//         Details
//       </Button>

//       <CardHeader>
//         <CardTitle>{worker.name}</CardTitle>
//         {worker.phone && <CardDescription>{worker.phone}</CardDescription>}
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div>
//           <strong>Total Processed:</strong> {worker.totalKgsProcessed} kg
//         </div>
//         <div>
//           <strong>Total Earned:</strong> {settings.currency} {worker.totalAmount}
//         </div>
//         <div className="flex items-center gap-2">
//           <strong>Advances:</strong> {settings.currency} {advancesGiven}
//           {advancesGiven > 0 && (
//             <Badge
//               onClick={() => setShowClearAdvanceAlert(true)}
//               className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600"
//             >
//               Clear
//             </Badge>
//           )}
//         </div>
//         <div>
//           <strong>Payouts Made:</strong> {settings.currency} {payoutsMade}
//         </div>
//         <div>
//           <strong>Pending:</strong> {settings.currency} {pendingAmount}
//         </div>
//       </CardContent>

//       <CardFooter className="flex flex-wrap gap-2">
//         <Button
//           onClick={() => setShowAddWorkLogDialog(true)}
//           className="bg-green-500 text-white hover:bg-green-600"
//         >
//           Add Work Log
//         </Button>
//         <Button
//           onClick={() => openPaymentDialog("advance")}
//           className="bg-blue-500 text-white hover:bg-blue-600"
//         >
//           Give Advance
//         </Button>
//         <Button
//           onClick={() => openPaymentDialog("payout")}
//           className="bg-purple-500 text-white hover:bg-purple-600"
//         >
//           Process Payout
//         </Button>
//         <Button
//           onClick={() => setShowDeleteAlert(true)}
//           className="bg-red-500 text-white hover:bg-red-600"
//         >
//           Delete
//         </Button>
//       </CardFooter>

//       {/* Delete Alert Dialog */}
//       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete {worker.name} and all associated records. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Clear Advance Alert Dialog */}
//       <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear Advance?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will clear the advance amount of {settings.currency} {advancesGiven} for {worker.name}. Are you sure you want to proceed?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleClearAdvance}>Clear Advance</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Add Work Log Dialog */}
//       <AddWorkLogDialog
//         open={showAddWorkLogDialog}
//         onOpenChange={setShowAddWorkLogDialog}
//         workerId={worker.id}
//       />

//       {/* Add Payment Dialog */}
//       <AddPaymentDialog
//         open={showAddPaymentDialog}
//         onOpenChange={setShowAddPaymentDialog}
//         workerId={worker.id}
//         paymentType={paymentType}
//       />
//     </Card>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { PlusCircle, Trash, Wallet, RefreshCcw, User, DollarSign, FileText, ArrowRight, IndianRupee } from "lucide-react";
import { Worker } from "@/lib/types";
import { useWorkersStore, useSettingsStore, useLogsStore } from "@/lib/store";
import { AddWorkLogDialog } from "@/components/work-logs/add-work-log-dialog";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const router = useRouter();
  const { deleteWorker, updateWorker } = useWorkersStore();
  const { settings } = useSettingsStore();
  const { payments, addPayment } = useLogsStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAddWorkLogDialog, setShowAddWorkLogDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<"advance" | "payout">("advance");
  const [showClearAdvanceAlert, setShowClearAdvanceAlert] = useState(false);

  // Calculate advances and payouts dynamically
  // const advancesGiven = worker.advanceAmount || 0;

  // const payoutsMade = payments
  //   .filter((p) => p.workerId === worker.id && p.type === "payout")
  //   .reduce((sum, payment) => sum + payment.amount, 0);

  // // Calculate pending amount dynamically
  // const pendingAmount = worker.totalAmount - worker.advanceAmount - payoutsMade;

  const advancesGiven = payments
  .filter((payment) => payment.workerId === worker.id && payment.type === "advance")
  .reduce((sum, payment) => sum + payment.amount, 0);

const payoutsMade = payments
  .filter((payment) => payment.workerId === worker.id && payment.type === "payout")
  .reduce((sum, payment) => sum + payment.amount, 0);
  
    // Calculate pending amount dynamically
    const pendingAmount = worker.totalAmount - advancesGiven - payoutsMade;


  const handleDelete = () => {
    deleteWorker(worker.id);
    setShowDeleteAlert(false);
    toast.success(`${worker.name} has been deleted`);
  };

  const handleClearAdvance = () => {
    updateWorker(worker.id, {
      advanceAmount: 0,
    });

    // Log the "Clear Advance" action as a payment activity
    addPayment({
      id: crypto.randomUUID(),
      firmId: worker.firmId,
      workerId: worker.id,
      type: "clear_advance",
      amount: worker.advanceAmount || 0,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    });

    setShowClearAdvanceAlert(false);
    toast.success(`Advance cleared for ${worker.name}`);
  };

  const openPaymentDialog = (type: "advance" | "payout") => {
    setPaymentType(type);
    setShowAddPaymentDialog(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-4">
          {/* Header with avatar and name side by side */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar that can display headshot from worker onboarding */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                {worker.avatar ? (
                  <Image 
                    src={worker.avatar} 
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
              
              {/* Name and phone */}
              <div>
                <h3 className="text-lg font-bold">{worker.name}</h3>
                {worker.phone && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <User className="h-3 w-3 mr-1" /> {worker.phone}
                  </p>
                )}
              </div>
            </div>
            
            {/* Details Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.push(`/workers/${worker.id}`)}
                className="rounded-full h-8 px-3 py-1 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
              >
                <span>Details</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </motion.div>
          </div>

          {/* Main content - metrics in 2 rows */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-gray-800">{worker.totalKgsProcessed}</p>
              <p className="text-xs text-gray-500 font-medium">kg Processed</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-gray-800">{settings.currency} {worker.totalAmount}</p>
              <p className="text-xs text-gray-500 font-medium">Total Earned</p>
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg relative">
              <p className="text-xl font-bold text-gray-800">{settings.currency} {advancesGiven}</p>
              <p className="text-xs text-gray-500 font-medium">Advances</p>
 
             {/* to clear advance amount */}
              {/* {advancesGiven > 0 && (
               
               
               <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge
                    onClick={() => setShowClearAdvanceAlert(true)}
                    className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600 px-1 py-0.5 text-xs rounded-full shadow-md"
                  >
                    Clear
                  </Badge>
                </motion.div>
              )} */}
            </div>
            
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-gray-800">{settings.currency} {pendingAmount}</p>
              <p className="text-xs text-gray-500 font-medium">Pending</p>
            </div>
          </div>
          
          {/* Payout info - slim version */}
          <div className="bg-blue-50 p-2 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-blue-700">Payouts Made</p>
              <p className="text-sm font-bold text-blue-800">{settings.currency} {payoutsMade}</p>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <CardFooter className="flex flex-wrap gap-1 pt-0 pb-3 px-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              onClick={() => setShowAddWorkLogDialog(true)}
              className="w-full rounded-lg h-8 shadow-sm bg-green-500 text-white hover:bg-green-600 text-xs font-medium"
            >
              <FileText className="mr-1 h-3 w-3" />
              <span>Log Work</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              onClick={() => openPaymentDialog("advance")}
              className="w-full rounded-lg h-8 shadow-sm bg-blue-500 text-white hover:bg-blue-600 text-xs font-medium"
            >
              <Wallet className="mr-1 h-3 w-3" />
              <span>Advance</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              onClick={() => openPaymentDialog("payout")}
              className="w-full rounded-lg h-8 shadow-sm bg-purple-500 text-white hover:bg-purple-600 text-xs font-medium"
            >
              <IndianRupee className="mr-1 h-3 w-3" />
              <span>Payout</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={() => setShowDeleteAlert(true)}
              className="rounded-lg h-8 w-8 shadow-sm bg-red-500 text-white hover:bg-red-600 p-0"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </motion.div>
        </CardFooter>

        {/* Delete Alert Dialog */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {worker.name} and all associated records. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 rounded-lg">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Clear Advance Alert Dialog */}
        <AlertDialog open={showClearAdvanceAlert} onOpenChange={setShowClearAdvanceAlert}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Advance?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear the advance amount of {settings.currency} {advancesGiven} for {worker.name}. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAdvance} className="bg-yellow-500 hover:bg-yellow-600 rounded-lg">
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
          paymentType={paymentType}
        />
      </Card>
    </motion.div>
  );
}