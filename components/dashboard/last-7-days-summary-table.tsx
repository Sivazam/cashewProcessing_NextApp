// "use client";

// import { useEffect, useState } from "react";
// import { format, subDays } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useLogsStore, useFirmsStore } from "@/lib/store";

// export function Last7DaysSummaryTable() {
//   const [summaryData, setSummaryData] = useState<
//     { date: string; totalKgsProcessed: number }[]
//   >([]);
//   const { workLogs } = useLogsStore();
//   const { selectedFirmId } = useFirmsStore();

//   useEffect(() => {
//     if (!selectedFirmId) return;

//     const dates = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), "yyyy-MM-dd"));
//     const summaries = dates.map((date) => {
//       const kgsProcessed = workLogs
//         .filter((log) => log.firmId === selectedFirmId && log.date === date)
//         .reduce((sum, log) => sum + log.kgsProcessed, 0);

//       return {
//         date,
//         totalKgsProcessed: kgsProcessed,
//       };
//     });

//     setSummaryData(summaries.reverse());
//   }, [workLogs, selectedFirmId]);

//   if (!selectedFirmId) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Last 7 Days Summary</CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Please select a firm to view the last 7 days summary
//           </p>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Last 7 Days Summary</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Total Kgs Processed</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {summaryData.map((summary, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2">{summary.date}</td>
//                   <td className="px-4 py-2">{summary.totalKgsProcessed} kg</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLogsStore, useFirmsStore } from "@/lib/store";

export function Last7DaysSummaryTable() {
  const [summaryData, setSummaryData] = useState<
    { formattedDate: string; day: string; totalKgsProcessed: number }[]
  >([]);
  const { workLogs } = useLogsStore();
  const { selectedFirmId } = useFirmsStore();

  useEffect(() => {
    if (!selectedFirmId) return;

    // Generate the last 7 days' dates
    const dates = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));

    // Calculate the total kgs processed for each day
    const summaries = dates.map((date) => {
      const formattedDate = format(date, "dd/MM/yy"); // Full date format
      const day = format(date, "dd"); // Only the day (e.g., "01", "02")
      const kgsProcessed =
        workLogs
          ?.filter(
            (log) =>
              log.firmId === selectedFirmId &&
              format(new Date(log.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
          )
          .reduce((sum, log) => sum + (log.kgsProcessed || 0), 0) || 0;

      return {
        formattedDate,
        day,
        totalKgsProcessed: kgsProcessed,
      };
    });

    // Reverse the array to show the oldest date first
    setSummaryData(summaries.reverse());
  }, [workLogs, selectedFirmId]);

  if (!selectedFirmId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please select a firm to view the last 7 days summary
          </p>
        </CardHeader>
      </Card>
    );
  }

  // Check if there is no data to display
  if (summaryData.every((item) => item.totalKgsProcessed === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            No data available for the last 7 days.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 7 Days Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={summaryData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {/* Gridlines */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* Axes */}
            <XAxis dataKey="day" />
            <YAxis />

            {/* Tooltip */}
            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;

                const data = payload[0].payload;
                return (
                  <div className="bg-background p-2 rounded shadow">
                    <p>{data.formattedDate}</p>
                    <p>
                      Total Processed: {data.totalKgsProcessed} kg
                    </p>
                  </div>
                );
              }}
            />

            {/* Legend */}
            {/* <Legend /> */}

            {/* Line Chart */}
            <Line
              type="monotone"
              dataKey="totalKgsProcessed"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: "#8884d8", r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* Gradient Area */}
            <defs>
              <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="totalKgsProcessed"
              stroke="url(#colorProcessed)"
              fill="url(#colorProcessed)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}