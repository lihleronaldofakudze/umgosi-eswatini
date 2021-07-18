import React, { useState, Fragment } from "react";

//React Router
import { Redirect } from "react-router-dom";

//Material UI
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
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";

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
  const query = postsRef.orderBy("postedAt").limit(24);
  const [posts] = useCollectionData(query, { idField: "id" });
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const makeAPost = async () => {
    const { uid, photoURL, displayName } = auth.currentUser;

    await postsRef
      .add({
        message: message,
        uid: uid,
        photoURL: photoURL,
        displayName: displayName,
        postedAt: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
      })
      .then((_) => {
        handleClose();
      });
  };
  const signOut = async () => {
    await auth.signOut().then((_) => {
      window.location.reload();
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
          {posts &&
            posts.map((post) => (
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        <img
                          src={post.photoURL}
                          alt={post.displayName}
                          width="100%"
                        />
                      </Avatar>
                    }
                    title={post.displayName}
                    subheader={post.postedAt}
                  />
                  <CardActionArea>
                    {/* <CardMedia
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          /> */}
                    <CardContent>
                      <Typography
                        variant="h5"
                        color="textSecondary"
                        component="p"
                      >
                        {post.message}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Like
                    </Button>
                    <Button size="small" color="primary">
                      Comment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Make A Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="What's On Your Mind"
            type="email"
            fullWidth
            multiline
            rows={4}
            maxRows={4}
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
    </Fragment>
  );
};

export default Home;
