import React, { Fragment } from "react";

//Material UI
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => {
  return {
    name: {
      textAlign: "left",
    },
  };
});

const Donator = ({ donator }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Grid item xs={9}>
        <Typography variant="h6" color="initial" className={classes.name}>
          <strong>{donator.name}</strong>
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="h6" color="initial">
          E{donator.amount}
        </Typography>
      </Grid>
    </Fragment>
  );
};

export default Donator;
