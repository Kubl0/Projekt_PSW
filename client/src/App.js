import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPanel from "./components/LoginPanel";
import RegisterPanel from "./components/RegisterPanel";
import HomePage from "./components/HomePage";
import { createContext } from "react";
import { useCookies } from "react-cookie";
import NavBar from "./components/NavBar";

export const loggedContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  //eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  if (cookies.user !== undefined && user === null) {
    setUser(cookies.user);
  }

  function logout() {
    setUser(null);
    removeCookie("user");
    navigate("/login");
  }

  return (
    <div className="App">
      <loggedContext.Provider value={user}>
        <NavBar logout={logout} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPanel setUser={setUser} />} />
          <Route path="/register" element={<RegisterPanel />} />
          <Route
            path="/home"
            element={user !== null ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </loggedContext.Provider>
    </div>
  );
}

export default App;
