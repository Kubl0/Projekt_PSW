import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";

export default function NavBar({ logout }) {
  const logged = useContext(loggedContext);

  const location = window.location.pathname;

  const [display, setDisplay] = React.useState(
    location !== "/login" ? true : false
  );

  React.useEffect(() => {
    setDisplay(location !== "/login" ? true : false);
  }, [location]);

  return (
    <>
      {display && logged && (
        <div>
          <h2>Welcome {logged.username}</h2>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}
