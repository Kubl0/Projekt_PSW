import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";

const HomePage = () => {
  const logged = useContext(loggedContext);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
