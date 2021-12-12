import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import GridContainer from "../components/GridContainer";
import LoadingIndicator from "../components/LoadingIndicator";
import { getHost } from "../fetcher";
import { trimLength } from "../utils";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
} from "shards-react";
import { Image } from "antd";

function HostPage() {
  let { id } = useParams();
  const history = useHistory();
  const [hostDetails, setHostDetails] = useState({
    host_picture_url: "",
    listings: [],
  });

  function updateRoute(id) {
    history.push(`/listing/${id}`);
  }

  useEffect(() => {
    getHost(id).then((res) => {
      setHostDetails(res.hostDetails);
      console.log(res.hostDetails);
    });
  }, []);

  return (
    <div>
      <MenuBar />
      <LoadingIndicator isLoading={!hostDetails.host_id}>
        <MainContainer width="80%">
          <Container style={{ marginBottom: "2rem" }}>
            <Row>
              <Col sm="12" lg="4">
                <Image
                  width={250}
                  src={hostDetails.host_picture_url}
                  fallback="https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg"
                />
              </Col>
              <Col sm="12" lg="8">
                <h1>{hostDetails.host_name}</h1>
                <p>{hostDetails.host_about}</p>
                <Container>
                  <Row>
                    {hostDetails.host_since && (
                      <Col sm="12" lg="4">
                        <span style={{ fontWeight: "bold" }}>
                          {`Host Since: `}
                          {hostDetails.host_since}
                        </span>
                      </Col>
                    )}
                    {hostDetails.host_acceptance_rate && (
                      <Col sm="12" lg="4">
                        <span style={{ fontWeight: "bold" }}>
                          {`Acceptance Rate: `}
                          {hostDetails.host_acceptance_rate}
                        </span>
                      </Col>
                    )}
                    {hostDetails.host_response_rate && (
                      <Col sm="12" lg="4">
                        <span style={{ fontWeight: "bold" }}>
                          {`Response Rate: `}
                          {hostDetails.host_response_rate}
                        </span>
                      </Col>
                    )}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
          <h2>Listings</h2>
          <GridContainer>
            {hostDetails.listings.map(
              ({
                listing_name,
                listing_summary,
                listing_thumbnail_url,
                listing_id,
              }) => (
                <div key={listing_id} style={{ margin: "1rem 2rem 1rem 0" }}>
                  <Card
                    style={{ maxWidth: "300px", cursor: "pointer" }}
                    onClick={() => updateRoute(listing_id)}
                  >
                    <CardImg
                      src={
                        listing_thumbnail_url
                          ? listing_thumbnail_url
                          : "https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg"
                      }
                    />
                    <CardBody>
                      <CardTitle>{listing_name}</CardTitle>
                      <p>{trimLength(listing_summary)}</p>
                    </CardBody>
                  </Card>
                </div>
              )
            )}
          </GridContainer>
        </MainContainer>
      </LoadingIndicator>
    </div>
  );
}

export default HostPage;
