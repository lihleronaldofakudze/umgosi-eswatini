import React, { Fragment } from "react";

//Material UI
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const Comments = () => {
  return (
    <Fragment>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography variant="h3">Umgosi Eswatini</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container spacing={1}>
        <Avatar>R</Avatar>
        <Paper>
          <Typography variant="h5" color="inherit">
            Enim duis nulla culpa dolor magna voluptate aliqua cupidatat enim
            elit voluptate est laboris.
          </Typography>
        </Paper>
      </Grid>
    </Fragment>
  );
};

export default Comments;
