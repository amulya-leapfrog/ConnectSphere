import React from "react";
import { Link } from "react-router-dom";
import { login } from "../services/Auth";

export default function Login() {
  const handleSubmit = async () => {
    const response = await login();
    console.log("Login: ", response);
  };
  return (
    <div>
      <h1>This is Login page</h1>
      <button onClick={handleSubmit}>Click for login</button>
      <Link to="/home">
        <button>Click here to go to home page</button>
      </Link>
      <Link to="/profile">
        <button>Click here to go to profile page</button>
      </Link>
    </div>
  );
}
