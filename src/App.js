import React from "react";

//React Router
import { BrowserRouter, Switch, Route } from "react-router-dom";

//Material UI
import { ThemeProvider, createTheme } from "@material-ui/core";

//Pages
import Comments from "./pages/Comments";
import Login from "./pages/Login";
import Home from "./pages/Home";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/comments/:post/:id">
            <Comments />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
