import React, { useState, useRef } from "react";

//React Router
import { useParams, Redirect } from "react-router-dom";

//Extras
import clsx from "clsx";

//Material UI
import DialogContentText from "@material-ui/core/DialogContentText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";

//Material Icon
import SendRounded from "@material-ui/icons/SendRounded";

//Components
import Comment from "../components/Comment";
import OtherComment from "../components/OtherComment";

//Firebase
import { useSelector } from "react-redux";
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
  isEmpty,
} from "react-redux-firebase";

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
  const [dialogMessage, setDialogMessage] = useState();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { post, id } = useParams();
  const firebase = useFirebase();
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "posts",
      doc: id,
      subcollections: [{ collection: "comments" }],
      storeAs: "comments",
      orderBy: "postedAt",
      limit: 24,
    },
  ]);
  const comments = useSelector((state) => state.firestore.ordered.comments);
  const auth = useSelector((state) => state.firebase.auth);
  const { uid, photoURL, displayName } = firebase.auth().currentUser;

  const dummy = useRef();

  //Open Alert Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Close Alert Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const sendMessage = async () => {
    if (message) {
      await firestore
        .collection("posts")
        .doc(id)
        .collection("comments")
        .add({
          message: message,
          uid: uid,
          photoURL: photoURL,
          displayName: displayName,
          postedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then((_) => {
          setMessage("");
          dummy.current.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
          setDialogMessage(error.message);
          handleClickOpen();
        });
    } else {
      setDialogMessage("Please enter message first");
      handleClickOpen();
    }
  };

  if (isEmpty(auth)) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit">
        <Toolbar className={clsx("sized_box_1", classes.post)}>
          <Typography variant="h5">
            <strong>{post}</strong>
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Toolbar />
      <Container maxWidth="sm">
        <Grid container alignItems="center" spacing={1}>
          {comments &&
            comments.map((comment) => {
              return uid === comment.uid ? (
                <OtherComment key={comment.id} comment={comment} />
              ) : (
                <Comment key={comment.id} comment={comment} />
              );
            })}
        </Grid>
      </Container>
      <div ref={dummy}></div>
      <footer className={classes.footer}>
        <Container maxWidth="sm" className={classes.message_form}>
          <Grid
            container
            alignItems="center"
            spacing={1}
            className={"sized_box_1"}
          >
            <Grid item xs={10}>
              <TextField
                label="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                className={classes.text_field}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton className={classes.send_button} onClick={sendMessage}>
                <SendRounded />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </footer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Umgosi Eswatini</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Comments;
