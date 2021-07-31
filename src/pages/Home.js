import React, { useState, Fragment } from "react";

//Extras
import imageCompressor from "browser-image-compression";

//React Router
import { Redirect, useHistory } from "react-router-dom";

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
import { useSelector } from "react-redux";
import {
  useFirestoreConnect,
  isEmpty,
  useFirebase,
  useFirestore,
} from "react-redux-firebase";

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
  const firebase = useFirebase();
  const firestore = useFirestore();
  const history = useHistory();
  useFirestoreConnect([
    {
      collection: "posts",
      orderBy: ["postedAt", "desc"],
    },
  ]);
  const posts = useSelector((state) => state.firestore.ordered.posts);
  const auth = useSelector((state) => state.firebase.auth);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [dialogMessage, setDialogMessage] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

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

  const options = {
    useWebWorker: true,
  };

  const makeAPost = async () => {
    setLoading(true);
    const { uid, photoURL, displayName } = firebase.auth().currentUser;
    if (message) {
      if (image) {
        await imageCompressor(image, options)
          .then((compressedImage) => {
            firebase
              .storage()
              .ref(`posts/${compressedImage.name}`)
              .put(compressedImage)
              .then((_) => {
                firebase
                  .storage()
                  .ref("posts")
                  .child(compressedImage.name)
                  .getDownloadURL()
                  .then((url) => {
                    firestore
                      .collection("posts")
                      .add({
                        message: message,
                        uid: uid,
                        photoURL: photoURL,
                        displayName: displayName,
                        postedAt: firebase.firestore.Timestamp.fromDate(
                          new Date()
                        ),
                        likes: [],
                        image: url,
                      })
                      .then((_) => {
                        handleClose();
                        setLoading(false);
                        setMessage("");
                        setImage();
                      })
                      .catch((error) => {
                        setLoading(false);
                        setDialogMessage(error.message);
                        handleClickOpenAlert();
                      });
                  })
                  .catch((err) => {
                    setLoading(false);
                    setMessage(err.message);
                    handleClickOpen();
                  });
              })
              .catch((err) => {
                setLoading(false);
                setMessage(err.message);
                handleClickOpen();
              });
          })
          .catch((err) => {
            setLoading(false);
            setMessage(err.message);
            handleClickOpen();
          });
      } else {
        await firestore
          .collection("posts")
          .add({
            message: message,
            uid: uid,
            photoURL: photoURL,
            displayName: displayName,
            postedAt: firebase.firestore.Timestamp.fromDate(new Date()),
            likes: [],
            image: "",
          })
          .then((_) => {
            handleClose();
            setLoading(false);
            setMessage("");
          })
          .catch((error) => {
            setLoading(false);
            setMessage(error.message);
            handleClickOpen();
          });
      }
    } else {
      setLoading(false);
      handleClose();
      setDialogMessage("Please enter post message first");
      handleClickOpenAlert();
    }
  };
  const signOut = async () => {
    await firebase
      .auth()
      .signOut()
      .then((_) => {
        history.push("/login");
      })
      .catch((error) => {
        setDialogMessage(error.message);
        handleClickOpenAlert();
      });
  };
  if (isEmpty(auth)) {
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
          {image ? (
            <Fragment>
              <Button
                variant="text"
                color="secondary"
                onClick={() => setImage()}
              >
                Remove Image
              </Button>
              <img src={URL.createObjectURL(image)} alt="Post" width="100%" />
            </Fragment>
          ) : (
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              component="label"
            >
              Add Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={makeAPost} color="primary" variant="contained">
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
      <Dialog open={loading}>
        <DialogTitle id="alert-dialog-title">Umgosi Eswatini</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please wait...
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Home;
