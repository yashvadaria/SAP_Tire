import PropTypes from "prop-types";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const MaxPossibleRevenue = (props) => {
  const { value, val, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-center" direction="row" justifyContent="center" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Max Possible Revenue
            </Typography>
            <Typography variant="h3">{value}</Typography>
            <Typography color="text.secondary" gutterBottom variant="overline">
              $ {val}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

MaxPossibleRevenue.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
