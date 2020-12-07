import React, { useState } from "react";
import {
  EditorOptions,
  supportedLanguages,
  fontWeightOpts,
  fontFamilyOpts,
} from "./EditorOptions";
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
  makeStyles,
  IconButton,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import SaveOutlined from "@material-ui/icons/SaveOutlined";
import NoteAddOutlined from "@material-ui/icons/NoteAddOutlined";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.primary.light,
    justifyContent: "space-between",
  },
  loadButton: {
    marginRight: "20px",
  },
  select: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    textTransform: "capitalize",
  },
  menuItem: {
    textTransform: "capitalize",
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
  setSave: () => void;
  setLoad: () => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setEditorOptions: (opts: EditorOptions) => void;
}

export default function EditorToolBar({
  language,
  theme,
  editorOptions,
  setSave,
  setLoad,
  setLanguage,
  setTheme,
  setEditorOptions,
}: EditorToolBarProps) {
  const classes = useStyles();
  const myTheme = useTheme();
  const setFontSize = (size: number) =>
    setEditorOptions({ ...editorOptions, fontSize: size });
  const [bgColor, setBgColor] = useState(myTheme.palette.primary.light);
  const [fontColor, setFontColor] = useState("#2a2a2a");

  const handleFontSizeInputChange = (event) => {
    if (
      event.target.value >= 4 &&
      event.target.value <= 40 &&
      Number(event.target.value) % 2 === 0
    ) {
      setFontSize(Number(event.target.value));
    }
  };

  const handleBlur = () => {
    if (editorOptions.fontSize < 4) {
      setFontSize(4);
    } else if (editorOptions.fontSize > 40) {
      setFontSize(40);
    } else if (Number(editorOptions.fontSize) % 2 === 1) {
      setFontSize(Number(editorOptions.fontSize) - 1);
    }
  };

  const handleDarkmode = () => {
    theme === "vs-dark"
      ? setBgColor(myTheme.palette.primary.light)
      : setBgColor(myTheme.palette.primary.dark);
    theme === "vs-dark" ? setFontColor("#2a2a2a") : setFontColor("#dadada");
  };

  return (
    <Toolbar className={classes.root} style={{ backgroundColor: bgColor }}>
      <FormGroup row>
        <IconButton aria-label="save" onClick={setSave}>
          <SaveOutlined />
        </IconButton>
        <IconButton
          aria-label="load"
          className={classes.loadButton}
          onClick={setLoad}
        >
          <NoteAddOutlined />
        </IconButton>
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
                <MenuItem
                  value={language}
                  key={"item-" + language}
                  className={classes.menuItem}
                >
                  {language}
                </MenuItem>
              ))}
            </Select>
          }
          label={<span style={{ color: fontColor }}>Language</span>}
          labelPlacement="start"
        />
        <FormControlLabel
          className={classes.formControl}
          control={
            <Select
              labelId="fontweight-select-label"
              id="fontweight-select"
              value={editorOptions.fontWeight}
              onChange={(e) => {
                setEditorOptions({
                  ...editorOptions,
                  fontWeight: e.target.value as string,
                })
                console.log(e.target.value)
              }
              }
              className={classes.select}
            >
              {fontWeightOpts.map((weight) => (
                <MenuItem
                  value={weight}
                  key={"item-" + weight}
                  className={classes.menuItem}
                >
                  {weight}
                </MenuItem>
              ))}
            </Select>
          }
          label={<span style={{ color: fontColor }}>Font weight</span>}
          labelPlacement="start"
        />
        <FormControlLabel
          className={classes.formControl}
          control={
            <Select
              labelId="fontfamily-select-label"
              id="fontfamily-select"
              value={editorOptions.fontFamily}
              onChange={(e) =>
                setEditorOptions({
                  ...editorOptions,
                  fontFamily: e.target.value as string,
                })
              }
              className={classes.select}
            >
              {fontFamilyOpts.map((font) => (
                <MenuItem
                  value={font}
                  key={"item-" + font}
                  className={classes.menuItem}
                >
                  {font}
                </MenuItem>
              ))}
            </Select>
          }
          label={<span style={{ color: fontColor }}>Font family</span>}
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
          label={
            <span style={{ color: fontColor, whiteSpace: "nowrap" }}>
              Font size
            </span>
          }
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch
              checked={theme === "vs-dark"}
              onChange={() => {
                theme === "vs-dark" ? setTheme("vs") : setTheme("vs-dark");
                handleDarkmode();
              }}
            />
          }
          label={
            <span style={{ color: fontColor, whiteSpace: "nowrap" }}>
              Dark mode
            </span>
          }
          labelPlacement="start"
        />
        <FormControlLabel
          control={
            <Switch
              checked={editorOptions.lineNumbers === "on"}
              onChange={() => {
                setEditorOptions({
                  ...editorOptions,
                  lineNumbers:
                    editorOptions.lineNumbers === "on" ? "off" : "on",
                });
              }}
            />
          }
          label={
            <span style={{ color: fontColor, whiteSpace: "nowrap" }}>
              Line number
            </span>
          }
          labelPlacement="start"
        />
      </FormGroup>
    </Toolbar>
  );
}
