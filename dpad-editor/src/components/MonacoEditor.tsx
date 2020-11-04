import React, { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebrtcProvider } from "y-webrtc";
import * as awarenessProtocol from 'y-protocols/awareness.js'
import Editor from "@monaco-editor/react";
import { FillSpinner as Loader } from "react-spinners-kit";

function MonacoEditor(props) {
  const [monacoEditor, setMonacoEditor] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState('Python');
  const [fontSize, setFontSize] = useState(20);
  const [theme, setTheme] = useState('light');
  const [content, setContent] = useState('');
  const editorRef = useRef();

  const onEditorMounted = (_: any, editor: any) => {
    setIsEditorReady(true);
    setMonacoEditor(editor);
    editorRef.current = editor;
  };

  useEffect(() => {
    setLanguage(props.language);
    setFontSize(props.fontSize);
    if (editorRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      setContent(editorRef.current.getValue());
    }
    setTheme(props.darkMode ? 'dark' : 'light');
  }, [props.language, props.fontSize, props.darkMode])

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
    fontSize: fontSize
  }

  return (
    <>
      <Editor
        height="120vh" // By default, it fully fits with its parent
        theme={theme}
        language={language}
        loading={<Loader />}
        value={content}
        options={editorOptions}
        editorDidMount={onEditorMounted}
      />
    </>
  );
};

export default MonacoEditor;
