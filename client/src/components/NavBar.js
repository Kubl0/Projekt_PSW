import React from "react";
import { useContext } from "react";
import { loggedContext } from "../App";
import { Link } from "react-router-dom";

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
          <button>
            <Link to="/home">Home</Link>
          </button>
          &nbsp;
          <button>
            <Link to="/users">Users</Link>
          </button>
          &nbsp;
          <button>
            <Link to={`users/${logged._id}/details`}>Profile</Link>
          </button>
          &nbsp;
          <button>
            <Link to="mqtt">Chat</Link>
          </button>
          &nbsp;
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}
