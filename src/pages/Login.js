import React from "react";

//React Router
import { useHistory } from "react-router-dom";

//Extras
import clsx from "clsx";

//Material UI
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

//Firebase
import firebase, { auth } from "../services/firebase";

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
      <div className="sized_box_3"></div>
      <Paper className={clsx(classes.paper, "sized_box_1")}>
        <Typography variant="h4" color="inherit">
          Welcome to <br />
          Umgosi Eswatini
        </Typography>
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
      </Paper>
    </Container>
  );
};

export default Login;
