// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { MainNav } from "@/components/layout/main-nav";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useSettingsStore, useFirmsStore, useWorkersStore, useLogsStore } from "@/lib/store";

// const formSchema = z.object({
//   pricePerKg: z.coerce.number().positive({
//     message: "Price per kg must be a positive number.",
//   }),
//   currency: z.string().min(1, {
//     message: "Please select a currency.",
//   }),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function SettingsPage() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showResetDialog, setShowResetDialog] = useState(false);
  
//   const { settings, updateSettings } = useSettingsStore();
//   const { firms, selectedFirmId } = useFirmsStore();
  
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       pricePerKg: settings.pricePerKg,
//       currency: settings.currency,
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     setIsSubmitting(true);
//     try {
//       updateSettings({
//         pricePerKg: values.pricePerKg,
//         currency: values.currency,
//       });
      
//       toast.success("Settings updated successfully");
//     } catch (error) {
//       toast.error("Failed to update settings");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleResetApp = () => {
//     // This would clear all app data
//     localStorage.clear();
//     window.location.reload();
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <MainNav />
//       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
//         </div>
        
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <Card className="col-span-2">
//             <CardHeader>
//               <CardTitle>General Settings</CardTitle>
//               <CardDescription>
//                 Configure application-wide settings
//               </CardDescription>
//             </CardHeader>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)}>
//                 <CardContent className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="pricePerKg"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price per Kilogram</FormLabel>
//                         <FormControl>
//                           <Input 
//                             type="number" 
//                             placeholder="Enter price per kg" 
//                             {...field} 
//                             onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           The amount paid to workers per kilogram processed
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="currency"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Currency</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select currency" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="₹">Indian Rupee (₹)</SelectItem>
//                             <SelectItem value="$">US Dollar ($)</SelectItem>
//                             <SelectItem value="€">Euro (€)</SelectItem>
//                             <SelectItem value="£">British Pound (£)</SelectItem>
//                             <SelectItem value="¥">Japanese Yen (¥)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormDescription>
//                           Currency symbol used throughout the application
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//                 <CardFooter>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? "Saving..." : "Save Changes"}
//                   </Button>
//                 </CardFooter>
//               </form>
//             </Form>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Danger Zone</CardTitle>
//               <CardDescription>
//                 Irreversible actions that affect your data
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="rounded-md border border-destructive/50 p-4">
//                 <h3 className="text-lg font-medium text-destructive">Reset Application</h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   This will delete all your data including firms, workers, work logs, and payments.
//                   This action cannot be undone.
//                 </p>
//                 <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="destructive" className="mt-4">
//                       Reset Application
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This action cannot be undone. This will permanently delete all your
//                         data and reset the application to its default state.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={handleResetApp}
//                         className="bg-destructive text-destructive-foreground"
//                       >
//                         Reset
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MainNav } from "@/components/layout/main-nav";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettingsStore, useFirmsStore } from "@/lib/store";

const formSchema = z.object({
  pricePerKg: z.coerce.number().positive({
    message: "Price per kg must be a positive number.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
});
type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [editFirmId, setEditFirmId] = useState<string | null>(null);

  const { settings, updateSettings } = useSettingsStore();
  const { firms, selectedFirmId, addFirm, updateFirm, deleteFirm } = useFirmsStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricePerKg: settings.pricePerKg,
      currency: settings.currency,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      updateSettings({
        pricePerKg: values.pricePerKg,
        currency: values.currency,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleEditFirm = (firmId: string) => {
    setEditFirmId(firmId);
  };

  const handleDeleteFirm = (firmId: string) => {
    deleteFirm(firmId);
    toast.success("Firm deleted successfully");
  };

  const handleSaveFirm = (firmId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("Firm name cannot be empty");
      return;
    }
    updateFirm(firmId, { name: newName });
    setEditFirmId(null);
    toast.success("Firm updated successfully");
  };

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* General Settings */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure application-wide settings</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pricePerKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Kilogram</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price per kg"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormDescription>
                          The amount paid to workers per kilogram processed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="₹">Indian Rupee (₹)</SelectItem>
                            {/* <SelectItem value="$">US Dollar ($)</SelectItem>
                            <SelectItem value="€">Euro (€)</SelectItem>
                            <SelectItem value="£">British Pound (£)</SelectItem>
                            <SelectItem value="¥">Japanese Yen (¥)</SelectItem> */}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Currency symbol used throughout the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {/* Manage Firms */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Firms</CardTitle>
              <CardDescription>edit, or delete firms</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Firm Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firms.map((firm) => (
                    <TableRow key={firm.id}>
                      <TableCell>
                        {editFirmId === firm.id ? (
                          <Input
                            defaultValue={firm.name}
                            onBlur={(e) =>
                              handleSaveFirm(firm.id, e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSaveFirm(firm.id, e.currentTarget.value)
                            }
                            autoFocus
                          />
                        ) : (
                          firm.name
                        )}
                      </TableCell>
                      <TableCell>
                      <div className="flex gap-2">
                        {editFirmId !== firm.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFirm(firm.id)}
                            className="p-2"
                          >
                            <Pencil className="h-4 w-4" /> {/* Edit Icon */}
                          </Button>
                        )}

                          
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="p-2"
                            >
                              <Trash2 className="h-4 w-4" /> {/* Delete Icon */}
                            </Button>
                            
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the firm and all associated data. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteFirm(firm.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                    </TableRow>
                  
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* App About */}
          <Card>
            <CardHeader>
              <CardTitle>About the App</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <img
                  // src="https://cdn.qwenlm.ai/output/21cc021e-0871-4212-9711-801baa62a955/t2i/1232a6ac-bc1a-4a78-9bc9-c78276e3ec09/71be2a8f-0854-4cb9-9152-965d819cc581.png" // Replace with your app logo path
                  src="https://cdn.qwenlm.ai/output/21cc021e-0871-4212-9711-801baa62a955/t2i/641eb353-3603-4c71-89b0-202043e8ae35/a02101b3-7edb-4928-8d0d-33a3c131c94f.png" // Replace with your app logo path
                  
                  alt="App Logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">Worker Management App</h3>
                <p className="text-sm text-muted-foreground">
                  Version 1.0.0
                </p>
                <p className="text-sm text-muted-foreground">
                  A simple app to manage workers, firms, and payments.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/50 p-4">
                <h3 className="text-lg font-medium text-destructive">
                  Reset Application
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will delete all your data including firms, workers, work logs, and
                  payments. This action cannot be undone.
                </p>
                <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-4">
                      Reset Application
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your
                        data and reset the application to its default state.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetApp}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}