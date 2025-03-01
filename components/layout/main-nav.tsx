// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import { Button } from "@/components/ui/button";
// import { 
//   Home, 
//   Users, 
//   BarChart3, 
//   Settings, 
//   Menu, 
//   X 
// } from "lucide-react";
// import { useState } from "react";
// import { useFirmsStore } from "@/lib/store";
// import { 
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { FirmSwitcher } from "@/components/firms/firm-switcher";

// export function MainNav() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const { firms, selectedFirmId } = useFirmsStore();
  
//   const routes = [
//     {
//       href: "/",
//       label: "Dashboard",
//       icon: <Home className="h-5 w-5 mr-2" />,
//       active: pathname === "/",
//     },
//     {
//       href: "/workers",
//       label: "Workers",
//       icon: <Users className="h-5 w-5 mr-2" />,
//       active: pathname === "/workers" || pathname.startsWith("/workers/"),
//     },
//     {
//       href: "/reports",
//       label: "Reports",
//       icon: <BarChart3 className="h-5 w-5 mr-2" />,
//       active: pathname === "/reports",
//     },
//     {
//       href: "/settings",
//       label: "Settings",
//       icon: <Settings className="h-5 w-5 mr-2" />,
//       active: pathname === "/settings",
//     },
//   ];

//   return (
//     <div className="border-b bg-card">
//       <div className="flex h-16 items-center px-4">
//         <div className="flex items-center">
//           <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetTrigger asChild className="lg:hidden">
//               <Button variant="ghost" size="icon" className="mr-2">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-[240px] sm:w-[300px]">
//               <div className="flex flex-col h-full">
//                 <div className="flex items-center justify-between py-2">
//                   <h2 className="text-lg font-semibold">CashewTrack</h2>
//                   <Button 
//                     variant="ghost" 
//                     size="icon"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <X className="h-5 w-5" />
//                   </Button>
//                 </div>
//                 <div className="py-4">
//                   <FirmSwitcher />
//                 </div>
//                 <nav className="flex flex-col gap-1">
//                   {routes.map((route) => (
//                     <Link
//                       key={route.href}
//                       href={route.href}
//                       onClick={() => setIsOpen(false)}
//                       className={cn(
//                         "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
//                         route.active
//                           ? "bg-primary text-primary-foreground"
//                           : "hover:bg-muted"
//                       )}
//                     >
//                       {route.icon}
//                       {route.label}
//                     </Link>
//                   ))}
//                 </nav>
//               </div>
//             </SheetContent>
//           </Sheet>
//           <Link href="/" className="flex items-center">
//             <h1 className="text-xl font-bold tracking-tight">
//               CashewTrack
//             </h1>
//           </Link>
//         </div>
//         <nav className="hidden lg:flex mx-6 items-center space-x-4 lg:space-x-6">
//           {routes.map((route) => (
//             <Link
//               key={route.href}
//               href={route.href}
//               className={cn(
//                 "flex items-center text-sm font-medium transition-colors hover:text-primary",
//                 route.active
//                   ? "text-primary"
//                   : "text-muted-foreground"
//               )}
//             >
//               {route.label}
//             </Link>
//           ))}
//         </nav>
//         <div className="ml-auto flex items-center space-x-4">
//           <div className="hidden md:block">
//             <FirmSwitcher />
//           </div>
//           <ModeToggle />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useFirmsStore } from "@/lib/store";
import { FirmSwitcher } from "@/components/firms/firm-switcher";

export function MainNav() {
  const pathname = usePathname();
  const { firms, selectedFirmId } = useFirmsStore();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/workers",
      label: "Workers",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/workers" || pathname.startsWith("/workers/"),
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/reports",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          {/* Page Name */}
          <Link href="/" className="flex items-center">
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              CashewTrack
            </h1>
          </Link>

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex mx-6 items-center space-x-4 lg:space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  route.active
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Firm Switcher and Theme Toggle */}
          <div className="ml-auto flex items-center space-x-4">
            {/* Firm Switcher */}
            <div className="hidden sm:block">
              <FirmSwitcher />
            </div>
            {/* Smaller Firm Switcher for Mobile */}
            <div className="block sm:hidden">
              <FirmSwitcher className="w-32 text-xs" />
            </div>
            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Bottom Tabs for Mobile */}
      <div
        className="block lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav className="flex justify-around items-center h-16">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs transition-colors",
                route.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}