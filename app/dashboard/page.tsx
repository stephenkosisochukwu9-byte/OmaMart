"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

useEffect(() => {
 async function initialize() {
  const result = await requireAdmin();

  console.log("Admin check:", result);


if (!result.authorized) {
  router.replace("/admin/login");
  return;
}

  getProducts();
  getOrders();
}

  initialize();
}, []);

async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setProducts(data || []);
}
async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  setOrders(data || []);
  const allOrders = data || [];
setRecentOrders((data || []).slice(0, 5));


const today = new Date();

let todayTotal = 0;
let weekTotal = 0;
let monthTotal = 0;
let overallTotal = 0;

allOrders.forEach((order) => {
  const amount = Number(order.total) || 0;
  overallTotal += amount;

  const orderDate = new Date(order.created_at);

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
}


const totalCustomers = new Set(
  orders.map((order) => order.email)
).size;
async function deleteProduct(id: number) {
  const confirmed = confirm("Are you sure you want to delete this product?");

  if (!confirmed) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Failed to delete product.");
    return;
  }

  getProducts();

  alert("Product deleted successfully!");
}
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              OmaMart Admin
            </h1>

            <p className="text-gray-500">
              Manage your online store
            </p>
          </div>

          <Link
            href="/dashboard/add-product"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Add Product
          </Link>

        </div>
      </div>

      {/* Dashboard Cards */}

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Products</p>
          <h2 className="text-4xl font-bold mt-2">
  {products.length}
</h2>
        </div>

        <Link
  href="/dashboard/orders"
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-lg hover:-translate-y-1 transition duration-300"
>
  <p className="text-gray-500">Orders</p>

  <h2 className="text-4xl font-bold mt-2">
    {orders.length}
  </h2>

  <p className="text-sm text-orange-500 mt-4">
    View all orders →
  </p>
</Link>

       <Link
  href="/dashboard/customers"
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-lg hover:-translate-y-1 transition duration-300"
>
  <p className="text-gray-500">
    Customers
  </p>

  <h2 className="text-4xl font-bold mt-2">
    {totalCustomers}
  </h2>



  <p className="text-sm text-orange-500 mt-4">
    View customers →
  </p>
</Link>

        <Link
  href="/dashboard/analytics"
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-lg hover:-translate-y-1 transition"
>
  <p className="text-gray-500">Revenue</p>

  <h2 className="text-4xl font-bold mt-2 text-green-600">
    ₦{totalRevenue.toLocaleString()}
  </h2>

  <p className="text-sm text-orange-500 mt-4">
    View revenue details →
  </p>
</Link>

<Link
  href="/dashboard/low-stock"
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-lg transition"
>
  <p className="text-gray-500">Low Stock</p>

  <h2 className="text-4xl font-bold mt-2 text-red-600">
    {products.filter((product) => product.stock <= 10).length}
  </h2>

  <p className="text-sm text-orange-500 mt-4">
    View stock alerts →
  </p>
</Link>

<Link
  href="/dashboard/top-products"
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-lg transition"
>
  <p className="text-gray-500">Top Selling Products</p>

  <h2 className="text-2xl font-bold mt-2">
    🏆 View Rankings
  </h2>

  <p className="text-sm text-orange-500 mt-4">
    View top-selling products →
  </p>
</Link>

      </div>

      {/* Products Table */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <div className="bg-white rounded-2xl shadow">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Products
            </h2>
          </div>

          {products.length === 0 ? (
  <div className="p-12 text-center text-gray-400">
    No products added yet
  </div>
) : (
  <div className="divide-y">
    {products.map((product) => (
      <div
        key={product.id}
        className="flex items-center justify-between p-6"
      >
        <div className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div>
            <h3 className="font-bold text-lg">
              {product.name}
            </h3>

            <p className="text-gray-500">
              {product.category}
            </p>
          </div>
        </div>

       <div className="text-right">
  <p className="font-bold text-orange-500">
    ₦{Number(product.price).toLocaleString()}
  </p>

  <p className="text-gray-500">
    Stock: {product.stock}
  </p>

  <div className="flex justify-end gap-2 mt-3">
  <Link
  href={`/dashboard/edit-product/${product.id}`}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
>
  Edit
</Link>

   <button
  onClick={() => deleteProduct(product.id)}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Delete
</button>
  </div>
</div>
      </div>
    ))}
  </div>
)}

        </div>

      </div>
<div className="max-w-7xl mx-auto px-6 py-10">
  <h2 className="text-3xl font-bold mb-6">Recent Orders</h2>

  <div className="bg-white rounded-2xl shadow overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-4">Customer</th>
          <th className="text-left p-4">Amount</th>
          <th className="text-left p-4">Status</th>
        </tr>
      </thead>

      <tbody>
        {recentOrders.map((order) => (
          <tr key={order.id} className="border-t">
            <td className="p-4">{order.customer_name}</td>

            <td className="p-4 font-semibold text-green-600">
              ₦{order.total.toLocaleString()}
            </td>

            <td className="p-4">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {order.payment_status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </main>
  );
}