import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, TextField, Theme, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const appBarStyles = (theme: Theme) => ({
  root: {
    color: theme.palette.common.white,
  },
});

function MyAppBar(props) {
  return <MuiAppBar position="static" {...props} />;
}

const CustomizedAppBar = withStyles(appBarStyles)(MyAppBar)

const useStyles = makeStyles((theme) => ({
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
}));

interface DpadAppBarProps {
  status: string
}

export default function DpadAppBar({ status }: DpadAppBarProps) {
  const classes = useStyles()
  return (
      <CustomizedAppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Typography className={classes.title} >
            {'Dpad'}
        </Typography>
        
        <Typography className={classes.right} >
          {status === "connected" ? <CheckCircleOutlineRoundedIcon style={{ color: green[500] }} /> : <HighlightOffIcon color="secondary" />}
          {status}
          </Typography>
        </Toolbar>
      </CustomizedAppBar>
  );
}
