import React, { Fragment } from "react";

//Material UI
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const Comment = ({ comment }) => {
  return (
    <Fragment>
      <Grid item xs={2}>
        <Avatar>
          <img src={comment.photoURL} alt={comment.displayName} width="100%" />
        </Avatar>
      </Grid>
      <Grid item xs={10}>
        <Paper>
          <Typography variant="body2" color="inherit" className={"sized_box_1"}>
            {comment.message}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <div className="sized_box_half"></div>
      </Grid>
    </Fragment>
  );
};

export default Comment;
