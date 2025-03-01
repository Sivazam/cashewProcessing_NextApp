// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";
// import { Payment } from "@/lib/types";

// const formSchema = z.object({
//   date: z.date(),
//   amount: z.coerce.number().positive({
//     message: "Amount must be a positive number.",
//   }),
//   type: z.enum(["advance", "payout"]),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface AddPaymentDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   workerId: string;
//   defaultType?: 'advance' | 'payout';
// }

// export function AddPaymentDialog({ 
//   open, 
//   onOpenChange, 
//   workerId,
//   defaultType = 'advance'
// }: AddPaymentDialogProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { addPayment } = useLogsStore();
//   const { updateWorker, workers } = useWorkersStore();
//   const { selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();

//   const worker = workers.find(w => w.id === workerId);
//   const pendingAmount = worker ? worker.totalAmount - worker.advanceAmount : 0;

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: new Date(),
//       amount: 0,
//       type: defaultType,
//     },
//   });

//   // Update form when defaultType changes
//   useState(() => {
//     form.setValue('type', defaultType);
//   });

//   const paymentType = form.watch("type");

//   const onSubmit = async (values: FormValues) => {
//     if (!selectedFirmId || !worker) {
//       toast.error("Worker or firm not found");
//       return;
//     }

//     if (values.type === "payout" && values.amount > pendingAmount) {
//       toast.error("Payout amount cannot exceed pending amount");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const newPayment: Payment = {
//         id: uuidv4(),
//         workerId,
//         firmId: selectedFirmId,
//         date: format(values.date, "yyyy-MM-dd"),
//         amount: values.amount,
//         type: values.type,
//         createdAt: new Date().toISOString(),
//       };
      
//       addPayment(newPayment);
      
//       // Update worker advances
//       if (values.type === "advance") {
//         updateWorker(workerId, {
//           advanceAmount: worker.advanceAmount + values.amount,
//         });
//       } else if (values.type === "payout") {
//         updateWorker(workerId, {
//           advanceAmount: worker.advanceAmount - values.amount,
//         });
//       }
      
//       toast.success(`${values.type === "advance" ? "Advance" : "Payout"} recorded successfully`);
//       form.reset({
//         date: new Date(),
//         amount: 0,
//         type: defaultType,
//       });
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(`Failed to record ${values.type}`);
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Record Payment</DialogTitle>
//           <DialogDescription>
//             Record an advance or payout for {worker?.name || "worker"}.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Payment Type</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select payment type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="advance">Advance</SelectItem>
//                       <SelectItem value="payout">Payout</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) =>
//                           date > new Date() || date < new Date("1900-01-01")
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Amount</FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="number" 
//                       placeholder="Enter amount" 
//                       {...field} 
//                       onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                     />
//                   </FormControl>
//                   {paymentType === "payout" && (
//                     <p className="text-sm text-muted-foreground">
//                       Available for payout: {settings.currency} {pendingAmount}
//                     </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button 
//                 type="submit" 
//                 disabled={isSubmitting}
//                 className="bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 {isSubmitting ? "Processing..." : "Record Payment"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }


// "use client";
// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";
// import { Payment } from "@/lib/types";

// const formSchema = z.object({
//   date: z.date(),
//   amount: z.coerce.number().positive({
//     message: "Amount must be a positive number.",
//   }),
//   type: z.enum(["advance", "payout"]),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface AddPaymentDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   workerId: string;
//   defaultType?: "advance" | "payout";
// }

