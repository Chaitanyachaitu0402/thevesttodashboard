// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TableBody,
//   TableContainer,
//   Table,
//   TableHeader,
//   TableCell,
//   TableRow,
//   TableFooter,
//   Avatar,
//   Badge,
//   Pagination,
//   Button,
//   Input,
// } from "@windmill/react-ui";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import Products from "../assets/img/products.png";

// const OrdersTable = ({ resultsPerPage }) => {
//   const [page, setPage] = useState(1);
//   const [data, setData] = useState([]);
//   const [totalResults, setTotalResults] = useState(0);
//   const [filterDate, setFilterDate] = useState("");

//   const onPageChange = (p) => {
//     setPage(p);
//   };

//   const fetchOrders = async () => {
//     const accessToken = localStorage.getItem("accessToken");

//     try {
//       const response = await axios.post(
//         `http://localhost:3001/web/order/get-all-order`,
//         { page, resultsPerPage },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const result = response.data;
//       setData(result.data);
//       setTotalResults(result.total);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   const handleFilterChange = (event) => {
//     setFilterDate(event.target.value);
//   };

//   const filteredData = filterDate
//     ? data.filter(order => new Date(order.time).toLocaleDateString() === new Date(filterDate).toLocaleDateString())
//     : data;

//   const generatePDFReport = () => {
//     const doc = new jsPDF();
//     doc.text("TheVestto", 14, 20);
//     doc.text(`Downloaded on: ${new Date().toLocaleDateString()}`, 14, 30);
//     const productSales = calculateProductSales(filteredData);
//     autoTable(doc, {
//       startY: 40,
//       head: [["Product", "Quantity Sold"]],
//       body: Object.keys(productSales).map((key) => [key, productSales[key]]),
//     });
//     doc.save("product-sales-report.pdf");
//   };

//   const generateExcelReport = () => {
//     const productSales = calculateProductSales(filteredData);
//     const ws = XLSX.utils.json_to_sheet(
//       Object.keys(productSales).map((key) => ({
//         Product: key,
//         "Quantity Sold": productSales[key],
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Product Sales");
//     XLSX.utils.sheet_add_aoa(ws, [["DesiSmart"]], { origin: "A1" });
//     XLSX.utils.sheet_add_aoa(
//       ws,
//       [["Downloaded on:", new Date().toLocaleDateString()]],
//       { origin: "A2" }
//     );
//     XLSX.writeFile(wb, "product-sales-report.xlsx");
//   };

