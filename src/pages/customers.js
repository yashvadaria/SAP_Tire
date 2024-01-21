import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RevenueMissed } from "src/sections/overview/revenue-missed";
import { Unstable_Grid2 as Grid } from "@mui/material";
import { WeeklyRevenue } from "src/sections/overview/weekly-revenue";
import { CustomersTurnedAway } from "src/sections/overview/customers-turned-away";
import { CustomersServed } from "src/sections/overview/customers-served";
import { RevenueGenerated } from "src/sections/overview/revenue-generated";
import { VehicleTypeDistribution } from "src/sections/overview/vehicle-type-distribution";
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
              <RevenueGenerated
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["profit"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <RevenueMissed
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={"$" + nFormatter(data["loss"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CustomersServed
                sx={{ height: "100%" }}
                value={nFormatter(data["total_customers_served"], 2)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CustomersTurnedAway
                sx={{ height: "100%" }}
                value={nFormatter(data["total_requests"] - data["total_customers_served"])}
              />
            </Grid>

            <Grid xs={12} lg={8}>
              <WeeklyRevenue
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
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
