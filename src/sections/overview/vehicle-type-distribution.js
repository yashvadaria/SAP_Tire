import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";

export const VehicleTypeDistribution = (props) => {
  const { chartSeries, labels, sx } = props;
  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Compact Cars", "Medium Cars", "Full-Size Cars", "Class 1 Trucks", "Class 2 Trucks"],
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Vehicle Serviced" />
      <CardContent>
        <div className="donut">
          <Chart options={options} series={chartSeries} type="pie" width={400} />
        </div>
      </CardContent>
    </Card>
  );
};

VehicleTypeDistribution.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
