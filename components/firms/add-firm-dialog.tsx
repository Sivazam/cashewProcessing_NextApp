"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
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
import { useFirmsStore } from "@/lib/store";
import { Firm } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Firm name must be at least 2 characters.",
  }),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFirmDialog({ open, onOpenChange }: AddFirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addFirm, selectFirm } = useFirmsStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newFirm: Firm = {
        id: uuidv4(),
        name: values.name,
        location: values.location || undefined,
        createdAt: new Date().toISOString(),
      };
      
      addFirm(newFirm);
      selectFirm(newFirm.id);
      
      toast.success("Firm added successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add firm");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Firm</DialogTitle>
          <DialogDescription>
            Create a new processing unit to track workers and production.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter firm name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Firm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}