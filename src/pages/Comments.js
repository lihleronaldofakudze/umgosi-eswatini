import React, { useState } from "react";

//React Router
import { useParams } from "react-router-dom";

//Extras
import clsx from "clsx";

//Material UI
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";

//Material Icon
import SendRounded from "@material-ui/icons/SendRounded";

//Components
import Comment from "../components/Comment";

//Firebase
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase, { auth, firestore } from "../services/firebase.js";

//Comments Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  footer: {
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
  },
  message: {
    display: "flex",
  },
  text_field: {},
  send_button: {
    background: "#DD5145",
    color: "#FFFFFF",
  },
  post: {
    textAlign: "center",
    fontWeight: "bold",
  },
}));

const Comments = () => {
  const classes = useStyles();
  const { id } = useParams();
  const commentsRef = firestore
    .collection("posts")
    .doc(id)
    .collection("comments");
  const query = commentsRef.orderBy("postedAt").limit(24);
  const [comments] = useCollectionData(query, { idField: "id" });
  const [message, setMessage] = useState();

  const sendMessage = async () => {
    const { uid, photoURL, displayName } = auth.currentUser;

    await commentsRef
      .add({
        message: message,
        uid: uid,
        photoURL: photoURL,
        displayName: displayName,
        postedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((_) => {
        setMessage("");
      });
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit">
        <Toolbar className={clsx("sized_box_1", classes.post)}>
          <Typography variant="h5">
            <strong>
              Ullamco commodo nulla occaecat nostrud non consequat.
            </strong>
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Toolbar />
      <Container maxWidth="sm">
        <Grid container>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </Grid>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm" className={classes.message_form}>
          <Grid container alignsItems="center" className={"sized_box_1"}>
            <Grid xs={10}>
              <TextField
                label="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fulWidth
                className={classes.text_field}
                variant="outlined"
              />
            </Grid>
            <Grid xs={2}>
              <IconButton className={classes.send_button} onClick={sendMessage}>
                <SendRounded />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </div>
  );
};

export default Comments;
