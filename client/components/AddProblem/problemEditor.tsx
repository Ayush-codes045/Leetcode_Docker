"use client";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import React, { use, useEffect, useState } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Input } from "../ui/input";
import { useContent } from "@/hook/content";
const ProblemEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Function to handle editor state changes
  const handleEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  // Function to extract plain text content
  const extractPlainText = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const plainText = rawContentState.blocks
      .map((block) => (!block.text.trim() && "\n") || block.text)
      .join("\n");
    return plainText;
  };

  // Function to extract HTML content with styles
  const extractHtmlWithStyles = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlWithStyles = rawContentState.blocks
      .map((block) => {
        const key = block.key;
        const text = block.text;
        const entityRanges = block.entityRanges;
        const inlineStyleRanges = block.inlineStyleRanges;

        let entityText = text;
        if (entityRanges.length > 0) {
          entityRanges.forEach((range) => {
            const entity = rawContentState.entityMap[range.key];
            if (entity.type === "LINK") {
              entityText = `<a href="${entity.data.url}">${entityText}</a>`;
            }
            // Handle other types of entities as needed
          });
        }

        let styledText = entityText;
        if (inlineStyleRanges.length > 0) {
          inlineStyleRanges.forEach((range) => {
            const style = range.style;
            if (style === "BOLD") {
              styledText = `<strong>${styledText}</strong>`;
            } else if (style === "ITALIC") {
              styledText = `<em>${styledText}</em>`;
            } else if (style === "UNDERLINE") {
              styledText = `<u>${styledText}</u>`;
            }
          });
        }

        return styledText;
      })
      .join("<br />");
      setDescription(htmlWithStyles);
  };
  useEffect(() => {
    extractHtmlWithStyles()
  }, [editorState]);
  const { setTitle, title, setDescription } = useContent();
  return (
    <div className="px-8">
      <div className="flex gap-2 flex-col pb-9">
        <h1 className="text-xl font-semibold">Add title</h1>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter problem title"
        />
      </div>
      <div>
        <div>
          <h1 className="text-xl font-semibold">Add description</h1>
          <p className="text-lg">Add a new problem to the database</p>
        </div>
        <div className="border-[1px] border-slate-400 rounded-b-3xl p-3">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorStyle={{
              height: "300px",
              border: "1px solid #000000",
              borderRadius: "10px",
              padding: "10px",
            }}
            onEditorStateChange={handleEditorStateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;
