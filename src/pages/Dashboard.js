import React, { useState, useEffect } from "react";
import axios from "axios";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import OrdersTable from "../components/OrdersTable";

function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchTotalCustomers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);
      const userId = localStorage.getItem('user_id');
      console.log(userId);
      try {
        const response = await axios.post(`https://thevesttobackend.vercel.app/web/user/count-user`, { user_id: userId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        console.log("count ====> ", response)
        setTotalCustomers(response.data.data); // Update to handle the response structure
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    const fetchTotalOrders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('user_id');
      try {
        const response = await axios.post(`https://thevesttobackend.vercel.app/web/order/count-all-orders`, { user_id: userId },
           {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            
          },
        });
        console.log(response)
        setTotalOrders(response.data.data); // Update to handle the response structure
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    fetchTotalCustomers();
    fetchTotalOrders();
  }, []);

  return (
    <>
      <PageTitle>Admin Dashboard</PageTitle>

      {/* <CTA /> */}

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total customers" value={totalCustomers}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        {/* <InfoCard title="Total income" value="$ 6,760.89">
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard> */}

        <InfoCard title="Orders" value={totalOrders}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        {/* <InfoCard title="Unread Chats" value="15">
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard> */}
      </div>

      {/* <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="User Analytics">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Revenue">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
      </div> */}

      <PageTitle>Orders</PageTitle>
      <OrdersTable resultsPerPage={10} />
    </>
  );
}

export default Dashboard;
