import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
  Select,
  MenuItem,
  Theme,
} from "@material-ui/core";

const styles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  slider: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
  select: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    justifyContent: 'space-between',
  },
});

function EditorToolBar(props) {
  const { classes } = props;
  return (
    <Toolbar className={classes.root}>
      <FormGroup row>
      <FormControlLabel
        className={classes.formControl}
        control={       
        <Select
          labelId="language-select-label"
          id="language-select"
          value={"Python"}
          className={classes.select}
        >
          <MenuItem value={"Python"}>Python</MenuItem>
          <MenuItem value={"JavaScript"}>JavaScript</MenuItem>
          <MenuItem value={"Java"}>Java</MenuItem>
        </Select>}
        label="Language"
        />
        <FormControlLabel
          control={<Slider className={classes.slider} />}
          label="Font size"
        />
        <FormControlLabel
          control={<Switch checked={true} />}
          label="Dark mode"
        />
      </FormGroup>
    </Toolbar>
  );
}

export default withStyles(styles)(EditorToolBar);
