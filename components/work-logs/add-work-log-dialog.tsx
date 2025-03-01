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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogsStore, useWorkersStore, useFirmsStore, useSettingsStore } from "@/lib/store";
import { WorkLog } from "@/lib/types";

const formSchema = z.object({
  date: z.date(),
  kgsProcessed: z.coerce.number().positive({
    message: "Kilograms must be a positive number.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWorkLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
}

export function AddWorkLogDialog({ open, onOpenChange, workerId }: AddWorkLogDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addWorkLog } = useLogsStore();
  const { updateWorker, workers } = useWorkersStore();
  const { selectedFirmId } = useFirmsStore();
  const { settings } = useSettingsStore();

  const worker = workers.find(w => w.id === workerId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      kgsProcessed: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedFirmId || !worker) {
      toast.error("Worker or firm not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const amountEarned = values.kgsProcessed * settings.pricePerKg;
      
      const newWorkLog: WorkLog = {
        id: uuidv4(),
        workerId,
        firmId: selectedFirmId,
        date: format(values.date, "yyyy-MM-dd"),
        kgsProcessed: values.kgsProcessed,
        amountEarned,
        createdAt: new Date().toISOString(),
      };
      
      addWorkLog(newWorkLog);
      
      // Update worker totals
      updateWorker(workerId, {
        totalKgsProcessed: worker.totalKgsProcessed + values.kgsProcessed,
        totalAmount: worker.totalAmount + amountEarned,
      });
      
      toast.success("Work log added successfully");
      form.reset({
        date: new Date(),
        kgsProcessed: 0,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add work log");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Work Log</DialogTitle>
          <DialogDescription>
            Record work done by {worker?.name || "worker"}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="kgsProcessed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilograms Processed</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter kilograms" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground">
              Amount to be earned: {settings.currency} {(form.watch("kgsProcessed") || 0) * settings.pricePerKg}
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Adding..." : "Add Work Log"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}