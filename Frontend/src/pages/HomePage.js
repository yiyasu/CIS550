import React from "react";
import MainContainer from "../components/MainContainer";

import MenuBar from "../components/MenuBar";

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <MenuBar />
        <MainContainer>
          <h1>Home Page</h1>
          <p>Add stuff here</p>
        </MainContainer>
      </div>
    );
  }
}

export default HomePage;
