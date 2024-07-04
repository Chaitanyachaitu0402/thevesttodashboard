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
  Pagination,
} from "@windmill/react-ui";

const UsersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Pagination change control
  const onPageChange = (p) => {
    setPage(p);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:3000/user/get-all-user`,
        { page, resultsPerPage, filter }, // Add any necessary data here
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
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on page load and page change
  useEffect(() => {
    fetchUsers();
  }, [page, resultsPerPage, filter]);

  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Address</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" // Replace with actual avatar field if available
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">{user.user_name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.mobile_number}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.Address}</span>
                </TableCell>
              </TableRow>
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

export default UsersTable;
