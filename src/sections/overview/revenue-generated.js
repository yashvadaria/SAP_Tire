import PropTypes from "prop-types";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const RevenueGenerated = (props) => {
  const { value, sx, val } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Revenue Generated
            </Typography>

            <Typography variant="h4">{value}</Typography>
            <Typography color="text.secondary" variant="overline">
              $ {val}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
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

RevenueGenerated.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
