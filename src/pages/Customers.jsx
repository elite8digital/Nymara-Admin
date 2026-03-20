// import { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function Customers() {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   // Fetch all customers on mount
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/api/admin/customers`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//       .then((res) => setCustomers(res.data.customers || []))
//       .catch((err) => console.error("Fetch Customers Error:", err));
//   }, []);

//   // Fetch details for a single customer
//   const fetchCustomerDetails = async (userId) => {
//     setLoadingDetails(true);
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/admin/customers/${userId}/orders`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // ✅ Combine customer info + orders
//       const customer = customers.find((c) => c._id === userId);
//       setSelectedCustomer({
//         ...customer,
//         orders: res.data.orders || [],
//       });
//     } catch (err) {
//       console.error("Fetch Customer Details Error:", err);
//       alert("Failed to fetch customer details");
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-6 text-yellow-700">
//         👥 Customers
//       </h2>

//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-yellow-100">
//             <tr>
//               <th className="p-3 border-b">Customer ID</th>
//               <th className="p-3 border-b">Name</th>
//               <th className="p-3 border-b">Orders</th>
//               <th className="p-3 border-b">Email</th>
//               <th className="p-3 border-b">City / State</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((c) => (
//               <tr
//                 key={c._id}
//                 className="border-b hover:bg-yellow-50 cursor-pointer transition"
//                 onClick={() => fetchCustomerDetails(c._id)}
//               >
//                 <td className="p-3 font-mono">{c.customerId}</td>
//                 <td className="p-3">{c.name}</td>
//                 <td className="p-3 font-semibold">{c.orderCount}</td>
//                 <td className="p-3">{c.email}</td>
//                 <td className="p-3">
//                   {c.address?.city}, {c.address?.state}
//                 </td>
//               </tr>
//             ))}

//             {customers.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="p-4 text-center text-gray-500">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for selected customer */}
//       {selectedCustomer && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={(e) =>
//             e.target === e.currentTarget && setSelectedCustomer(null)
//           }
//         >
//           <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
//             <h3 className="text-xl font-semibold mb-4 text-yellow-700">
//               Customer Details
//             </h3>
//             {loadingDetails ? (
//               <p>Loading...</p>
//             ) : (
//               <div className="space-y-2">
//                 <p>
//                   <strong>Name:</strong> {selectedCustomer.name}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {selectedCustomer.email}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong>{" "}
//                   {selectedCustomer.phoneNumber || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Orders:</strong>
//                 </p>
//                 <ul className="list-disc list-inside ml-4 space-y-1">
//                   {selectedCustomer.orders?.length > 0 ? (
//                     selectedCustomer.orders.map((o) => (
//                       <li key={o.orderId}>
//                         Order #{o.orderId} – Total: ₹{o.totalAmount} – Status:{" "}
//                         {o.status} – Payment: {o.paymentStatus}
//                       </li>
//                     ))
//                   ) : (
//                     <li>No orders found for this customer.</li>
//                   )}
//                 </ul>
//               </div>
//             )}
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setSelectedCustomer(null)}
//                 className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCustomers(res.data.customers || []))
      .catch((err) => console.error("Fetch Customers Error:", err));
  }, []);

  const fetchCustomerDetails = async (customer) => {
    setLoadingDetails(true);
    setSelectedCustomer({ ...customer, orders: [] });
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/customers/${customer._id}/orders`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSelectedCustomer({ ...customer, orders: res.data.orders || [] });
    } catch (err) {
      console.error("Fetch Customer Details Error:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-yellow-700">
        👥 Customers
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-yellow-100">
            <tr>
              <th className="p-3 border-b">Customer ID</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">City / State</th>
              <th className="p-3 border-b">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-yellow-50 cursor-pointer transition"
                  onClick={() => fetchCustomerDetails(c)}
                >
                  <td className="p-3 font-mono">{c.customerId}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phoneNumber || "—"}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">
                    {c.city && c.state ? `${c.city}, ${c.state}` : "—"}
                  </td>
                  <td className="p-3 font-semibold">{c.orderCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-yellow-700">
              Customer Details
            </h3>

            <div className="space-y-1 mb-4">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phoneNumber || "N/A"}</p>
              <p><strong>Location:</strong> {selectedCustomer.city && selectedCustomer.state
                ? `${selectedCustomer.city}, ${selectedCustomer.state}`
                : "N/A"}
              </p>
            </div>

            <h4 className="font-semibold mb-2">Orders</h4>
            {loadingDetails ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : selectedCustomer.orders?.length > 0 ? (
              <table className="w-full text-sm border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b text-left">Order ID</th>
                    <th className="p-2 border-b text-left">Date</th>
                    <th className="p-2 border-b text-left">Items</th>
                    <th className="p-2 border-b text-left">Amount</th>
                    <th className="p-2 border-b text-left">Status</th>
                    <th className="p-2 border-b text-left">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.orders.map((o) => (
                    <tr key={o.orderId} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{o.orderId}</td>
                      <td className="p-2">{new Date(o.orderDate).toLocaleDateString()}</td>
                      <td className="p-2">{o.itemCount}</td>
                      <td className="p-2">{o.currency}{o.totalAmount}</td>
                      <td className={`p-2 font-semibold capitalize ${
                        o.status === "delivered" ? "text-green-600"
                        : o.status === "pending" ? "text-yellow-600"
                        : o.status === "cancelled" ? "text-red-600"
                        : "text-blue-600"
                      }`}>{o.status}</td>
                      <td className={`p-2 ${o.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                        {o.paymentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No orders found for this customer.</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//     </div>
//   );
// }