//   const calculateProductSales = (orders) => {
//     const sales = {};
//     orders.forEach((order) => {
//       const cartDetails = JSON.parse(order.cart_details);
//       cartDetails.forEach((item) => {
//         if (!sales[item.name]) {
//           sales[item.name] = 0;
//         }
//         sales[item.name] += item.quantity;
//       });
//     });
//     return sales;
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, resultsPerPage]);

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button className="mr-2 bg-yellow-300 p-2 text-white font-bold" onClick={generatePDFReport}>
//           Download PDF Report
//         </button>
//         <button onClick={generateExcelReport} className="bg-yellow-300 p-2 text-white font-bold">Download Excel Report</button>
//       </div>
//       <div className="flex mb-4">
//         <Input
//           type="date"
//           value={filterDate}
//           onChange={handleFilterChange}
//           placeholder="Filter by Order Date"
//           className="mr-2 fill-white"
//         />
//       </div>
//       <TableContainer className="mb-8">
//         <Table>
//           <TableHeader className="text-2xl font-bold">
//             <tr className="text-black dark:text-white">
//               <TableCell>Customer</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Ordered Date</TableCell>
//             </tr>
//           </TableHeader>
//           <TableBody>
//             {filteredData.map((order) => (
//               <React.Fragment key={order.order_id}>
//                 <TableRow>
//                   <TableCell>
//                     <div className="flex items-center text-sm">
//                       <Avatar
//                         className="hidden mr-3 md:block"
//                         src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg"
//                         alt="User image"
//                       />
//                       <div>
//                         <p className="font-semibold text-2xl text-black dark:text-white">{order.user_name}</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-2xl text-black dark:text-white">£ {order.total_cost}</span>
//                   </TableCell>
//                   <TableCell>
//                     <Badge type={
//                       order.status === "Un-paid" ? "danger" :
//                       order.status === "Paid" ? "success" :
//                       order.status === "Completed" ? "warning" : "neutral"
//                     }>
//                       {order.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-2xl text-black dark:text-white">{new Date(order.time).toLocaleDateString()}</span>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell colSpan={5}>
//                     <Table>
//                       <TableHeader className="text-xl font-bold">
//                         <tr className="text-black dark:text-white">
//                           <TableCell>Product</TableCell>
//                           <TableCell>Price</TableCell>
//                           <TableCell>Quantity</TableCell>
//                           <TableCell>Total</TableCell>
//                         </tr>
//                       </TableHeader>
//                       <TableBody>
//                         {JSON.parse(order.cart_details).map((item) => (
//                           <TableRow key={item.id}>
//                             <TableCell>
//                               <div className="flex items-center text-xl">
//                                 <Avatar
//                                   className="hidden mr-3 md:block"
//                                   src={Products}
//                                   alt={item.name}
//                                 />
//                                 <div>
//                                   <p className="font-semibold text-black dark:text-white">{item.name}</p>
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <span className="text-xl text-black dark:text-white">£ {item.price}</span>
//                             </TableCell>
//                             <TableCell>
//                               <span className="text-xl text-black dark:text-white">{item.quantity}</span>
//                             </TableCell>
//                             <TableCell>
//                               <span className="text-xl text-black dark:text-white">£ {item.total}</span>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableCell>
//                 </TableRow>
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//         <TableFooter>
//           <Pagination
//             totalResults={totalResults}
//             resultsPerPage={resultsPerPage}
//             label="Table navigation"
//             onChange={onPageChange}
//           />
//         </TableFooter>
//       </TableContainer>
//     </div>
//   );
// };

// export default OrdersTable;
















import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
  Input,
} from "@windmill/react-ui";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Products from "../assets/img/products.png";


