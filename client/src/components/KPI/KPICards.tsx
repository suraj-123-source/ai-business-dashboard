
// ================ Next Start From Here ====================

import {
  IndianRupee,
  Wallet,
  ShoppingCart,
  Users,
} from "lucide-react";

import KPICard from "./KPICard";

interface KPIData {
  revenue: number;
  profit: number;
  orders: number;
  customers: number;
  averageOrder: number;
}

interface KPICardsProps {
  data?: KPIData;
}

export default function KPICards({ data }: KPICardsProps) {
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <KPICard
      title="Revenue"
      value={`₹${(data?.revenue ?? 0).toLocaleString()}`}
      color="text-green-400"
      icon={<IndianRupee size={30} />}
      trend="+12.4%"
    />

    <KPICard
      title="Profit"
      value={`₹${(data?.profit ?? 0).toLocaleString()}`}
      color="text-blue-400"
      icon={<Wallet size={30} />}
      trend="+8.1%"
    />

    <KPICard
      title="Orders"
      value={`${data?.orders ?? 0}`}
      color="text-purple-400"
      icon={<ShoppingCart size={30} />}
      trend="+15.2%"
    />

    <KPICard
      title="Customers"
      value={`${data?.customers ?? 0}`}
      color="text-pink-400"
      icon={<Users size={30} />}
      trend="+5.7%"
    />

  </div>
)};
