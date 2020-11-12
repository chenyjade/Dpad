import React, { useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Button, Paper, TextField } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import connectionContext from "../contexts/ConnectionContext";
import { v4 as uuidv4 } from "uuid";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
  },
  createTab: {
    padding: "0 20px 20px",
    '& Button': {
      marginTop: "10px",
      marginLeft: "35%",
      width: "30%",
    }
  },
  joinTab: {
    padding: "0 20px 20px",
    '& Button': {
      marginTop: "10px",
      marginLeft: "35%",
      width: "30%",
    }
  }
}));

export default function StarterTabs() {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);
  const { conn, updateConn } = React.useContext(connectionContext);
  const urlParams = useParams();
  const history = useHistory();

  useEffect(() => {
    if (urlParams.docId) {
      setTab(1);
    }
    updateConn({ ...conn, docId: urlParams.docId });
  }, []);

  const onStartBtnClick = () => {
    //TODO: Add input verification
    if (tab === 0) {
      const newId = uuidv4();
      updateConn({ ...conn, docId: newId });
      history.push("/doc/" + newId);
    } else {
      history.push("/doc/" + conn.docId);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Create a new file" {...a11yProps(0)} />
          <Tab label="Join an existing file" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <div className={classes.createTab}>
          <TextField
            margin="dense"
            fullWidth
            id="create-password-input"
            label="Please set up a password"
            type="password"
            value={conn.password}
            onChange={(e) => updateConn({ ...conn, password: e.target.value })}
          />
          <TextField
            margin="dense"
            fullWidth
            id="max-connections-input"
            label="Max number of collaborators"
            value={conn.maxConns}
            onChange={(e) =>
              updateConn({ ...conn, maxConns: Number(e.target.value) })
            }
          />
          <Button variant="contained" onClick={onStartBtnClick}>
            Get started!
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <div className={classes.joinTab}>
          <TextField
            margin="dense"
            fullWidth
            id="join-clientid-input"
            label="Document Id"
            value={conn.docId}
            onChange={(e) => updateConn({ ...conn, docId: e.target.value })}
          />
          <TextField
            margin="dense"
            fullWidth
            id="join-password-input"
            label="password"
            type="password"
            value={conn.password}
            onChange={(e) => updateConn({ ...conn, password: e.target.value })}
          />
          <Button variant="contained" onClick={onStartBtnClick}>
            {" "}
            Get started!
          </Button>
        </div>
      </TabPanel>
    </div>
  );
}
