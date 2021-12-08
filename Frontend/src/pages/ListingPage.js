import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import { getListing } from "../fetcher";
function ListingPage() {
  let { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({
    listing_picture_url: "",
    host: [],
  });

  useEffect(() => {
    getListing(id).then((res) => {
      setListing(res.listing);
      
    });
  }, []);

  return (
    <div>
      <MenuBar />
      <MainContainer>
        <h1>Information For Listing {id}</h1>
      </MainContainer>
    </div>
  );
}

export default ListingPage;
