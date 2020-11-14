import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import StarterTabs from "./StarterTabs";
import { Button, Grid, Typography } from "@material-ui/core/";
import AppBar from "@material-ui/core/AppBar";
import { useHistory } from "react-router-dom"
import bg1 from "../resources/bg1.jpg"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    backgroundImage: `url(${bg1})`,
    backgroundSize: "cover",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    overflow: "auto",
  },
  overlay: {
    //display: "flex",
    //flexDirection: "column",
    //marginLeft: "-100px",
    marginRight: "150px",
    '& .OfflineButton': {
      marginTop: "20px",
      //marginLeft: "25%",
      //width: "40%",
    },
    '& .Description': {
      marginTop: "10px",
    }
  },
  tabs: {
    marginLeft: "100px",
  },
  footer: {
    backgroundColor: "rgb(34, 34, 34)",
    height: "10vh",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function WelcomePage() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div>
      <Grid container className={classes.root}>
      <Grid className={classes.overlay}>
        <Typography variant="h1">
          Welcome to Dpad!
        </Typography>
        <Typography className="Description" variant="body2">
          Dpad is a decentralized online collaborative editor <br></br> keeping your
          data private and safe!
        </Typography>
        <Button className="OfflineButton" variant="contained" onClick={() => history.push("/offline")}>
          Try Dpad in offline mode
        </Button>
      </Grid>
      <Grid className={classes.tabs}>
        <StarterTabs />
      </Grid>
    </Grid>
    <AppBar position="sticky" className={classes.footer}>
        <Typography variant="body1">
          &copy; Created by Group 8
        </Typography>
    </AppBar>
    </div>
  );
}
