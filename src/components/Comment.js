import React, { Fragment } from "react";

//Material UI
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const Comment = ({ comment }) => {
  return (
    <Fragment className={"sized_box_1"}>
      <Grid item xs={2}>
        <Avatar>{comment.photoURL}</Avatar>
      </Grid>
      <Grid item xs={10}>
        <Paper>
          <Typography variant="h5" color="inherit">
            {comment.message}
          </Typography>
        </Paper>
      </Grid>
    </Fragment>
  );
};

export default Comment;
