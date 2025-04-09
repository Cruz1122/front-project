import Login from "./components/Auth/Login.jsx";
import VerifyCode from "./components/Auth/VerifyCode.jsx";
import FileUpload from "./components/Dashboard/FileUpload.jsx";
import React, { useState } from "react";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar la vista
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  return (
    <>
      {isLoggedIn ? (
        isCodeVerified ? (
          <FileUpload />
        ) : (
          <VerifyCode onCodeVerified={() => setIsCodeVerified(true)} />
        )
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;