const OrdersTable = ({ resultsPerPage }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filterDate, setFilterDate] = useState("");
  const [visibleScreenshot, setVisibleScreenshot] = useState(null); // for showing screenshot
  const [timer, setTimer] = useState(60);

  const onPageChange = (p) => {
    setPage(p);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          window.location.reload(); // Refresh the page
        }
        return prev - 1;
      });
    }, 1000); // Decrease every second

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const accessToken = localStorage.getItem("accessToken");

    // Get orderIds from localStorage and parse them
    const storedOrderIds = JSON.parse(localStorage.getItem("orderIds") || "[]");

    // Check if the orderId exists in the stored list before updating
    if (!storedOrderIds.includes(orderId)) {
      console.warn(`Order ID ${orderId} not found in localStorage. Skipping update.`);
      return;
    }

    try {
      await axios.post(
        "https://thevesttobackend.vercel.app/web/order/update-status-by-order_id",
        { order_id: orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update local state after successful API call
      setData((prevData) =>
        prevData.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };



  const fetchOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `https://thevesttobackend.vercel.app/web/order/get-all-order`,
        { page, resultsPerPage },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = response.data;
      setData(result.data);
      setTotalResults(result.total);

      // ✅ Store order_id(s) in localStorage
      if (Array.isArray(result.data)) {
        const orderIds = result.data.map((order) => order.order_id);
        localStorage.setItem("orderIds", JSON.stringify(orderIds));
      }

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterDate(event.target.value);
  };


  const filteredData = filterDate
    ? data.filter(order => new Date(order.time).toLocaleDateString() === new Date(filterDate).toLocaleDateString())
    : data;

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("TheVestto", 14, 20);
    doc.text(`Downloaded on: ${new Date().toLocaleDateString()}`, 14, 30);
    const productSales = calculateProductSales(filteredData);
    autoTable(doc, {
      startY: 40,
      head: [["Product", "Quantity Sold"]],
      body: Object.keys(productSales).map((key) => [key, productSales[key]]),
    });
    doc.save("product-sales-report.pdf");
  };

  const generateExcelReport = () => {
    const productSales = calculateProductSales(filteredData);
    const ws = XLSX.utils.json_to_sheet(
      Object.keys(productSales).map((key) => ({
        Product: key,
        "Quantity Sold": productSales[key],
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product Sales");
    XLSX.utils.sheet_add_aoa(ws, [["DesiSmart"]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(
      ws,
      [["Downloaded on:", new Date().toLocaleDateString()]],
      { origin: "A2" }
    );
    XLSX.writeFile(wb, "product-sales-report.xlsx");
  };

  const calculateProductSales = (orders) => {
    const sales = {};
    orders.forEach((order) => {
      const cartDetails = JSON.parse(order.cart_details);
      cartDetails.forEach((item) => {
        if (!sales[item.name]) {
          sales[item.name] = 0;
        }
        sales[item.name] += item.quantity;
      });
    });
    return sales;
  };

  const getFirstValue = (value) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed[0];
      }
      return value;
    } catch (err) {
      return value;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, resultsPerPage]);

  return (
    <div>
      {/* <div className="flex mb-4">
        <Input
          type="date"
          value={filterDate}
          onChange={handleFilterChange}
          placeholder="Filter by Order Date"
          className="mr-2 fill-white"
        />
      </div> */}

      <div className="text-center text-lg font-bold text-red-500 mb-4">
        Page refreshes to get LIVE orders in: {timer} seconds
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader className="text-2xl font-bold">
            <tr className="text-black dark:text-white">
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ordered Date</TableCell>
              <TableCell>Status Update</TableCell>
              <TableCell>Screenshot</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData.map((order) => (
              <React.Fragment key={order.order_id}>
                <TableRow>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-semibold text-2xl text-black dark:text-white">{order.first_name} {order.second_name}</p>
                      <p>{order.address}, {order.town_city}</p>
                      <p>{order.postcode}</p>
                      <p>{order.phone_number}</p>
                      <p>{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl text-black dark:text-white">₹ {order.total_amount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type={
                      order.status === "Un-paid" ? "danger" :
                        order.status === "Paid" ? "success" :
                          order.status === "Completed" ? "warning" : "neutral"
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl text-black dark:text-white">{(order.ordered_date)}</span>
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      className="border rounded p-1 bg-white dark:bg-gray-800 text-black dark:text-white"
                    >
                      <option value="Successfull">Ordered</option>
                      <option value="Pending Order">Pending Payment</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </TableCell>

                  <TableCell>
                    {order.screenshot && (
                      <>
                        <Button
                          onClick={() =>
                            setVisibleScreenshot({
                              orderId: order.order_id,
                              screenshot: order.screenshot,
                            })
                          }
                          size="small"
                        >
                          Show Screenshot
                        </Button>
                        {visibleScreenshot && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                            onClick={() => setVisibleScreenshot(null)}
                          >
                            <div
                              className="relative max-w-full max-h-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img
                                src={`https://thevesttobackend.vercel.app/storege/userdp/${visibleScreenshot.screenshot}`}
                                alt="Screenshot"
                                className="w-64 rounded-lg"
                              />
                              <button
                                onClick={() => setVisibleScreenshot(null)}
                                className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="mb-2">
                      <p><strong>Product:</strong> {getFirstValue(order.products)}</p>
                      <p><strong>Quantity:</strong> {getFirstValue(order.quantity)}</p>
                      <p><strong>Size:</strong> {getFirstValue(order.size)}</p>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
