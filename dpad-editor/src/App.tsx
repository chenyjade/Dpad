import React, { Fragment, useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";
import EditorToolBar from "./components/EditorToolBar"
import MonacoEditor from "./components/MonacoEditor";
import DpadAppBar from "./components/AppBar";
import StarterDialog from "./components/StarterDialog"

function App() {
  const [language, setLang] = useState("Python");
  const [fontSize, setFontSize] = useState(20);
  const [darkMode, setDarkMode] = useState(false);
 
  const onToolBarChange = (lang, size, dark) => {
    setLang(lang);
    setFontSize(size);
    setDarkMode(dark);
    
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DpadAppBar />
      <StarterDialog />
      <EditorToolBar onToolBarChange={onToolBarChange}/>
      <MonacoEditor language={language} fontSize={fontSize} darkMode={darkMode}/>
    </ThemeProvider>
  );
}

export default App;
