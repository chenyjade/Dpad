import React, { Fragment, useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";
import EditorToolBar from "./components/EditorToolBar"
import MonacoEditor from "./components/MonacoEditor";
import DpadAppBar from "./components/AppBar";
import StarterDialog from "./components/StarterDialog"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DpadAppBar />
      <StarterDialog />
      <EditorToolBar />
      <MonacoEditor />
    </ThemeProvider>
  );
}

export default App;
