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

export default function MonacoEditorPage() {
  const [monacoEditor, setMonacoEditor] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs");
  const [content, setContent] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { conn, updateConn } = useContext(ConnContext);
  const urlParam = useParams();
  const history = useHistory();

  const defaultEditorOptions: EditorOptions = {
    fontSize: 20,
  };

  const [editorOptions, setEditorOptions] = useState(defaultEditorOptions);

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
        setLanguage={onSetLanguage}
        setTheme={onSetTheme}
        setEditorOptions={setEditorOptions}
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
