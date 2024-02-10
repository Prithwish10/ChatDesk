const LandingPage = ({ currentUser, conversations }) => {
  console.log("currentUser: ", currentUser);
  console.log("conversation: ", conversations);

  return currentUser ? (
    <h1>You are Signed in. Chat screen...</h1>
  ) : (
    <h1>You are not Signed in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get(
      `/api/v1/chats/users/${currentUser.id}/conversations`
    );

    return { conversations: data };
  } catch (err) {
    console.error("Error fetching conversations:", err.message);
    return {};
  }
};

export default LandingPage;
