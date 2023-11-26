import React, { useEffect, useRef } from "react";
import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";
import { Card } from "@mui/material";
//import '../darktheme.css'

interface JSONEditorComponentProps {
  jsonData: any
  onChange: (e: any) => void
}

const JSONEditorComponent: React.FC<JSONEditorComponentProps> = ({ jsonData, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  let jsonEditor: JSONEditor | null = null;

  useEffect(() => {
    if (containerRef.current) {
      const options: JSONEditorOptions = { mode: "tree", onChangeJSON: onChange, enableTransform: false };
      jsonEditor = new JSONEditor(containerRef.current, options);
      jsonEditor.set(jsonData);
    }

    return () => {
      if (jsonEditor) {
        jsonEditor.destroy();
      }
    };
  }, [jsonEditor]);

  return (
    <Card>
      <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
    </Card>
  );
};

export default JSONEditorComponent;