"use client";
import { useRouter } from "next/navigation";
import { useFirmsStore } from "@/lib/store";
import { PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function AddWorkerFloatingButton() {
  const router = useRouter();
  const { firms } = useFirmsStore(); // Access the list of firms
  const pathname = usePathname(); // Get the current route

  // Check if the button should be displayed
  const shouldShowButton = firms.length > 0 && !pathname.includes("settings");

  if (!shouldShowButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => router.push("/workers/add")}
        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-all"
      >
        <PlusCircle size={20} />
        <span>Add Worker</span>
      </button>
    </div>
  );
}