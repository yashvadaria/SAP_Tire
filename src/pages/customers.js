import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { Unstable_Grid2 as Grid } from "@mui/material";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import axios from "axios";
import React, { useEffect } from "react";

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
  let profitArray, lossArray;
  useEffect(() => {
    axios.get("http://localhost:8000" + "/algorithm/?type=type2").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <></>;
  profitArray = data["weeks"]?.map((item) => item.profit);
  lossArray = data["weeks"]?.map((item) => item.loss);

  console.log("data", data);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["profit"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["loss"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                sx={{ height: "100%" }}
                value={nFormatter(data["total_customers_served"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress
                sx={{ height: "100%" }}
                value={nFormatter(data["total_requests"] - data["total_customers_served"])}
              />
            </Grid>

            <Grid xs={12} lg={8}>
              <OverviewSales
                categories={Array.from(
                  { length: data["weeks"]?.length ?? 0 },
                  (_, i) => "Week" + (i + 1)
                )}
                chartSeries={[
                  {
                    name: "Revenue",
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
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[44, 55, 13, 43, 22]}
                labels={[
                  "Compact Cars",
                  "Medium Cars",
                  "Full-Size Cars",
                  "Class 1 Trucks",
                  "Class 2 Trucks",
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
