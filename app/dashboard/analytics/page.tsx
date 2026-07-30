"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


export default function AnalyticsPage() {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState<
  { day: string; revenue: number }[]
>([]);
const [selectedFilter, setSelectedFilter] = useState("week");
const [selectedPeriod, setSelectedPeriod] = useState("today");
const [displayRevenue, setDisplayRevenue] = useState(0);

  useEffect(() => {
    getRevenue();
}, []);

useEffect(() => {
    switch (selectedPeriod) {
        case "today":
            setDisplayRevenue(todayRevenue);
            break;

        case "week":
            setDisplayRevenue(weekRevenue);
            break;

        case "month":
            setDisplayRevenue(monthRevenue);
            break;

        case "year":
            setDisplayRevenue(totalRevenue);
            break;

        case "all":
            setDisplayRevenue(totalRevenue);
            break;
    }
}, [
    selectedPeriod,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    totalRevenue,
]);

  async function getRevenue() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*");

  if (error || !orders) return;

  let todayTotal = 0;
  let weekTotal = 0;
  let monthTotal = 0;
  let overallTotal = 0;

  const today = new Date();

  orders.forEach((order) => {
    const amount = Number(order.total);
    const orderDate = new Date(order.created_at);

    overallTotal += amount;

    // Today
    if (
      orderDate.toDateString() === today.toDateString()
    ) {
      todayTotal += amount;
    }

    // This Week
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    if (orderDate >= weekAgo) {
      weekTotal += amount;
    }

    // This Month
    if (
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    ) {
      monthTotal += amount;
    }
  });

  setTodayRevenue(todayTotal);
  setWeekRevenue(weekTotal);
  setMonthRevenue(monthTotal);
  setTotalRevenue(overallTotal);

  const dailySales = [
  { day: "Mon", revenue: 0 },
  { day: "Tue", revenue: 0 },
  { day: "Wed", revenue: 0 },
  { day: "Thu", revenue: 0 },
  { day: "Fri", revenue: 0 },
  { day: "Sat", revenue: 0 },
  { day: "Sun", revenue: 0 },
];

orders.forEach((order: any) => {
  const date = new Date(order.created_at);
  const dayIndex = date.getDay();

  const map = [6, 0, 1, 2, 3, 4, 5];

  dailySales[map[dayIndex]].revenue += Number(order.total);
});

setSalesData(dailySales);
}
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Revenue Analytics
        </h1>
        <p className="text-gray-500 mt-2">
  Track your sales performance and revenue.
</p>

</div>

   <div className="flex flex-wrap gap-3 mb-8">
  <button
  onClick={() => setSelectedPeriod("today")}
  className={`px-4 py-2 rounded-lg ${
    selectedPeriod === "today"
      ? "bg-orange-500 text-white"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
    Today
  </button>

  <button
    onClick={() => setSelectedPeriod("week")}
    className={`px-4 py-2 rounded-lg ${
        selectedPeriod === "week"
            ? "bg-orange-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
    }`}
>
    This Week
</button>

  <button
    onClick={() => setSelectedPeriod("month")}
    className={`px-4 py-2 rounded-lg ${
        selectedPeriod === "month"
            ? "bg-orange-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
    }`}
>
    This Month
</button>

  <button
    onClick={() => setSelectedPeriod("year")}
    className={`px-4 py-2 rounded-lg ${
        selectedPeriod === "year"
            ? "bg-orange-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
    }`}
>
    This Year
</button>

  <button
    onClick={() => setSelectedPeriod("all")}
    className={`px-4 py-2 rounded-lg ${
        selectedPeriod === "all"
            ? "bg-orange-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
    }`}
>
    All Time
</button>
</div>
       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-gray-500 capitalize">
        {selectedPeriod === "all"
            ? "Total Revenue"
            : `Revenue ${selectedPeriod}`}
    </p>

    <h2 className="text-4xl font-bold mt-2 text-green-600">
        ₦{displayRevenue.toLocaleString()}
    </h2>
</div>
<div className="bg-white rounded-2xl shadow p-6 mt-10 col-span-full">
  <h2 className="text-2xl font-bold mb-6">Sales Trend</h2>

  <div className="w-full" style={{ height: 500 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#f97316"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
</div>
      </div>
    
  );
}