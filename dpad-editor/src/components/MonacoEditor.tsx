import React, { useState, useEffect, useContext } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebrtcProvider } from "y-webrtc";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { EditorOptions } from "./EditorOptions";
import EditorToolBar from "./EditorToolBar";
import MonacoEditor from "react-monaco-editor";
import DpadAppBar from "./AppBar";
import ConnContext from "../contexts/ConnectionContext";
import { useParams, useHistory } from "react-router-dom";

function useForceUpdate(){
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
}

export default function MonacoEditorPage() {
  const [monacoEditor, setMonacoEditor] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs");
  const [content, setContent] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { conn, updateConn } = useContext(ConnContext);
  const urlParam = useParams();
  const history = useHistory();
  const forceUpdate = useForceUpdate();

  const defaultEditorOptions: EditorOptions = {
    fontSize: 20,
  };

  let langMap = new Map([
    ["java", "java"],
    ["javascript", "js"],
    ["python", "py"]
  ])

  const [editorOptions, setEditorOptions] = useState(defaultEditorOptions);

  const downloadFile = (text) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "untitled." + langMap.get(language);
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const onSetSave = () => {
    if (monacoEditor) {
      // @ts-ignore: Object is possibly 'null'.
      const text = monacoEditor.getValue();
      if (text != "")
        downloadFile(text);
      setContent(text);
    }
  };

  const onFileLoad = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore: Object is possibly 'null'.
      const text = (e.target.result);
      setContent(text as string);
      forceUpdate();
    };
    reader.readAsText(e.target.files[0]);
  };

  const onSetLoad = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
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
  }

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
      signaling: ["ws://localhost:34000"],
      password: conn.password,
      awareness: new awarenessProtocol.Awareness(yDoc),
      maxConns: conn.maxConns,
      filterBcConns: true,
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
    yjsProvider.connect();
    setConnectionStatus("connected");
    return () => {};
  }, [monacoEditor]);

  return (
    <div>
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
