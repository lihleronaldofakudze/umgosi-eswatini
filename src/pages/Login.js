import React from "react";

//React Router
import { useHistory } from "react-router-dom";

//Extras
import clsx from "clsx";

//Material UI
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

//Component
import Donator from "../components/Donator";

//Firebase
import firebase, { auth } from "../services/firebase";

//Images
import Umgosee from "../images/umgosee.png";

//Data
import donators from "../services/donators_data";

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
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider).then((_) => {
      history.push("/");
    });
  };
  return (
    <Container maxWidth="sm">
      <div className="sized_box_1"></div>
      <Paper className={clsx(classes.paper, "sized_box_1")}>
        <img src={Umgosee} alt="Umgosi Eswatini" width="50%" />
        <Typography variant="body1" color="inherit">
          Welcome to Umgosi Eswatini
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
        <Button variant="contained" color="secondary">
          Why Donate?
        </Button>
      </Paper>
      <div className="sized_box_1"></div>
    </Container>
  );
};

export default Login;
