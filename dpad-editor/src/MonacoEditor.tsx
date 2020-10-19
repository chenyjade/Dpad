import React, { useState, useEffect } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from 'y-websocket'
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
    const yjsProvider = new WebsocketProvider('wss://localhost:34000', 'monaco', yDoc)
    /*const yjsProvider = new WebrtcProvider("test", yDoc, {
      signaling: ["ws://localhost:3000"],
    });*/

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

  return (
    <Editor
      height="120vh" // By default, it fully fits with its parent
      theme={"dark"}
      language={"python"}
      loading={<Loader />}
      value={""}
      editorDidMount={onEditorMounted}
    />
  );
};

export default MonacoEditor