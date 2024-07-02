"use client";

import { useEffect, useRef, useState } from "react";
import isAuth from "../../../components/isAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GetReq } from "../api/api";
import { StatusSuccessCodes } from "../api/successStatus";
import { Card, Col, Row, Select, message } from "antd";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Dashboard() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const [loadStatistics, setLoadStatistics] = useState<boolean>(false);
  const [statisticsData, setStatisticsData] = useState<any[]>([]);
  const [statisticsPendingData, setStatisticsPendingData] = useState<any>();
  const [statisticsConfirmedData, setStatisticsConfirmedData] = useState<any>();
  const [statisticsCompletedData, setStatisticsCompletedData] = useState<any>();
  const [statisticsCancelledData, setStatisticsCancelledData] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [reservationsCount, setReservationsCount] = useState({
    labels: [],
    total_amount: [],
  });
  const [reservationsTotals, setReservationsTotals] = useState({
    labels: [],
    totals: [],
  });
  const isEffectRefreshRef = useRef(false);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total Reservations Count",
      },
    },
  };
  useEffect(() => {
    if (!isEffectRefreshRef.current) {
      getStatistics();
      getStatisticsStatus("WAITING_FOR_PAYMENT");
      isEffectRefreshRef.current = true;
    }
  }, []);

  function getStatistics() {
    let url = `filter-reservations/?limit=999999&make=3`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadStatistics(true);
    GetReq(url).then((res) => {
      setLoadStatistics(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setStatisticsData(res.data);
        // getStatisticscompleted();
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }
  function getStatisticsStatus(status: string) {
    let url = `filter-reservations/?limit=999999&status=${status}`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadStatistics(true);
    GetReq(url).then((res) => {
      setLoadStatistics(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setStatisticsCompletedData(res.data);
        mapReports(res.data);
        mapReports2(res.data);
        // getStatisticspending();
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }
  function getStatisticspending(page: number = 1, pageSize: number = 10) {
    let url = `filter-reservations/?limit=999999&status=WAITING_FOR_PAYMENT`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadStatistics(true);
    GetReq(url).then((res) => {
      setLoadStatistics(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setStatisticsPendingData(res.data);
        getStatisticsconfirmed();
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }
  function getStatisticsconfirmed(page: number = 1, pageSize: number = 10) {
    let url = `filter-reservations/?limit=999999&status=CONFIRMED`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadStatistics(true);
    GetReq(url).then((res) => {
      setLoadStatistics(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setStatisticsConfirmedData(res.data);
        getStatisticsCancelled();
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }
  function getStatisticsCancelled(page: number = 1, pageSize: number = 10) {
    let url = `filter-reservations/?limit=999999&status=CANCELLED`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    setLoadStatistics(true);
    GetReq(url).then((res) => {
      setLoadStatistics(false);
      if (StatusSuccessCodes.includes(res.status)) {
        setStatisticsCancelledData(res.data);
        console.log(statisticsPendingData);
      } else {
        res?.errors.forEach((err: any) => {
          messageApi.error(
            `${err.attr ? err.attr + ":" + err.detail : err.detail} `
          );
        });
      }
    });
  }

  const data = {
    labels: reservationsCount.labels,
    datasets: [
      {
        label: "",
        data: reservationsCount.total_amount,
        backgroundColor: [
          "#1BD7B7",
          "#FF5D6B",
          "#E9ECF1",
          "#ffd966",
          "#6fa8dc",
          "#c27ba0",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: reservationsTotals.labels,
    datasets: [
      {
        label: "Total Reservations Revenue",
        data: reservationsTotals.totals,
        backgroundColor: ["#1BD7B7", "#FF5D6B", "#E9ECF1"],
        borderColor: ["#1BD7B7", "#FF5D6B", "#E9ECF1"],
        borderWidth: 1,
      },
    ],
  };
  function mapReports2(statistics: any) {
    // if (statistics != null) {
    let labels: any = [
      "Total Car Reservations Revenue",
      "Total Hotel Reservations Revenue",
    ];

    let totals: any = [
      statistics?.total_final_price_car,
      statistics?.total_final_price_hotel,
    ];

    setReservationsTotals({ labels: labels, totals: totals });
    // } else {
    //   setSubscriptionUsers({ labels: [], total_amount: [] });
    // }
  }
  function mapReports(statistics: any) {
    // if (statistics != null) {
    let labels: any = ["Total Car Reservations", "Total Hotel Reservations"];

    let totals: any = [
      statistics?.total_car_reservations,
      statistics?.total_hotel_reservations,
    ];

    setReservationsCount({ labels: labels, total_amount: totals });
    // } else {
    //   setSubscriptionUsers({ labels: [], total_amount: [] });
    // }
  }
  const style: React.CSSProperties = {
    padding: "8px 0",
  };

  return (
    <div>
      {contextHolder}
      <Card className="p-5 border rounded-lg">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={16} lg={16} xl={16}>
            <Select
              // className="w-full"
              defaultValue={"WAITING_FOR_PAYMENT"}
              onSelect={(value) => getStatisticsStatus(value)}
            >
              <Select.Option
                key="WAITING_FOR_PAYMENT"
                value={"WAITING_FOR_PAYMENT"}
              >
                Waiting For Payment
              </Select.Option>
              <Select.Option key="CONFIRMED" value={"CONFIRMED"}>
                Confirmed
              </Select.Option>
              <Select.Option key="COMPLETED" value={"COMPLETED"}>
                Completed
              </Select.Option>
              <Select.Option key="CANCELLED" value={"CANCELLED"}>
                Cancelled
              </Select.Option>
            </Select>
            <Bar options={options} data={data} />
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8} xl={8}>
            <Doughnut data={doughnutData} options={{ cutout: "80%" }} />{" "}
          </Col>
        </Row>
      </Card>
      <Card className="p-5 border rounded-lg">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={16} lg={16} xl={16}>
            <Select
              // className="w-full"
              defaultValue={"WAITING_FOR_PAYMENT"}
              onSelect={(value) => getStatisticsStatus(value)}
            >
              <Select.Option
                key="WAITING_FOR_PAYMENT"
                value={"WAITING_FOR_PAYMENT"}
              >
                Waiting For Payment
              </Select.Option>
              <Select.Option key="CONFIRMED" value={"CONFIRMED"}>
                Confirmed
              </Select.Option>
              <Select.Option key="COMPLETED" value={"COMPLETED"}>
                Completed
              </Select.Option>
              <Select.Option key="CANCELLED" value={"CANCELLED"}>
                Cancelled
              </Select.Option>
            </Select>
            <Bar options={options} data={data} />
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8} xl={8}>
            <Doughnut data={doughnutData} options={{ cutout: "80%" }} />{" "}
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default isAuth(Dashboard);
