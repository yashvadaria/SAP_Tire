import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const RevenueTurnedAway = (props) => {
  const { difference, val, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Revenue Turned Away
            </Typography>
            <Typography variant="h4">{value}</Typography>
            <Typography color="text.secondary" variant="overline">
              $ {val}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "#FF0011",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

RevenueTurnedAway.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
