// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "sonner";
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
// import { useWorkersStore, useFirmsStore } from "@/lib/store";
// import { Worker } from "@/lib/types";

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Worker name must be at least 2 characters.",
//   }),
//   phone: z.string().optional(),
// });

// type FormValues = z.infer<typeof formSchema>;

// interface AddWorkerDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function AddWorkerDialog({ open, onOpenChange }: AddWorkerDialogProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { addWorker } = useWorkersStore();
//   const { selectedFirmId } = useFirmsStore();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       phone: "",
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     if (!selectedFirmId) {
//       toast.error("Please select a firm first");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const newWorker: Worker = {
//         id: uuidv4(),
//         name: values.name,
//         phone: values.phone || undefined,
//         firmId: selectedFirmId,
//         totalKgsProcessed: 0,
//         totalAmount: 0,
//         advanceAmount: 0,
//         createdAt: new Date().toISOString(),
//       };
      
//       addWorker(newWorker);
      
//       toast.success("Worker added successfully");
//       form.reset();
//       onOpenChange(false);
//     } catch (error) {
//       toast.error("Failed to add worker");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Worker</DialogTitle>
//           <DialogDescription>
//             Add a new worker to the selected firm.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Worker Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter worker name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number (Optional)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter phone number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button type="submit" disabled={isSubmitting || !selectedFirmId}>
//                 {isSubmitting ? "Adding..." : "Add Worker"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState, useRef } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkersStore, useFirmsStore } from "@/lib/store";
import { Worker } from "@/lib/types";
import { Camera, ImagePlus, X, Upload } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Worker name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWorkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWorkerDialog({ open, onOpenChange }: AddWorkerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addWorker } = useWorkersStore();
  const { selectedFirmId } = useFirmsStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
    },
  });

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setAvatarPreview(dataUrl);
        form.setValue('avatar', dataUrl);
        
        // Stop camera
        stopCamera();
      }
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
        form.setValue('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    form.setValue('avatar', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedFirmId) {
      toast.error("Please select a firm first");
      return;
    }

    setIsSubmitting(true);
    try {
      const newWorker: Worker = {
        id: uuidv4(),
        name: values.name,
        phone: values.phone || undefined,
        avatar: values.avatar || undefined,
        firmId: selectedFirmId,
        totalKgsProcessed: 0,
        totalAmount: 0,
        advanceAmount: 0,
        createdAt: new Date().toISOString(),
      };
      
      addWorker(newWorker);
      
      toast.success("Worker added successfully");
      form.reset();
      setAvatarPreview(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add worker");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && isCameraActive) {
        stopCamera();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
          <DialogDescription>
            Add a new worker to the selected firm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Selection Section and camera preview */}
            
            
            <div className="mb-4">
              <FormLabel className="block mb-2">Profile Picture (Optional)</FormLabel>
              <div className="flex items-center gap-2 mb-3">
                {!isCameraActive && (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={startCamera}
                      className="flex items-center gap-1"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Camera</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1"
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span>Gallery</span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileSelection}
                      className="hidden"
                    />
                  </>
                )}
                
                {isCameraActive && (
                  <>
                    <Button 
                      type="button" 
                      variant="default" 
                      size="sm" 
                      onClick={capturePhoto}
                      className="flex items-center gap-1"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Take Photo</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={stopCamera}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </>
                )}
              </div>
              
              <div className="relative">
                {isCameraActive ? (
                  <div className="rounded-lg overflow-hidden bg-gray-100 mb-3 aspect-square max-h-48">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : avatarPreview ? (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3 aspect-square max-h-48">
                    <Image 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeAvatar}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Worker Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter worker name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedFirmId || isCameraActive}
                className="w-full"
              >
                {isSubmitting ? "Adding..." : "Add Worker"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}