// export function AddPaymentDialog({
//   open,
//   onOpenChange,
//   workerId,
//   defaultType = "advance",
// }: AddPaymentDialogProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { addPayment } = useLogsStore();
//   const { updateWorker, workers } = useWorkersStore();
//   const { selectedFirmId } = useFirmsStore();
//   const { settings } = useSettingsStore();
//   const worker = workers.find((w) => w.id === workerId);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: new Date(),
//       amount: 0,
//       type: defaultType,
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     if (!selectedFirmId || !worker) {
//       toast.error("Worker or firm not found");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const newPayment: Payment = {
//         id: uuidv4(),
//         workerId,
//         firmId: selectedFirmId,
//         date: format(values.date, "yyyy-MM-dd"),
//         amount: values.amount,
//         type: values.type,
//         createdAt: new Date().toISOString(),
//       };

//       addPayment(newPayment);

//       if (values.type === "advance") {
//         // Advances increase advanceAmount
//         updateWorker(workerId, {
//           advanceAmount: (worker.advanceAmount || 0) + values.amount,
//         });
//       } else if (values.type === "payout") {
//         // Payouts reduce pendingAmount

//         updateWorker(workerId, {
//           payoutsMade: (worker.payoutsMade || 0) + values.amount,
//         }
//       );
     
//       }

//       toast.success(`${values.type === "advance" ? "Advance" : "Payout"} recorded successfully`);
//       form.reset({
//         date: new Date(),
//         amount: 0,
//         type: defaultType,
//       });
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(`Failed to record ${values.type}`);
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//     // const paymentType = form.watch("type");

//     // const pendingAmount = worker? (worker.totalAmount - worker.advanceAmount - worker?.payoutsMade) : 0;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Record Payment</DialogTitle>
//           <DialogDescription>
//             Record an advance or payout for {worker?.name || "worker"}.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Payment Type */}
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Payment Type</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select payment type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="advance">Advance</SelectItem>
//                       <SelectItem value="payout">Payout</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Date Picker */}
//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) =>
//                           date > new Date() || date < new Date("1900-01-01")
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Amount Input */}
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Amount</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Enter amount"
//                       {...field}
//                       onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                     />
//                   </FormControl>
//                   {/* {paymentType === "payout" && (
//                     <p className="text-sm text-muted-foreground">
//                       Available for payout: {settings.currency} {pendingAmount}
//                     </p>
//                   )} */}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Submit Button */}
//             <DialogFooter>
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 {isSubmitting ? "Processing..." : "Record Payment"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";
import { Payment } from "@/lib/types";

const formSchema = z.object({
  date: z.date(),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  type: z.enum(["advance", "payout"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
  defaultType?: "advance" | "payout";
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  workerId,
  defaultType = "advance",
}: AddPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPayment } = useLogsStore();
  const { updateWorker, workers } = useWorkersStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();


  // Calculate pending amount

  const { workLogs, payments, getWorkLogsByWorker, getPaymentsByWorker } = useLogsStore();
  const worker = workers.find((w) => w.id === workerId);

  const payoutsMade = payments
  .filter((payment) => payment.workerId === worker?.id && payment.type === "payout")
  .reduce((sum, payment) => sum + payment.amount, 0);

  console.log("Updated Worker:", payoutsMade);


  const pendingAmount = 
    worker?.totalAmount - (worker?.advanceAmount || 0) - (payoutsMade || 0);

    console.log(">>>>>>>>Woker",worker)
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), 
    defaultValues: {
      date: new Date(),
      amount: 0,
      type: defaultType,
    },
  });

  const paymentType = form.watch("type");

  const onSubmit = async (values: FormValues) => {
    if (!selectedFirmId || !worker) {
      toast.error("Worker or firm not found");
      return;
    }

    // Restrict payout amount to pending amount
    if (values.type === "payout" && values.amount > pendingAmount) {
      toast.error(`Payout amount cannot exceed pending amount (${settings.currency}${pendingAmount})`);
      return;
    }

    setIsSubmitting(true);

    try {
      const newPayment: Payment = {
        id: uuidv4(),
        workerId,
        firmId: selectedFirmId,
        date: format(values.date, "yyyy-MM-dd"),
        amount: values.amount,
        type: values.type,
        createdAt: new Date().toISOString(),
      };

      addPayment(newPayment);

      if (values.type === "advance") {
        // Advances increase advanceAmount
        updateWorker(workerId, {
          advanceAmount: (worker.advanceAmount || 0) + values.amount,
        });
      } else if (values.type === "payout") {
        // Payouts reduce payoutsMade
        updateWorker(workerId, {
          payoutsMade: (worker.payoutsMade || 0) + values.amount,
        });
      }

      toast.success(`${values.type === "advance" ? "Advance" : "Payout"} recorded successfully`);
      form.reset({
        date: new Date(),
        amount: 0,
        type: defaultType,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to record ${values.type}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record an advance or payout for {worker?.name || "worker"}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Payment Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="advance">Advance</SelectItem>
                      <SelectItem value="payout">Payout</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  {paymentType === "payout" && (
                    <p className="text-sm text-muted-foreground">
                      Available for payout: {settings.currency} {pendingAmount}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Processing..." : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}