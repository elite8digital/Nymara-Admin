

// import { useEffect, useState } from "react";
// import axios from "axios";
// import AdminOrderModal from "../components/AdminOrderModal.jsx";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   // Fetch all orders summary
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/admin/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setOrders(res.data?.orders || []);
//       } catch (err) {
//         console.error("❌ Error fetching orders:", err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Fetch full order details when a row is clicked
//   const handleRowClick = async (orderId) => {
//     try {
//       setDetailLoading(true);
//       const res = await axios.get(`${API_URL}/api/admin/${orderId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setSelectedOrder(res.data?.order || null);
//     } catch (err) {
//       console.error("❌ Error fetching order details:", err.response?.data || err.message);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // Sync status update back into the list
//   const handleStatusUpdated = (orderId, newStatus) => {
//     setOrders((prev) =>
//       prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
//     );
//     setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Orders</h2>

//       {loading ? (
//         <p className="text-gray-500">Loading orders...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-gray-500">No orders found.</p>
//       ) : (
//         <>
//           <table className="w-full border border-gray-200 shadow-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2">Order ID</th>
//                 <th className="p-2">Customer</th>
//                 <th className="p-2">Amount</th>
//                 <th className="p-2">Status</th>
//                 <th className="p-2">City / State</th>
//                 <th className="p-2">Date</th>
//                 <th className="p-2">Items</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr
//                   key={order.orderId}
//                   className="border-t hover:bg-gray-50 cursor-pointer"
//                   onClick={() => handleRowClick(order.orderId)}
//                 >
//                   <td className="p-2">{order.orderId}</td>
//                   <td className="p-2">{order.customer?.name}</td>
//                   <td className="p-2 font-medium">{order.currency}{order.amount}</td>
//                   <td
//                     className={`p-2 font-semibold capitalize ${
//                       order.status === "delivered"
//                         ? "text-green-600"
//                         : order.status === "pending"
//                         ? "text-yellow-600"
//                         : order.status === "cancelled"
//                         ? "text-red-600"
//                         : "text-blue-600"
//                     }`}
//                   >
//                     {order.status}
//                   </td>
//                   <td className="p-2">
//                     {order.city}, {order.state}
//                   </td>
//                   <td className="p-2">
//                     {new Date(order.date).toLocaleDateString()}
//                   </td>
//                   <td className="p-2">{order.items} items</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Loading overlay while fetching order detail */}
//           {detailLoading && (
//             <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
//               <p className="bg-white px-6 py-3 rounded shadow text-gray-700">
//                 Loading order details...
//               </p>
//             </div>
//           )}

//           <AdminOrderModal
//             open={!!selectedOrder}
//             onClose={() => setSelectedOrder(null)}
//             order={selectedOrder}
//             token={localStorage.getItem("token")}
//             onStatusUpdated={handleStatusUpdated}
//           />
//         </>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import AdminOrderModal from "../components/AdminOrderModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  //  Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //  Filters state
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  //  Fetch orders with pagination + filters
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
            limit: 10,
            status: filters.status,
            search: filters.search,
          },
        });

        setOrders(res.data?.orders || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error(
          "❌ Error fetching orders:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, filters]);

  //  Fetch full order details
  const handleRowClick = async (orderId) => {
    try {
      setDetailLoading(true);

      const res = await axios.get(`${API_URL}/api/admin/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSelectedOrder(res.data?.order || null);
    } catch (err) {
      console.error(
        "❌ Error fetching order details:",
        err.response?.data || err.message
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ Sync status update
  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      )
    );

    setSelectedOrder((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {/*  Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, order ID..."
          className="border px-3 py-2 rounded w-64"
          value={filters.search}
          onChange={(e) => {
            setPage(1);
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
            }));
          }}
        />

        {/* Status Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={filters.status}
          onChange={(e) => {
            setPage(1);
            setFilters((prev) => ({
              ...prev,
              status: e.target.value,
            }));
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setFilters({ status: "", search: "" });
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/*  Table */}
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          <table className="w-full border border-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">City / State</th>
                <th className="p-2">Date</th>
                <th className="p-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order.orderId)}
                >
                  <td className="p-2">{order.orderId}</td>
                  <td className="p-2">{order.customer?.name}</td>
                  <td className="p-2 font-medium">
                    {order.currency}
                    {order.amount}
                  </td>
                  <td
                    className={`p-2 font-semibold capitalize ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "pending"
                        ? "text-yellow-600"
                        : order.status === "cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="p-2">
                    {order.city}, {order.state}
                  </td>
                  <td className="p-2">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{order.items} items</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/*  Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page <strong>{page}</strong> of{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/*  Loading overlay */}
          {detailLoading && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
              <p className="bg-white px-6 py-3 rounded shadow text-gray-700">
                Loading order details...
              </p>
            </div>
          )}

          {/*  Modal */}
          <AdminOrderModal
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
            token={localStorage.getItem("token")}
            onStatusUpdated={handleStatusUpdated}
          />
        </>
      )}
    </div>
  );
}
