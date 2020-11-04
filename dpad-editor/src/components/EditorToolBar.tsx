import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Slider,
  Select,
  MenuItem,
  Theme,
  Input,
  Typography,
} from "@material-ui/core";

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.primary.light,
    justifyContent: 'space-between',
  },
  select: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  slider: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  input: {
    marginRight: theme.spacing(4),
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

function EditorToolBar(props) {
  const { classes } = props;
  const [language, setLanguage] = React.useState('Python');
  const [fontSize, setFontSize] = React.useState<number | string | Array<number | string>>(20);
  const [switchState, setSwitchState] = React.useState(false);

  const handleLangChange = (event) => {
    setLanguage(event.target.value);
    props.onToolBarChange(event.target.value, fontSize, switchState);
  };

  const handleSliderChange = (event, newSize) => {
    setFontSize(newSize);
    props.onToolBarChange(language, newSize, switchState);
  };
  
  const handleInputChange = (event) => {
    setFontSize(event.target.value === '' ? '' : Number(event.target.value));
    if (event.target.value >= 4 && event.target.value <= 40 && Number(event.target.value) % 2 == 0) {
      props.onToolBarChange(language, event.target.value, switchState);
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchState(!switchState);
    props.onToolBarChange(language, fontSize, !switchState);
  };

  const handleBlur = () => {
    if (fontSize < 4) {
      setFontSize(4);
    } else if (fontSize > 40) {
      setFontSize(40);
    } else if (Number(fontSize) % 2 == 1) {
      setFontSize(Number(fontSize)-1);
    }
  };

  return (
    <Toolbar className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          className={classes.formControl}
          control={       
            <Select
              labelId="language-select-label"
              id="language-select"
              value={language}
              onChange={handleLangChange}
              className={classes.select}
            >
              <MenuItem value={"Python"}>Python</MenuItem>
              <MenuItem value={"JavaScript"}>JavaScript</MenuItem>
              <MenuItem value={"Java"}>Java</MenuItem>
            </Select>}
          label="Language"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Grid container alignItems="flex-start">
              <Grid item>
                <Slider
                  className={classes.slider}
                  value={typeof fontSize === 'number' ? fontSize : 4}
                  onChange={handleSliderChange}
                  step={2}
                  min={4}
                  max={40}
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={fontSize}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 2,
                    min: 4,
                    max: 40,
                    type: 'number',
                  }}
                />
              </Grid>
            </Grid>
          }
          label={<Typography noWrap>Font size</Typography>}
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch 
              checked={switchState}
              onChange={handleSwitchChange}
            />
          }
          className={classes.switch}
          label={<Typography noWrap>Dark mode</Typography>}
          labelPlacement="start"
        />
      </FormGroup>
    </Toolbar>
  );
}

export default withStyles(styles)(EditorToolBar);
