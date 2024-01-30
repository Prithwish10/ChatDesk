import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return currentUser ? <h1>You are Signed in</h1> : <h1>You are not Signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  try {
    const { data } = await buildClient(context).get(
      "/api/v1/users/currentuser"
    );

    return data;
  } catch (er) {
    return { currentUser: null };
  }
};

export default LandingPage;
