import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RevenueMissed } from "src/sections/overview/revenue-missed";
import { Unstable_Grid2 as Grid } from "@mui/material";
import { WeeklyRevenue } from "src/sections/overview/weekly-revenue";
import { MaxPossibleRevenue } from "src/sections/overview/max-possible-revenue";
import { CustomersTurnedAway } from "src/sections/overview/customers-turned-away";
import { RevenueGenerated } from "src/sections/overview/revenue-generated";
import { VehicleTypeDistribution } from "src/sections/overview/vehicle-type-distribution";
import axios from "axios";
import React, { useEffect } from "react";
import { Chart } from "src/components/chart";
import { Card, CardContent, CardHeader } from "@mui/material";
import { RevenueTurnedAway } from "src/sections/overview/revenue-turned-away";
import { Typography, Stack } from "@mui/material";
function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast((item) => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}
const Page = () => {
  const [data, setData] = React.useState(null);
  const selectedAlgo = localStorage.getItem("selectedAlgo");
  let profitArray, lossArray;
  useEffect(() => {
    axios.get("http://localhost:8000" + "/algorithm/?type=type" + selectedAlgo).then((res) => {
      setData(res.data);
    });
  }, [selectedAlgo]);

  if (!data)
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h1> Loading...</h1>
        </div>
      </>
    );
  profitArray = data["weeks"]?.map((item) => item.profit);
  lossArray = data["weeks"]?.map((item) => item.loss);
  const lossArrayVehicle = data["vehicle_info"]?.map((item) => item[0]);
  const profitArrayVehicle = data["vehicle_info"]?.map((item) => item[1]);

  console.log("data", data);
  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: [
        "Class 1 Trucks",
        "Class 2 Trucks",
        "Compact Cars",
        "Full-size Cars",
        "Medium Cars",
      ],
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    {
      name: "Turned Away",
      data: lossArrayVehicle,
    },
    {
      name: "Serviced",
      data: profitArrayVehicle,
    },
  ];

  return (
    <>
      <Head>
        <title>Results</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Results</Typography>
          </Stack>
          <div style={{ height: 20 }}></div>

          <Grid spacing={3} xs={12} sm={6} lg={2}>
            <MaxPossibleRevenue
              val={data["profit"] + data["loss"]}
              sx={{ height: "100%" }}
              value={"$" + nFormatter(data["profit"] + data["loss"], 2)}
            />
          </Grid>
          <div style={{ height: 20 }}></div>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <RevenueGenerated
                val={data["profit"]}
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["profit"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <RevenueMissed
                val={data["loss"]}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["loss"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <RevenueTurnedAway
                val={data["total_turned_away_loss"]}
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["total_turned_away_loss"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CustomersTurnedAway
                val={data["count_turned_away"]}
                sx={{ height: "100%" }}
                value={nFormatter(data["count_turned_away"], 2)}
              />
            </Grid>

            <Grid xs={12} md={6} lg={8}>
              <Card>
                <CardHeader title="Vehicle Type Service Report" />
                <CardContent>
                  <Chart options={options} series={series} type="bar" width={"100%"} height={300} />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <VehicleTypeDistribution
                chartSeries={Object.values(data["counter"])}
                labels={[
                  "Class 1 Trucks",
                  "Class 2 Trucks",
                  "Compact Cars",
                  "Full-Size Cars",
                  "Medium Cars",
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} lg={12}>
              <WeeklyRevenue
                categories={Array.from(
                  { length: data["weeks"]?.length ?? 0 },
                  (_, i) => "Week" + (i + 1)
                )}
                chartSeries={[
                  {
                    name: "Revenue Generated",
                    data: profitArray,
                  },
                  {
                    name: "Revenue Missed",
                    data: lossArray,
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
