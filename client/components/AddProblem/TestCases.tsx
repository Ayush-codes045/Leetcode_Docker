"use client"
import { useContent } from '@/hook/content'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const TestCases = () => {
const {testCases,setTestCases }  = useContent();
  return (
    <div className="m-4 p-4">
      <div className="text-xl font-medium">Test Cases</div>
      <div className="text-sm font-light">Add test cases for the problem</div>
      {
        testCases.map((testCase, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className=" text-md w-[10%]">Test Case {index + 1}</div>
            <Input type="text" placeholder="Input" className="p-2 m-2 w-[45%] border border-gray-300 rounded-md" value={testCase.input} onChange={(e) => {
              const updatedTestCases = [...testCases];
              updatedTestCases[index].input = e.target.value;
              setTestCases(updatedTestCases);
            }} />
            <Input type="text" placeholder="Output" className="p-2 m-2 w-[45%] border border-gray-300 rounded-md" value={testCase.output} onChange={(e) => {
              const updatedTestCases = [...testCases];
              updatedTestCases[index].output = e.target.value;
              setTestCases(updatedTestCases);
            }} />
            <Button onClick={() => {
              if(testCases.length === 1) return;
              const updatedTestCases = [...testCases];
              updatedTestCases.splice(index, 1);
              setTestCases(updatedTestCases);
            }} className="text-red-500">Delete</Button>
          </div>
        ))
      }
      <Button onClick={() => setTestCases([...testCases, {input: '', output: ''}])} className="">Add Test Case</Button>
    </div>
  )
}

export default TestCases