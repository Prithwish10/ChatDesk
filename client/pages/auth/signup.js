import io from "socket.io-client";
import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
  let socket = io();

  socket.on("connect", () => {
    console.log("Connected with Id: ", socket.id);
  });

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/v1/users/signup",
    method: "post",
    body: {
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
    },
    onSuccess: () => {
      socket.on("welcome-message", (message) => {
        console.log(message);
      });
      socket.emit("add-user", { firstName, lastName, email });
      Router.push("/");
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Firstname</label>
        <input
          value={firstName}
          onChange={(e) => setFirstname(e.target.value)}
          type="firstName"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Lastname</label>
        <input
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
          type="lastName"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Mobile number</label>
        <input
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          type="mobileNumber"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
