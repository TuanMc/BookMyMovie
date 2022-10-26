import React, { useEffect, useState } from "react";
import { AppBar, Button, Tab, Tabs, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import "./Header.css";
import Logo from "../../assets/logo.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isMovieDetailPage, setIsMovieDetailPage] = useState(false);
  const [tabValue, setTabValue] = useState("login");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
    mobile_number: "",
    isRegisterSuccses: false,
  });

  useEffect(() => {
    if (window.location.pathname.includes("/movie/")) {
      setIsMovieDetailPage(true);
    } else {
      setIsMovieDetailPage(false);
    }
  }, [window.location.pathname]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    var myHeaders = new Headers();
    const token = btoa(`${loginForm.username}:${loginForm.password}`);
    myHeaders.append("Authorization", `Basic ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${props.baseUrl}auth/login`, requestOptions)
      .then((response) => {
        sessionStorage.setItem("token", response.headers.get("access-token"));
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setOpen(false);
        setIsLogin(true);
      })
      .catch((error) => console.log("error", error));
  };

  const handleLogout = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${props.baseUrl}auth/logout`, requestOptions)
      .then(() => {
        sessionStorage.clear();
        setIsLogin(false);
      })
      .catch((error) => console.log("error", error));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    console.log(registerForm);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(registerForm),
      redirect: "follow",
    };

    fetch(`${props.baseUrl}signup`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setRegisterForm({ ...registerForm, isRegisterSuccses: true });
      })
      .catch((error) => console.log("error", error));
  };

  const handleBookShow = () => {
    if (!isLogin) {
      setOpen(true);
    } else {
      const routes = window.location.pathname.split("/");
      const id = routes[routes.length - 1];
      props.history.push({
        pathname: "/bookshow/" + id,
      });
    }
  };

  const handleLoginChange = (name) => (event) => {
    setLoginForm({ ...loginForm, [name]: event.target.value });
  };

  const handleRegisterChange = (name) => (event) => {
    setRegisterForm({ ...registerForm, [name]: event.target.value });
  };

  return (
    <div className="header">
      <img src={Logo} className="header__logo" alt="LOGO" />
      <div className="header__action-container">
        {isMovieDetailPage && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBookShow()}
          >
            Book Show
          </Button>
        )}
        {isLogin === false ? (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Login
          </Button>
        ) : (
          <Button variant="contained" onClick={() => handleLogout()}>
            Logout
          </Button>
        )}
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          style={customStyles}
          ariaHideApp={false}
        >
          <AppBar position="static">
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              centered
            >
              <Tab value="login" label="LOGIN" />
              <Tab value="register" label="REGISTER" />
            </Tabs>
          </AppBar>
          {tabValue === "login" && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "48px",
                paddingRight: "48px",
              }}
              onSubmit={handleLoginSubmit}
            >
              <TextField
                id="username"
                label="Username"
                value={loginForm.username}
                onChange={handleLoginChange("username")}
                margin="normal"
                required
              />
              <TextField
                id="password"
                label="Password"
                value={loginForm.password}
                onChange={handleLoginChange("password")}
                margin="normal"
                required
              />
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <Button type="submit" variant="contained" color="primary">
                  LOGIN
                </Button>
              </div>
            </form>
          )}
          {tabValue === "register" && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "48px",
                paddingRight: "48px",
              }}
              onSubmit={handleRegisterSubmit}
            >
              <TextField
                id="first_name"
                label="First Name"
                value={registerForm.first_name}
                onChange={handleRegisterChange("first_name")}
                margin="normal"
                required
              />
              <TextField
                id="last_name"
                label="Last Name"
                value={registerForm.last_name}
                onChange={handleRegisterChange("last_name")}
                margin="normal"
                required
              />
              <TextField
                id="email_address"
                label="Email"
                value={registerForm.email_address}
                onChange={handleRegisterChange("email_address")}
                margin="normal"
                required
              />
              <TextField
                id="password"
                label="Password"
                value={registerForm.password}
                onChange={handleRegisterChange("password")}
                margin="normal"
                required
              />
              <TextField
                id="mobile_number"
                label="Contact No."
                value={registerForm.mobile_number}
                onChange={handleRegisterChange("mobile_number")}
                margin="normal"
                required
              />
              {registerForm.isRegisterSuccses && (
                <p>Registration Successful. Please Login!</p>
              )}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <Button type="submit" variant="contained" color="primary">
                  REGISTER
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(Header);
