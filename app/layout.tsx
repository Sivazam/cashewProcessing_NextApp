
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

// import './globals.css';
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
// import { Toaster as SonnerToaster } from '@/components/ui/sonner';
// import AddWorkerFloatingButtonWrapper from '@/components/AddWorkerFloatingButtonWrapper'; // New wrapper component
// const inter = Inter({ subsets: ['latin'] });
// import { SplashScreen } from "@/components/SplashScreen";


// export const metadata: Metadata = {
//   title: 'CashewTrack - Cashew Processing Management',
//   description: 'Manage your cashew processing operations efficiently',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
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
//           <SplashScreen />
//           {/* Wrap the floating button logic in a client-side component */}
//           <AddWorkerFloatingButtonWrapper />
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
import AddWorkerFloatingButtonWrapper from '@/components/AddWorkerFloatingButtonWrapper';
const inter = Inter({ subsets: ['latin'] });
import { SplashScreen } from "@/components/SplashScreen";
import LogoPng from "@/assets/CashuLogo.png"; // Import the PNG
import LogoIco from "@/assets/CashuLogo.ico"; // Import the PNG

// Generate the full URL for the image
const fullLogoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${LogoPng.src}`;
const fullLogoIcoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${LogoIco.src}`;


export const metadata: Metadata = {
  title: 'CashU Pay - Track. Pay. Grow.',
  description: 'Manage your cashew nut processing operations efficiently',
  keywords: ['cashew', 'management', 'processing', 'tracking', 'business', 'accopunting', 'inventory',  'cashewtrack', 'cashu.in'],
  authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
  openGraph: {
    title: 'CashU Pay - Cashew Processing Management',
    description: 'Manage your cashew processing operations efficiently',
    url: 'https://yourwebsite.com',
    siteName: 'CashewTrack',
    images: [
      {
        url: fullLogoUrl, // Use the full URL for the OpenGraph image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashewTrack - Cashew Processing Management',
    description: 'Manage your cashew processing operations efficiently',
    images: [fullLogoUrl], // Use the full URL for the Twitter image
  },
  icons: {
    icon: fullLogoIcoUrl, // Path to the favicon (see next section)
  },
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
          <SplashScreen />
          <AddWorkerFloatingButtonWrapper />
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}