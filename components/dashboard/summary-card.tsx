"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsStore } from "@/lib/store";

interface SummaryCardProps {
  title: string;
  value: number;
  type?: "currency" | "number" | "kg";
  icon: React.ReactNode;
  description?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  type = "number", 
  icon,
  description 
}: SummaryCardProps) {
  const { settings } = useSettingsStore();
  
  const formattedValue = () => {
    if (type === "currency") {
      return `${settings.currency} ${value.toLocaleString()}`;
    } else if (type === "kg") {
      return `${value.toLocaleString()} kg`;
    } else {
      return value.toLocaleString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-primary">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue()}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}