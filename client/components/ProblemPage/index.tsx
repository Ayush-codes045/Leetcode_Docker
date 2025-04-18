import React from "react";
import Navbar from "../LandingPage/Navbar";
import LatestProblem from "../LandingPage/LatestProblem";
const index = () => {
  return (
    <div>
      <Navbar />
      <LatestProblem full="full" />
    </div>
  );
};

export default index;
