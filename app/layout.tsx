
// import './globals.css';
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
// import { Toaster as SonnerToaster } from '@/components/ui/sonner';
// import AddWorkerFloatingButton from "@/components/AddWorkerFloatingButton";
// import { useFirmsStore } from '@/lib/store';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'CashewTrack - Cashew Processing Management',
//   description: 'Manage your cashew processing operations efficiently',
// };


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { firms } = useFirmsStore();

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem
//           disableTransitionOnChange
//         >
//           {children}
//           {/* Render the floating button only if firms exist */}
//         {firms.length > 0 && <AddWorkerFloatingButton />}
//           <Toaster />
//           <SonnerToaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import AddWorkerFloatingButtonWrapper from '@/components/AddWorkerFloatingButtonWrapper'; // New wrapper component
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CashewTrack - Cashew Processing Management',
  description: 'Manage your cashew processing operations efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* Wrap the floating button logic in a client-side component */}
          <AddWorkerFloatingButtonWrapper />
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}