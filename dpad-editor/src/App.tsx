import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import MonacoEditorPage from "./components/MonacoEditor";
import WelcomePage from "./components/WelcomePage";
import { ConnContextProvider } from "./contexts/ConnectionContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConnContextProvider>
        <Router>
          <Switch>
            <Route exact path="/offline" component={MonacoEditorPage} />
            <Route path="/doc/:docId/" component={MonacoEditorPage} />
            <Route path="/join/:docId" component={WelcomePage} />
            <Route path="/" component={WelcomePage} />
          </Switch>
        </Router>
      </ConnContextProvider>
    </ThemeProvider>
  );
}

export default App;
