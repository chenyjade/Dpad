import React, { useState, useEffect, useContext } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
//import { WebrtcProvider } from "y-webrtc";
import emitter from "../utils/events";
import { WebrtcProvider } from "../client/webrtcClient";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { EditorOptions } from "./EditorOptions";
import EditorToolBar from "./EditorToolBar";
import MonacoEditor from "react-monaco-editor";
import DpadAppBar from "./AppBar";
import ConnContext from "../contexts/ConnectionContext";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useParams, useHistory } from "react-router-dom";
import config from "../../package.json"

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => ++value);
}

export default function MonacoEditorPage() {
  const [monacoEditor, setMonacoEditor] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs");
  const [content, setContent] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { conn, updateConn } = useContext(ConnContext);
  const [alertMsg, setAlertMsg] = useState("");
  const urlParam = useParams();
  const history = useHistory();
  const forceUpdate = useForceUpdate();

  const defaultEditorOptions: EditorOptions = {
    fontSize: 20,
  };

  let langMap = new Map([
    ["java", "java"],
    ["javascript", "js"],
    ["python", "py"],
  ]);

  const [editorOptions, setEditorOptions] = useState(defaultEditorOptions);

  const downloadFile = (text) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "untitled." + langMap.get(language);
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const onSetSave = () => {
    if (monacoEditor) {
      // @ts-ignore: Object is possibly 'null'.
      const text = monacoEditor.getValue();
      if (text != "") downloadFile(text);
      setContent(text);
    }
  };

  const onFileLoad = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore: Object is possibly 'null'.
      const text = e.target.result;
      setContent(text as string);
      forceUpdate();
    };
    reader.readAsText(e.target.files[0]);
  };

  const onSetLoad = () => {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.onchange = onFileLoad;
    fileSelector.click();
  };

  const onSetLanguage = (lang) => {
    if (monacoEditor) {
      // @ts-ignore: Object is possibly 'null'.
      setContent(monacoEditor.getValue());
    }
    setLanguage(lang);
  };

  const onSetTheme = (theme) => {
    if (monacoEditor) {
      // @ts-ignore: Object is possibly 'null'.
      setContent(monacoEditor.getValue());
    }
    setTheme(theme);
  };

  const onSetEditorOptions = (editorOptions) => {
    if (monacoEditor) {
      // @ts-ignore: Object is possibly 'null'.
      setContent(monacoEditor.getValue());
    }
    setEditorOptions(editorOptions);
  };

  const onEditorMounted = (editor: any, _: any) => {
    setMonacoEditor(editor);
  };

  // when the editor is mounted, connect yjs to webrtc room
  useEffect(() => {
    if (monacoEditor === null || window.location.pathname === "/offline") {
      return () => {};
    }

    if (urlParam.docId !== conn.docId) {
      history.push("/join/" + urlParam.docId);
      return () => {};
    }

    const yDoc = new Y.Doc();
    const webRtcOpt = {
      signaling: [config.signalingServer],
      password: conn.password,
      awareness: new awarenessProtocol.Awareness(yDoc),
      maxConns: conn.maxConns,
      filterBcConns: true,
      create: conn.create,
      peerOpts: {}, // simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts
    };

    const yjsProvider = new WebrtcProvider(conn.docId, yDoc, webRtcOpt);

    const type = yDoc.getText(conn.docId);
    const monacoBinding = new MonacoBinding(
      type,
      // @ts-ignore: Object is possibly 'null'.
      monacoEditor.getModel(),
      // @ts-ignore: Object is possibly 'null'.
      new Set([monacoEditor]),
      yjsProvider.awareness
    );
    
    //yjsProvider.connect(conn.create);
    setConnectionStatus("connected");
    emitter.on("webrtc", (message) => {
      if (message.type === "incorrect password") {
        setConnectionStatus("disconnected");
        setAlertMsg("Incorrect Password");
      }
      if (message.type === "invalid docId") {
        setConnectionStatus("disconnected");
        setAlertMsg("Invalid DocId");
      }
      yjsProvider.disconnect()
    });
    return () => {yjsProvider.disconnect()};
  }, [monacoEditor]);

  return (
    <div>
      <Dialog
        open={alertMsg !== ""}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alertMsg}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMsg === "Incorrect Password"
              ? "The password you entered is incorrect"
              : "The doc id you provided does not exists"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlertMsg("");
              history.push("/join/" + urlParam.docId);
            }}
            color="primary"
            autoFocus
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
      <DpadAppBar status={connectionStatus} />
      <EditorToolBar
        language={language}
        theme={theme}
        editorOptions={editorOptions}
        setSave={onSetSave}
        setLoad={onSetLoad}
        setLanguage={onSetLanguage}
        setTheme={onSetTheme}
        setEditorOptions={onSetEditorOptions}
      />
      <MonacoEditor
        height="90vh" // By default, it fully fits with its parent
        theme={theme}
        language={language}
        value={content}
        options={editorOptions}
        editorDidMount={onEditorMounted}
      />
    </div>
  );
}
