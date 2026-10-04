interface Product {
  Product: string;
  Revenue: number;
  Orders: number;
}

interface Props {
  data?: Product[];
  search?: string;
}

export default function TopProductsTable({
     data = [],
     search = "",
     }: Props) {
    
    const filteredData = data.filter((product) =>
    product.Product.toLowerCase().includes(search.toLowerCase())
    );    
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Top Products
      </h2>

      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3">Product</th>
            <th className="text-left py-3">Revenue</th>
            <th className="text-left py-3">Orders</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((product, index) => (
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="py-3">{product.Product}</td>

                <td>₹{product.Revenue.toLocaleString()}</td>

                <td>{product.Orders}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center text-slate-400">
                Upload a dataset to view products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}