import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import StarterTabs from "./StarterTabs";
import { Button, Grid, Typography } from "@material-ui/core/";
import { useHistory } from "react-router-dom"
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  container: {
    alignItems: "center",
    paddingTop: "20px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
  },
}));

export default function WelcomePage() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={6}>
          <Typography variant="h1">Welcome to Dpad!</Typography>
          <Typography>
            Dpad is a decentralized online collaborative editor that keeps your
            data private and safe!
          </Typography>
          <Button variant="contained" onClick={() => history.push("/offline")}>Try Dpad in offline mode</Button>
        </Grid>
        <Grid item xs={6}>
          <StarterTabs />
        </Grid>
      </Grid>
    </div>
  );
}
