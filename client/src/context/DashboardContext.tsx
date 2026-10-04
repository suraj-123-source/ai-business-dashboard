import { createContext, useContext, useState } from "react";
import type { DashboardData } from "../types/dashboard";

interface DashboardContextType {
  data: DashboardData | null;
  setData: React.Dispatch<
    React.SetStateAction<DashboardData | null>
  >;
}

const DashboardContext =
  createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] =
    useState<DashboardData | null>(null);

  return (
    <DashboardContext.Provider
      value={{ data, setData }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context)
    throw new Error("Dashboard Context Missing");

  return context;
} 