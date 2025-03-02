// "use client"; // Mark this as a client-side component

// import { useFirmsStore } from '@/lib/store';
// import {AddWorkerFloatingButton} from './AddWorkerFloatingButton';

// export default function AddWorkerFloatingButtonWrapper() {
//   const { firms } = useFirmsStore();

//   // Render the floating button only if firms exist
//   if (firms.length === 0) return null;

//   return <AddWorkerFloatingButton />;
// }


"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // To detect the current route
import { useFirmsStore } from "@/lib/store";
import { AddWorkerDialog } from "@/components/workers/add-worker-dialog";

export default function AddWorkerFloatingButtonWrapper() {
  const { firms } = useFirmsStore();
  const [showAddWorkerDialog, setShowAddWorkerDialog] = useState(false);

  // Detect the current route
  const pathname = usePathname();

  // // List of routes where the floating button should NOT appear
  // const excludedRoutes = ["/workers", "/settings", "/reports", "/workers/[id]"];

  // // Do not render the button if no firms exist or if the current route is excluded
  // if (firms.length === 0 || excludedRoutes.includes(pathname)) return null;

  // Only show the floating button on the /dashboard route
  const allowedRoute = "/";

  // Do not render the button if no firms exist or if the current route is not the allowed route
  if (firms.length === 0 || pathname !== allowedRoute) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowAddWorkerDialog(true)}
        className="fixed bottom-20 right-6 z-50 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all p-3 flex items-center space-x-2"
        aria-label="Add Worker" // Accessibility improvement
      >
        {/* "+" Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        {/* "Add Worker" Text */}
        <span className="text-sm font-medium">Add Worker</span>
      </button>

      {/* Add Worker Dialog */}
      <AddWorkerDialog
        open={showAddWorkerDialog}
        onOpenChange={setShowAddWorkerDialog}
      />
    </>
  );
}