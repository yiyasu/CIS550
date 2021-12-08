import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import { getListing } from "../fetcher";
import LoadingIndicator from "../components/LoadingIndicator";
import { Col, Container, Row, Card, CardImg, CardBody, CardTitle } from "shards-react";
import { Image } from "antd";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
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

  function updateRoute(id) {
    history.push(`/host/${id}`);
  }

  return (
    <div>
      <MenuBar />
      <LoadingIndicator isLoading={!listing.id}>
      <MainContainer width="80%">
        <Container style={{ marginBottom: "2rem" }}>
          <Row>
            <Col sm="12" lg="4">
              <Image width = {250} src={listing.thumbnail_url} fallback="https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg" />
            </Col>
            <Col sm="12" lg="8">
              <h1>{listing.name}</h1>
              <p></p>
            </Col>
          </Row>
          <h2>Host</h2>
          <Card
            style={{ maxWidth: "300px", cursor: "pointer" }}
            onClick={() => updateRoute(listing.host_id)}
          >
             <div style={{ margin: "1.5rem auto 0rem auto" }}>
               <Avatar
               src={listing.host_thumbnail_url}
               size={150}
               icon={<UserOutlined />}
               />
            </div>
            <CardBody>
              <CardTitle>{listing.host_name}</CardTitle>
              </CardBody>
          </Card>
        </Container>
      </MainContainer>
      </LoadingIndicator>
    </div>
  );
}

export default ListingPage;
