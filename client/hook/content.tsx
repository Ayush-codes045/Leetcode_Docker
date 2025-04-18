"use client";
import React, { useState } from "react";

export const AddProblemContext = React.createContext<{
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  testCases: { input: string; output: string }[];
  setTestCases: React.Dispatch<
    React.SetStateAction<{ input: string; output: string }[]>
  >;
  title: string; // Add the 'title' property
  setTitle: React.Dispatch<React.SetStateAction<string>>; // Add the 'setTitle' property
}>({
  description: "",
  setDescription: () => {},
  testCases: [{ input: "", output: "" }],
  setTestCases: () => {},
  title: "", // Initialize the 'title' property
  setTitle: () => {}, // Initialize the 'setTitle' property
});
const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = React.useState([{ input: "", output: "" }]);
  const [title, setTitle] = useState("");
  return (
    <AddProblemContext.Provider
      value={{
        description,
        setDescription,
        testCases,
        setTestCases,
        title,
        setTitle,
      }}
    >
      {children}
    </AddProblemContext.Provider>
  );
};

export default ContentProvider;

export const useContent = () => React.useContext(AddProblemContext);
