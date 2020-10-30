import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, TextField, Theme } from '@material-ui/core';


const appBarStyles = (theme: Theme) => ({
  root: {
    color: theme.palette.common.white,
  },
});

function MyAppBar(props) {
  return <MuiAppBar position="static" {...props} />;
}

const CustomizedAppBar = withStyles(appBarStyles)(MyAppBar)

const styles = (theme) => ({
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function DpadAppBar(props) {
  const { classes } = props;
  return (
      <CustomizedAppBar position="static">
      <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Typography className={classes.title} >
            {'Dpad'}
          </Typography>
          <Typography className={classes.right} >
            {'Client ID'}
          </Typography>
        </Toolbar>
      </CustomizedAppBar>
  );
}

export default withStyles(styles)(DpadAppBar);