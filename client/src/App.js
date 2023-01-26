import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPanel from "./components/LoginPanel";
import RegisterPanel from "./components/RegisterPanel";
import HomePage from "./components/HomePage";
import { createContext } from "react";
import { useCookies } from "react-cookie";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";
import UserEdit from "./components/UserEdit";
import MqttChat from "./components/MqttChat";
import MqttChatHistory from "./components/MqttChatHistory";
import GameRoom from "./components/GameRoom";
import Game from "./components/Game";
import "./style.css";

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

  useEffect(() => {
    let location = window.location.pathname;
    if (user === null && location !== "/register") {
      navigate("/login");
    }
  }, [user, navigate]);

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
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id/details" element={<UserDetails />} />
          <Route
            path="/users/:id/edit"
            element={<UserEdit logout={logout} />}
          />
          <Route path="/mqtt" element={<MqttChat user={user} />} />
          <Route path="/chathistory/:id" element={<MqttChatHistory />} />
          <Route path="/gameroom" element={<GameRoom />} />
          <Route path="/gameroom/:id" element={<Game />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </loggedContext.Provider>
    </div>
  );
}

export default App;
