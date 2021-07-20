import React, { useState } from "react";

//React Router
import { useHistory, Redirect } from "react-router-dom";

//Extras
import clsx from "clsx";

//Material UI
import DialogContentText from "@material-ui/core/DialogContentText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

//Component
import Donator from "../components/Donator";

//Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import firebase, { auth } from "../services/firebase";

//Images
import Umgosee from "../images/umgosee.png";

//Data
import donators from "../services/donators_data";

//Login Styles
const useStyles = makeStyles((theme) => {
  return {
    paper: {
      paper: "100%",
      textAlign: "center",
    },
    button_google: {
      backgroundColor: "#DD5145",
      color: "#FFFFFF",
    },
    button_facebook: {
      backgroundColor: "#0B8BEE",
      color: "#FFFFFF",
    },
  };
});

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);

  //Open Alert Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Close Alert Dialog
  const handleClose = () => {
    setOpen(false);
  };

  //Google Sign In
  const signInWithGoogle = async () => {
    await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth
          .signInWithPopup(provider)
          .then((_) => {
            history.push("/");
          })
          .catch((error) => {
            setMessage(error.message);
            handleClickOpen();
          });
      })
      .catch((error) => {
        setMessage(error.message);
        handleClickOpen();
      });
  };

  //Facebook Sign In
  const signInWithFacebook = async () => {
    await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        await auth
          .signInWithPopup(provider)
          .then((_) => {
            history.push("/");
          })
          .catch((error) => {
            setMessage(error.message);
            handleClickOpen();
          });
      })
      .catch((error) => {
        setMessage(error.message);
        handleClickOpen();
      });
  };

  //Open Reasons of Donating Dialog
  const whyDonate = () => {
    setMessage(
      "The growth is you what you give. To promote and grow this platform. Donate to 76960405 on Mobile Money"
    );
    handleClickOpen();
  };

  if (user !== null) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <div className="sized_box_1"></div>
      <Paper className={clsx(classes.paper, "sized_box_1")}>
        <img src={Umgosee} alt="Umgosi Eswatini" width="50%" />
        <Typography variant="h6" color="inherit">
          Made for emaSwatini to never miss a word with latest news/talks and
          updates with Umgosi.
        </Typography>
        <div className="sized_box_1"></div>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<i className="bi bi-google"></i>}
          fullWidth
          className={classes.button_google}
          onClick={signInWithGoogle}
        >
          Sign In With Google
        </Button>
        <div className="sized_box_half"></div>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<i className="bi bi-facebook"></i>}
          fullWidth
          className={classes.button_facebook}
          onClick={signInWithFacebook}
        >
          Sign In With Facebook
        </Button>
        <div className="sized_box_1"></div>
        <Typography variant="h6" color="inherit">
          Donators
        </Typography>
        <Grid container alignItems="center" justifyContent="space-between">
          {donators.map((donator, index) => (
            <Donator key={index} donator={donator} />
          ))}
        </Grid>
        <div className="sized_box_1"></div>
        <Button variant="contained" color="secondary" onClick={whyDonate}>
          Why Donate?
        </Button>
      </Paper>
      <div className="sized_box_1"></div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Umgosi Eswatini</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
