import React from "react";
import { useParams } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";

function ListingPage() {
  let { id } = useParams();
  return (
    <div>
      <MenuBar />
      <MainContainer>
        <h1>Listing {id}</h1>
      </MainContainer>
    </div>
  );
}

export default ListingPage;
