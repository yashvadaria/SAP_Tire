import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RevenueMissed } from "src/sections/overview/revenue-missed";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { WeeklyRevenue } from "src/sections/overview/weekly-revenue";
import { CustomersTurnedAway } from "src/sections/overview/customers-turned-away";
import { CustomersServed } from "src/sections/overview/customers-served";
import { RevenueGenerated } from "src/sections/overview/revenue-generated";
import { VehicleTypeDistribution } from "src/sections/overview/vehicle-type-distribution";
import MyCalendar from "./mycalendar";

const now = new Date();

const Page = () => <MyCalendar />;

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
