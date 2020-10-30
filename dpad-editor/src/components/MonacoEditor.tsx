import React, { useState, useEffect } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebrtcProvider } from "y-webrtc";
import * as awarenessProtocol from 'y-protocols/awareness.js'
import Editor from "@monaco-editor/react";
import { FillSpinner as Loader } from "react-spinners-kit";

const MonacoEditor = () => {
  const [monacoEditor, setMonacoEditor] = useState(null);
  const onEditorMounted = (_: any, editor: any) => {
    setMonacoEditor(editor);
  };

  // when the editor is mounted, connect yjs to webrtc room
  useEffect(() => {
    if (monacoEditor == null) {
      return () => {};
    }

    const yDoc = new Y.Doc();
    const webRtcOpt = {
      signaling: ["ws://localhost:34000"],
      password: null,
      awareness: new awarenessProtocol.Awareness(yDoc),
      maxConns: 25,
      filterBcConns: true,
      peerOpts: {}, // simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts
    };

    const yjsProvider = new WebrtcProvider("monaco", yDoc, webRtcOpt);

    const type = yDoc.getText("monaco");

    const monacoBinding = new MonacoBinding(
      type,
      // @ts-ignore: Object is possibly 'null'.
      monacoEditor.getModel(),
      new Set([monacoEditor]),
      yjsProvider.awareness
    );

    yjsProvider.connect();

    return () => {};
  }, [monacoEditor]);

  const editorOptions = {
    fontSize: 20
  }
  return (
    <Editor
      height="120vh" // By default, it fully fits with its parent
      theme={"dark"}
      language={"python"}
      loading={<Loader />}
      value={""}
      options={editorOptions}
      editorDidMount={onEditorMounted}
    />
  );
};

export default MonacoEditor;