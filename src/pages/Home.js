import React, { useState, Fragment } from "react";

//React Router
import { Redirect } from "react-router-dom";

//Material UI
import DialogContentText from "@material-ui/core/DialogContentText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";

//Material Icons
import AddIcon from "@material-ui/icons/Add";

//Component
import Post from "../components/Post";

//Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase, { auth, firestore } from "../services/firebase.js";

//Home Styles
const useStyles = makeStyles((theme) => {
  return {
    logo: {
      flex: 1,
    },
    fab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  };
});

const Home = () => {
  const classes = useStyles();
  const [user] = useAuthState(auth);
  const postsRef = firestore.collection("posts");
  const query = postsRef.orderBy("postedAt", "desc").limit(24);
  const [posts] = useCollectionData(query, { idField: "id" });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [dialogMessage, setDialogMessage] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  //Close Alert Dialog
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const makeAPost = async () => {
    if (message) {
      const { uid, photoURL, displayName } = auth.currentUser;

      await postsRef
        .add({
          message: message,
          uid: uid,
          photoURL: photoURL,
          displayName: displayName,
          postedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          likes: [],
        })
        .then((_) => {
          handleClose();
        })
        .catch((error) => {
          setDialogMessage(error.message);
          handleClickOpenAlert();
        });
    } else {
      handleClose();
      setDialogMessage("Please enter post message first");
      handleClickOpenAlert();
    }
  };
  const signOut = async () => {
    await auth
      .signOut()
      .then((_) => {
        window.location.reload();
      })
      .catch((error) => {
        setDialogMessage(error.message);
        handleClickOpenAlert();
      });
  };
  if (user === null) {
    return <Redirect to="/login" />;
  }
  return (
    <Fragment>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.logo}>
            Umgosi Eswatini
          </Typography>
          <Button variant="text" color="default" onClick={signOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div className="sized_box_1"></div>
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          {posts && posts.map((post) => <Post key={post.id} post={post} />)}
        </Grid>
      </Container>
      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fab}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open}>
        <DialogTitle id="form-dialog-title">Post Umgosi</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="What's On Your Mind"
            type="email"
            fullWidth
            multiline
            rows={4}
            maxRows={4}
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={makeAPost} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAlert} onClose={handleCloseAlert}>
        <DialogTitle id="alert-dialog-title">Umgosi Eswatini</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Home;
