interface Customer {
  Customer: string;
  Revenue: number;
  Orders: number;
}

interface Props {
  data?: Customer[];
}

export default function TopCustomersTable({ data = [] }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Top Customers
      </h2>

      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3">Customer</th>
            <th className="text-left py-3">Revenue</th>
            <th className="text-left py-3">Orders</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((customer, index) => (
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="py-3">{customer.Customer}</td>

                <td>₹{customer.Revenue.toLocaleString()}</td>

                <td>{customer.Orders}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="text-center py-6 text-slate-400"
              >
                Upload a dataset to view customers
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}