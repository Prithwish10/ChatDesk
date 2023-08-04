import io from "socket.io-client";

export default () => {
  const user = {
    _id: "1234",
    firstName: "Alpha",
    lastName: "test",
    mobileNumber: "1290512891",
    email: "alpha@test.com",
    password: "alpha@123",
  };
  let socket = io();

  socket.on('welcome-message', message => {
    console.log(message);
  })

  socket.emit('add-user', user)
  return (
    <form>
      <h1>Sign Up</h1>
    </form>
  );
};
