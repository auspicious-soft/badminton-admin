"use client";
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useState, useEffect } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface TextEditorProps {
  value?: string;
  setDescription: (content: string) => void;
}

const TextEditor = ({ value = "", setDescription }: TextEditorProps) => {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [editorContent, setEditorContent] = useState(value);
  const skipUpdateRef = useRef(false);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update local state when prop changes
  useEffect(() => {
    if (!skipUpdateRef.current) {
      setEditorContent(value);
    }
  }, [value]);

  // Update parent when local state changes
  useEffect(() => {
    if (editorContent !== value && !skipUpdateRef.current) {
      skipUpdateRef.current = true;
      setDescription(editorContent);
      setTimeout(() => {
        skipUpdateRef.current = false;
      }, 0);
    }
  }, [editorContent, setDescription, value]);

  const handleEditorChange = (content: string) => {
    skipUpdateRef.current = true;
    setEditorContent(content);
    setTimeout(() => {
      skipUpdateRef.current = false;
    }, 0);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Editor
      apiKey="cn7fp4jgljz9ci9zxpjsxt8kyi7i4370grt9ktu6lxke03eo"
      value={editorContent}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={{
        height: 250,
        menubar: false,
        statusbar: false,
        toolbar: 'fontfamily fontsizeinput blocks forecolor bold italic underline alignleft aligncenter alignright undo redo',
        toolbar_location: 'top',
        content_css: 'default',
        font_family_formats:
          'Normal=arial,helvetica,sans-serif;' +
          'Sans Serif=sans-serif;' +
          'Serif=serif;' +
          'Monospace=monospace',
        content_style: `
          body { 
            font-family: arial,helvetica,sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 16px;
          }
        `,
        browser_spellcheck: true,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;
