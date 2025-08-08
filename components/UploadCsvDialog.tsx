// components/upload-excel-dialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkersStore, useLogsStore, useFirmsStore } from "@/lib/store";
import { Worker, WorkLog, Payment } from "@/lib/types";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

interface UploadExcelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadExcelDialog({ open, onOpenChange }: UploadExcelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addWorker, updateWorker, workers } = useWorkersStore();
  const { addWorkLog, addPayment } = useLogsStore();
  const { selectedFirmId } = useFirmsStore();

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   setIsSubmitting(true);

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     try {
  //       const data = e.target?.result;
  //       if (!data) {
  //         toast.error("Failed to read file");
  //         return;
  //       }

  //       // Parse the Excel file
  //       const workbook = XLSX.read(data, { type: "binary" });
  //       const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
  //       const sheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  //       // Skip the header and metadata rows (first 4 rows)
  //       for (let i = 4; i < jsonData.length; i++) {
  //         const row = jsonData[i];
  //         const [date, workerName, kgsProcessed, advancesGiven, totalAmountEarned, payoutsMade, pendingPayable] = row;

  //         // Skip empty rows
  //         if (!workerName || !date) continue;

  //         // Parse the date from the Excel file
  //         let parsedDate: Date;
  //         if (typeof date === "string") {
  //           // Handle date strings like "Feb 26, Feb 26, Mar 01, Mar 02"
  //           const dateParts = date.split(", "); // Split multiple dates
  //           parsedDate = new Date(dateParts[0]); // Use the first date
  //         } else if (typeof date === "number") {
  //           // Handle Excel serial dates (e.g., 44927 for Feb 26, 2023)
  //           parsedDate = XLSX.SSF.parse_date_code(date);
  //         } else {
  //           // Fallback to current date if parsing fails
  //           parsedDate = new Date();
  //         }

  //         // Validate the parsed date
  //         if (isNaN(parsedDate.getTime())) {
  //           console.warn(`Invalid date for worker ${workerName}: ${date}`);
  //           parsedDate = new Date(); // Fallback to current date
  //         }

  //         // Find or create worker
  //         let worker = workers.find((w) => w.name === workerName);
  //         if (!worker) {
  //           worker = {
  //             id: uuidv4(),
  //             name: workerName,
  //             phone: "", // You can add phone if available in the Excel file
  //             firmId: selectedFirmId!,
  //             totalKgsProcessed: 0,
  //             totalAmount: 0,
  //             advanceAmount: 0,
  //             payoutsMade: 0,
  //             createdAt: new Date().toISOString(),
  //           };
  //           addWorker(worker);
  //         }

  //         // Add work log
  //         if (kgsProcessed) {
  //           const workLog: WorkLog = {
  //             id: uuidv4(),
  //             workerId: worker.id,
  //             firmId: selectedFirmId!,
  //             date: parsedDate.toISOString(), // Use the parsed date
  //             kgsProcessed: parseFloat(kgsProcessed),
  //             createdAt: new Date().toISOString(),
  //           };
  //           addWorkLog(workLog);

  //           // Update worker's total kgs processed and total amount
  //           updateWorker(worker.id, {
  //             totalKgsProcessed: (worker.totalKgsProcessed || 0) + parseFloat(kgsProcessed),
  //             totalAmount: (worker.totalAmount || 0) + parseFloat(totalAmountEarned || 0),
  //           });
  //         }

  //         // Add advance or payout
  //         if (advancesGiven) {
  //           const payment: Payment = {
  //             id: uuidv4(),
  //             workerId: worker.id,
  //             firmId: selectedFirmId!,
  //             date: parsedDate.toISOString(),
  //             amount: parseFloat(advancesGiven),
  //             type: "advance",
  //             createdAt: new Date().toISOString(),
  //           };
  //           addPayment(payment);

  //           // Update worker's advance amount
  //           updateWorker(worker.id, {
  //             advanceAmount: (worker.advanceAmount || 0) + parseFloat(advancesGiven),
  //           });
  //         }

  //         if (payoutsMade) {
  //           const payment: Payment = {
  //             id: uuidv4(),
  //             workerId: worker.id,
  //             firmId: selectedFirmId!,
  //             date: parsedDate.toISOString(),
  //             amount: parseFloat(payoutsMade),
  //             type: "payout",
  //             createdAt: new Date().toISOString(),
  //           };
  //           addPayment(payment);

  //           // Update worker's payouts made
  //           updateWorker(worker.id, {
  //             payoutsMade: (worker.payoutsMade || 0) + parseFloat(payoutsMade),
  //           });
  //         }
  //       }

  //       toast.success("Excel data uploaded successfully");
  //       onOpenChange(false);
  //     } catch (error) {
  //       toast.error("Failed to upload Excel data");
  //       console.error(error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  //   reader.readAsBinaryString(file);
  // };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setIsSubmitting(true);
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          toast.error("Failed to read file");
          return;
        }
  
        // Parse the Excel file
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  
        // Skip the header and metadata rows (first 4 rows)
        for (let i = 4; i < jsonData.length; i++) {
          const row = jsonData[i];
          const [date, workerName, kgsProcessed, advancesGiven, totalAmountEarned, payoutsMade, pendingPayable] = row;
  
          // Skip empty rows
          if (!workerName || !date) continue;
  
          // Parse the date from the Excel file
          let parsedDate: Date;
          if (typeof date === "string") {
            parsedDate = new Date(date);
          } else if (typeof date === "number") {
            parsedDate = XLSX.SSF.parse_date_code(date);
          } else {
            parsedDate = new Date();
          }
  
          // Validate the parsed date
          if (isNaN(parsedDate.getTime())) {
            console.warn(`Invalid date for worker ${workerName}: ${date}`);
            parsedDate = new Date();
          }
  
          // Find or create worker
          let worker = workers.find((w) => w.name === workerName);
          if (!worker) {
            worker = {
              id: uuidv4(),
              name: workerName,
              phone: "", // Add phone if available in the CSV
              firmId: selectedFirmId!,
              totalKgsProcessed: 0,
              totalAmount: 0,
              advanceAmount: 0,
              payoutsMade: 0,
              createdAt: new Date().toISOString(),
            };
            addWorker(worker);
          }
  
          // Add work log
          if (kgsProcessed) {
            const workLog: WorkLog = {
              id: uuidv4(),
              workerId: worker.id,
              firmId: selectedFirmId!,
              date: parsedDate.toISOString(),
              kgsProcessed: parseFloat(kgsProcessed),
              amountEarned: parseFloat(totalAmountEarned || 0),
              createdAt: new Date().toISOString(),
            };
            addWorkLog(workLog);
  
            // Update worker's total kgs processed and total amount
            updateWorker(worker.id, {
              totalKgsProcessed: (worker.totalKgsProcessed || 0) + parseFloat(kgsProcessed),
              totalAmount: (worker.totalAmount || 0) + parseFloat(totalAmountEarned || 0),
            });
          }
  
          // Add advance or payout
          if (advancesGiven) {
            const payment: Payment = {
              id: uuidv4(),
              workerId: worker.id,
              firmId: selectedFirmId!,
              date: parsedDate.toISOString(),
              amount: parseFloat(advancesGiven),
              type: "advance",
              createdAt: new Date().toISOString(),
            };
            addPayment(payment);
  
            // Update worker's advance amount
            updateWorker(worker.id, {
              advanceAmount: (worker.advanceAmount || 0) + parseFloat(advancesGiven),
            });
          }
  
          if (payoutsMade) {
            const payment: Payment = {
              id: uuidv4(),
              workerId: worker.id,
              firmId: selectedFirmId!,
              date: parsedDate.toISOString(),
              amount: parseFloat(payoutsMade),
              type: "payout",
              createdAt: new Date().toISOString(),
            };
            addPayment(payment);
  
            // Update worker's payouts made
            updateWorker(worker.id, {
              payoutsMade: (worker.payoutsMade || 0) + parseFloat(payoutsMade),
            });
          }
        }
  
        toast.success("Excel data uploaded successfully");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to upload Excel data");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    reader.readAsBinaryString(file);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file to create or update workers and their logs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept=".xlsx" onChange={handleFileUpload} disabled={isSubmitting} />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}