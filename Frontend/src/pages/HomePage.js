import React from "react";
import Container from "../components/Container";

import MenuBar from "../components/MenuBar";

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <MenuBar />
        <Container>
          <h1>Home Page</h1>
          <p>Add stuff here</p>
        </Container>
      </div>
    );
  }
}

export default HomePage;
