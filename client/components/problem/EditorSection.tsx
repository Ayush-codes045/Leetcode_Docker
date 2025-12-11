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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
interface DescriptionProps {
  problem: { 
    id: string; 
    title: string; 
    description: string; 
    difficulty: string; 
    testCases: { id: string; input: string; output: string; problemId: string|null; createdAt: Date; updatedAt: Date; }[]; 
  } | null | undefined; 
}
const LANGUAGES = [
  { label: "C++", value: "cpp", monaco: "cpp" },
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Java", value: "java", monaco: "java" },
  { label: "Python", value: "python", monaco: "python" },
];

const EditorSection =({problem}:DescriptionProps) => {
  const [code, setCode] = useState<Record<string, string>>({
    cpp: "",
    javascript: "",
    java: "",
  });
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0].value);
  const { data: session } = useSession();

  const [result, setResult] = useState<any>(null)
  if(!problem) return (<div>Loading...</div>)
  const handleSumbit=async()=>{
    try {
      setLoading(true)
      setResult(null)
      const userId = (session?.user as { id?: string } | undefined)?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      // @ts-ignore
    const id = await compileCode(
      problem.id,
      code[lang],
      lang,
      problem?.testCases,
      userId
    )
    if(id){
      let attempts = 0;
      let status = await checkCompilation(id);
      while (status === "PENDING" && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        status = await checkCompilation(id);
        attempts++;
      }
      const res = await getCompiledTestCases(id)
      setResult(res)
      
    }
    setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Solve the problem</CardTitle>
            <CardDescription>Select a language, code your solution, and submit to run test cases.</CardDescription>
          </div>
          {problem?.difficulty && (
            <Badge
              variant="outline"
              className={`${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : problem.difficulty === 'Hard'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {problem.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="editor" className="">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-2 w-[160px] justify-between">
                    <span className="capitalize">{LANGUAGES.find(l => l.value === lang)?.label || lang}</span>
                    <MdOutlineArrowDropDown size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
                    {LANGUAGES.map((l) => (
                      <DropdownMenuRadioItem key={l.value} value={l.value}>
                        {l.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="text-xs text-slate-500">Use stdin/stdout; prompts/alerts are not available.</div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <Editor className="rounded-xl"
                height={"60vh"}
                value={code[lang]}
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
                language={LANGUAGES.find((l) => l.value === lang)?.monaco || "cpp"}
                onChange={(value) => {
                  //@ts-ignore
                  setCode({ ...code, [lang]: value });
                }}
                defaultLanguage={LANGUAGES.find((l) => l.value === lang)?.monaco || "cpp"}
              />
            </div>
            <div className='flex items-center justify-end gap-3'>
              <Button onClick={handleSumbit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Solution"}
              </Button>
            </div>
            {
              result && <div className="flex flex-wrap gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
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
      </CardContent>
    </Card>
  );
};

export default EditorSection;