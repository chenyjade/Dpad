import React, { useState, useEffect } from "react";
import { EditorOptions, supportedLanguages } from "./EditorOptions";
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
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.primary.light,
    justifyContent: "space-between",
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
}));

interface EditorToolBarProps {
  language: string;
  theme: string;
  editorOptions: EditorOptions;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setEditorOptions: (opts: EditorOptions) => void;
}

export default function EditorToolBar({
  language,
  theme,
  editorOptions,
  setLanguage,
  setTheme,
  setEditorOptions,
}: EditorToolBarProps) {
  const classes = useStyles();
  const setFontSize = (size: number) =>
    setEditorOptions({ ...editorOptions, fontSize: size });

  const handleFontSizeInputChange = (event) => {
    if (
      event.target.value >= 4 &&
      event.target.value <= 40 &&
      Number(event.target.value) % 2 == 0
    ) {
      setFontSize(Number(event.target.value));
    }
  };

  const handleBlur = () => {
    if (editorOptions.fontSize < 4) {
      setFontSize(4);
    } else if (editorOptions.fontSize > 40) {
      setFontSize(40);
    } else if (Number(editorOptions.fontSize) % 2 == 1) {
      setFontSize(Number(editorOptions.fontSize) - 1);
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
              onChange={(e) => setLanguage(e.target.value as string)}
              className={classes.select}
            >
              {supportedLanguages.map((language) => (
                <MenuItem value={language} key={"item-" + language}>{language}</MenuItem>
              ))}
            </Select>
          }
          label="Language"
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Grid container alignItems="flex-start">
              <Grid item>
                <Slider
                  className={classes.slider}
                  value={editorOptions.fontSize}
                  onChange={(e, val) => setFontSize(val as number)}
                  step={2}
                  min={4}
                  max={40}
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={editorOptions.fontSize}
                  margin="dense"
                  onChange={handleFontSizeInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 2,
                    min: 4,
                    max: 40,
                    type: "number",
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
              checked={theme === "vs-dark"}
              onChange={() => {
                theme === "vs-dark" ? setTheme("vs") : setTheme("vs-dark");
              }}
            />
          }
          label={<Typography noWrap>Dark mode</Typography>}
          labelPlacement="start"
        />
      </FormGroup>
    </Toolbar>
  );
}
