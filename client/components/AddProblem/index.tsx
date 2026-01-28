import Navbar from "../LandingPage/Navbar";
import dynamic from 'next/dynamic';
//import ProblemEditor from "./problemEditor";
import TestCases from "./TestCases";
import Title from "./Title";
const ProblemEditor = dynamic(() => import('./problemEditor'), {
  ssr: false,
  loading: () => <div className="px-8 py-4">Loading editor...</div>
});
const AddProblem = () => {
  return (
    <div>
        <Navbar />
        <Title />
      <ProblemEditor/>
      <TestCases />
    </div>
  );
};

export default AddProblem;
