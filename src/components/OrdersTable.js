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
  Select,
  Label,
} from "@windmill/react-ui";

const OrdersTable = ({ resultsPerPage }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filter, setFilter] = useState('all');

  // Pagination change control
  const onPageChange = (p) => {
    setPage(p);
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:3000/order/get-all-order`,
        { page, resultsPerPage }, // Remove filter from API request
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const result = response.data;
      setData(result.data);
      setTotalResults(result.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Filter orders based on the selected filter
  const filterOrders = (orders) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.time);
      if (filter === 'day') {
        return now - orderDate < 24 * 60 * 60 * 1000; // Last 24 hours
      } else if (filter === 'week') {
        return now - orderDate < 7 * 24 * 60 * 60 * 1000; // Last 7 days
      } else if (filter === 'month') {
        return now - orderDate < 30 * 24 * 60 * 60 * 1000; // Last 30 days
      } else {
        return true; // All
      }
    });
  };

  // Fetch orders on page load, page change, and filter change
  useEffect(() => {
    fetchOrders();
  }, [page, resultsPerPage]);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Label>
          <span>Filter by</span>
          <Select className="mt-1" value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </Select>
        </Label>
      </div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader className="text-2xl font-bold">
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filterOrders(data).map((order) => (
              <React.Fragment key={order.order_id}>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" // Replace with actual avatar field if available
                        alt="User image"
                      />
                      <div>
                        <p className="font-semibold text-2xl">{order.user_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl">£ {order.total_cost}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      type={
                        order.status === "Un-paid"
                          ? "danger"
                          : order.status === "Paid"
                          ? "success"
                          : order.status === "Completed"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl">
                      {new Date(order.time).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Table>
                      <TableHeader className="text-xl font-bold">
                        <tr>
                          <TableCell>Product</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Total</TableCell>
                        </tr>
                      </TableHeader>
                      <TableBody>
                        {order.cart_details && order.cart_details.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center text-xl">
                                <Avatar
                                  className="hidden mr-3 md:block"
                                  src={item.img}
                                  alt={item.name}
                                />
                                <div>
                                  <p className="font-semibold">{item.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-xl">{item.unit}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xl">£ {item.price}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xl">{item.quantity}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xl">£ {item.total}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
