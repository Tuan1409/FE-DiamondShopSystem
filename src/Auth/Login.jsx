import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { validateUser } from "./AuthFucntion";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  // const submitForm = (e) => {
  //   e.preventDefault();
  //   console.log("Email:", email);  // In giá trị của email
  //   console.log("Password:", password); // In giá trị của password
  //   validateUser({ email: email, password: password })
  //     .then((response) => {
  //       // Kiểm tra và chuyển hướng sau khi đăng nhập thành công
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         const decodedToken = jwtDecode(token);
  //         console.log("decodedToken", decodedToken); // Kiểm tra decodedToken
  //         if (decodedToken.RoleID === "1") { // Kiểm tra RoleID
  //           console.log("admin")
  //           navigate("/admin"); // Chuyển hướng đến /admin
             
  //         } else {
  //           console.log("out")
  //           navigate("/"); // Chuyển hướng về trang Home
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Login error:", error);
  //       setError(error.message);
  //     });
  // };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7122/api/Authentication/Login", {
        email: email,
        password: password,
      });

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        console.log("decodedToken", decodedToken); // Kiểm tra decodedToken

        if (decodedToken.RoleID === "1") { // Kiểm tra RoleID
          console.log("admin");
          navigate("/admin"); // Chuyển hướng đến /admin
        } else {
          console.log("user");
          navigate("/"); // Chuyển hướng về trang Home
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response ? error.response.data.message : "Login failed");
    }
  };

  return (
    <section className="pageLoginContainer">
      <div className="loginContainer container-fluid">
        <h1>LOGIN TO DASHBOARD</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="loginInputContainer">
          <form onSubmit={submitForm}>
            <input
              type="text"
              placeholder="Enter your email here"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgotPassword">
              <Link to="/" className="linkForgotPassword">
                Forgot password?
              </Link>
            </div>
            <button className="loginButton">LOGIN</button>
          </form>
          <Link to="/SignUp" className="signupLink">
            <button className="signUpButton">SIGN UP</button>
          </Link>

          <div className="backToHomePageLink">
            <Link to="/" className="linkBackHome">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}