import io from "socket.io-client";

export default () => {
  let socket = io();
  return (
    <form>
      <h1>Sign Up</h1>
    </form>
  );
};
