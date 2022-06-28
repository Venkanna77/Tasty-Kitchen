import Cookies from "js-cookie";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./index.css";

const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSubmitError, setShowSumbitError] = useState(false);
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/home" />;
  }

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const renderUsernameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={(e) => onChangeUsername(e)}
          placeholder="test username (rahul)"
        />
      </>
    );
  };

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={(e) => onChangePassword(e)}
          placeholder="test password (rahul@2021)"
        />
      </>
    );
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
      path: "/"
    });
    navigate("/home");
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSumbitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails)
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  };

  return (
    <div className="login-container">
      <div className="landing-container">
        <p className="login-mobile-text">Login Form</p>
        <img
          src="https://res.cloudinary.com/dw1fcsurf/image/upload/v1635483048/Tasty%20Kitchen/Login%20Page/Rectangle_1457_dxorue.png"
          className="login-image-mobile"
          alt="website login"
        />
      </div>

      <form className="form-container" onSubmit={(e) => submitForm(e)}>
        <img
          src="https://res.cloudinary.com/dw1fcsurf/image/upload/v1635474017/Tasty%20Kitchen/Login%20Page/Group_7420_p2q9wg.png"
          className="login-website-logo-desktop-image"
          alt="website logo"
        />
        <h1 className="tasty-text">Tasty Kitchens</h1>
        <h1 className="login-text">Login</h1>
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        {showSubmitError && <p className="error-message">{errorMsg}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <img
        src="https://res.cloudinary.com/dw1fcsurf/image/upload/v1635438234/Tasty%20Kitchen/Login%20Page/Rectangle_1456_h1wrcm.png"
        className="login-image-desktop"
        alt="website login"
      />
    </div>
  );
};

export default Login;
