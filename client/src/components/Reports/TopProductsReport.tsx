interface Product {
  Product: string;
  Revenue: number;
  Orders: number;
}

interface Props {
  data?: Product[];
}

export default function TopProductsReport({
  data = [],
}: Props) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        🏆 Top Products
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 border">Rank</th>
            <th className="p-3 border">Product</th>
            <th className="p-3 border">Revenue</th>
            <th className="p-3 border">Orders</th>
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
                {item.Product}
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