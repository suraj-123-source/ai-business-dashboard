interface Customer {
  Customer: string;
  Revenue: number;
  Orders: number;
}

interface Props {
  data?: Customer[];
}

export default function TopCustomersReport({
  data = [],
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">
        👥 Top Customers
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="border p-3">Rank</th>
            <th className="border p-3">Customer</th>
            <th className="border p-3">Revenue</th>
            <th className="border p-3">Orders</th>
          </tr>
        </thead>

        <tbody>
          {data.slice(0, 5).map((item, index) => (
            <tr
              key={index}
              className="text-center even:bg-gray-100"
            >
              <td className="border p-2">
                {index + 1}
              </td>

              <td className="border p-2">
                {item.Customer}
              </td>

              <td className="border p-2">
                ₹{item.Revenue.toLocaleString()}
              </td>

              <td className="border p-2">
                {item.Orders}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}