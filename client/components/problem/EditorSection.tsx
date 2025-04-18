"use client";
import { checkCompilation } from "@/actions/checkCompilation";
import { compileCode } from "@/actions/compileCode";
import { getCompiledTestCases } from "@/actions/getCompiledTestCases";
import Editor from "@monaco-editor/react";
import { testCases } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SubmissionComp from "./Submission";
import TestCaseCard from "./TestCaseCard";
interface DescriptionProps {
  problem: { 
    id: string; 
    title: string; 
    description: string; 
    difficulty: string; 
    testCases: { id: string; input: string; output: string; problemId: string|null; createdAt: Date; updatedAt: Date; }[]; 
  } | null | undefined; 
}
const EditorSection =({problem}:DescriptionProps) => {
  const [code, setCode] = useState<Record<string, string>>({
    javascript: "",
    python: "",
    cpp: "",
  });
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("C++");
  const { data: session } = useSession();

  const [result, setResult] = useState<any>(null)
  if(!problem) return (<div>Loading...</div>)
  const handleSumbit=async()=>{
    try {
      setLoading(true)
      // @ts-ignore
    const id = await compileCode(problem.id,code[language],language,problem?.testCases,session?.user?.id ,problem?.difficulty)
    if(id){
      let count = 0;
      let status = await checkCompilation(id);
       await new Promise(async(resolve) => {
        while (status === "PENDING" && count < 10) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
          status = await checkCompilation(id);
          count++;
        }
        resolve(null);
       })

      const res = await getCompiledTestCases(id)
      setResult(res)
      
    }
    setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const language = lang === "JavaScript" ? "javascript" : lang=== "Python" ? "python" : "cpp";
  return (
    <div className="p-5">
      <div className=" pb-4  font-semibold">Solve the problem</div>
      <Tabs defaultValue="editor" className="">
  <TabsList>
    <TabsTrigger value="editor">Editor</TabsTrigger>
    <TabsTrigger value="submission">Submission</TabsTrigger>
  </TabsList>
  <TabsContent value="editor">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex gap-2 w-[150px] outline-none focus:outline-none">
            <div>{lang}</div>
            <MdOutlineArrowDropDown size={20} className=" text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
            <DropdownMenuRadioItem value="JavaScript">
              JavaScript
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Python">Python</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="C++">C++</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="py-4">
      <Editor className=" rounded-xl"
          height={"60vh"}
          value={code[language]}
          theme="vs-dark"
          onMount={() => { }}
          options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            wordWrap: "on",
            wrappingIndent: "same",
            automaticLayout: true,
            scrollbar: { alwaysConsumeMouseWheel: false },
          }}
          language={language}
          onChange={(value) => {
            //@ts-ignore
            setCode({ ...code, [language]: value });
          }}
          defaultLanguage="cpp"
        />
      </div>
      <div className=' flex  items-end justify-end'>
        <Button onClick={handleSumbit} disabled={loading}>
          Submit Solution
        </Button>
      </div>
      {
        result && <div className=" flex p-2">
          {result.map((item:testCases,index:number)=>{
            return <TestCaseCard key={index} item={item} index={index}/>
          })}
        </div>
      }
      </TabsContent>
      <TabsContent value="submission">
        <SubmissionComp session={session?.user}  />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorSection;
