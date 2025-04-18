import Navbar from "../LandingPage/Navbar";
import ProblemEditor from "./problemEditor";
import TestCases from "./TestCases";
import Title from "./Title";

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
