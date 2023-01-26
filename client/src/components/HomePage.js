import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";
import { Link } from "react-router-dom";

const HomePage = () => {
  //eslint-disable-next-line
  const logged = useContext(loggedContext);

  return (
    <div>
      <h1>Home Page</h1>
      <p>
        <Link to="/gameroom">Game room</Link>
      </p>
    </div>
  );
};

export default HomePage;
