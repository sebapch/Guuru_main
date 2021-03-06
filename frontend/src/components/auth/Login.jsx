import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../../components/misc/ErrorNotice";
import "./Login.css";
import DrawerLayout from "../layout/Drawer/DrawerLayout";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post("/users/login", loginUser);
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      localStorage.setItem("isAuthenticated", "true");
      history.push("/");
    } catch (err) {
      //err.response.data.msg && setError(err.response.data.msg)
      console.log(err);
    }
  };

  return (
    <div className="divBody">
      <div className="form-main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          {error && (
            <ErrorNotice
              message={error}
              clearError={() => setError(undefined)}
            />
          )}
          <form onSubmit={submit}>
            <label for="chk" aria-hidden="true" className="top-text2">
              LOGIN
            </label>
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required=""
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-input"
              type="password"
              name="pswd"
              id="password"
              placeholder="Password"
              required=""
              onChange={(e) => setPassword(e.target.value)}
            />

            <input type="submit" value="Login" className="form-button" />
          </form>
        </div>
      </div>
    </div>

    /* <div className="login">
            <h2>Login</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <div className='box-form'>
            <form onSubmit={submit} className='form-login'>
                <label>Email: </label>
                <input type="email" id="email" onChange={e => setEmail(e.target.value)}/>
                <label>Password: </label>
                <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>
                <input type="submit" value="Login" className="btn btn-primary" />
            </form>
            </div>
        </div> */
  );
}

export default Login;
