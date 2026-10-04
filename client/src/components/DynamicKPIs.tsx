// interface DynamicKPIsProps {
//   kpis: any[];
// }

// export default function DynamicKPIs({ kpis }: DynamicKPIsProps) {
//   if (!kpis || kpis.length === 0) {
//     return (
//       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
//         <p className="text-slate-400">
//           No numeric metrics detected in this dataset.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

//       {kpis.slice(0, 8).map((item: any, index: number) => (

//         <div
//           key={`${item.name}-${index}`}
//           className="bg-slate-900 border border-slate-800 rounded-xl p-6"
//         >

//           <p className="text-slate-400 text-sm">
//             {item.name}
//           </p>

//           <h2 className="text-2xl font-bold text-white mt-2">
//             {typeof item.value === "number"
//               ? item.value.toLocaleString(undefined, {
//                   maximumFractionDigits: 2,
//                 })
//               : item.value}
//           </h2>

//         </div>

//       ))}

//     </div>
//   );
// }


import { useSettings } from "../context/SettingsContext";

interface DynamicKPIsProps {
  kpis: any[];
}

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  AED: "د.إ",
  SAR: "﷼",
};

const currencyNames: Record<string, string> = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  CNY: "CNY",
  AUD: "AUD",
  CAD: "CAD",
  SGD: "SGD",
  AED: "AED",
  SAR: "SAR",
};

function isFinancialMetric(name: string) {
  const financialWords = [
    "revenue",
    "sales",
    "sale",
    "amount",
    "price",
    "profit",
    "income",
    "cost",
    "expense",
    "value",
    "turnover",
    "earning",
    "earnings",
    "resale",
    "margin",
  ];

  const lowerName = name.toLowerCase();

  return financialWords.some((word) =>
    lowerName.includes(word)
  );
}

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

export default function DynamicKPIs({
  kpis,
}: DynamicKPIsProps) {
  const { settings } = useSettings();

  if (!kpis || kpis.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400">
          No numeric metrics detected in this dataset.
        </p>
      </div>
    );
  }

  const selectedCurrency = settings.currency || "INR";

  const currencySymbol =
    currencySymbols[selectedCurrency] || selectedCurrency;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {kpis.slice(0, 8).map((item: any, index: number) => {
        const name = String(item.name ?? "Metric");
        const value = item.value;

        const financial = isFinancialMetric(name);

        return (
          <div
            key={`${name}-${index}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <p className="text-slate-400 text-sm">
              {name}
            </p>

            <h2 className="text-2xl font-bold text-white mt-2">
              {typeof value === "number" ? (
                <>
                  {financial && (
                    <span className="mr-1">
                      {currencySymbol}
                    </span>
                  )}

                  {formatNumber(value)}
                </>
              ) : (
                value ?? "-"
              )}
            </h2>

            {financial && (
              <p className="text-xs text-slate-500 mt-2">
                Currency:{" "}
                {currencyNames[selectedCurrency] ||
                  selectedCurrency}
              </p>
            )}
          </div>
        );
      })}

    </div>
  );
}