import React from "react";
import { withRouter } from "react-router-dom";
import { getAllListings, incrementListingViews } from "../fetcher";
import { trimLength } from "../utils";
import MainContainer from "../components/MainContainer";
import GridContainer from "../components/GridContainer";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  Container,
  Col,
  Row,
  Card,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
} from "shards-react";

import { Pagination } from "antd";

import MenuBar from "../components/MenuBar";

class ListingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listingResults: [],
      total: 0,
    };
  }

  componentDidMount() {
    getAllListings(null, null).then((res) => {
      this.setState({ total: res.results.length });
    });
    getAllListings(1, 5).then((res) => {
      this.setState({ listingResults: res.results });
    });
  }

  updateResults = (page, pagesize) => {
    getAllListings(page, pagesize).then((res) => {
      this.setState({ listingResults: res.results });
    });
  };

  updateRoute = (id) => {
    this.props.history.push(`/listing/${id}`);
    incrementListingViews(id);
  };

  render() {
    return (
      <div>
        <MenuBar />
        <MainContainer>
          <h1>Listings</h1>
          <LoadingIndicator isLoading={this.state.listingResults.length === 0}>
            <GridContainer>
              {this.state.listingResults.map(
                ({
                  name,
                  summary,
                  price,
                  thumbnail_url,
                  num_reviews,
                  num_views,
                  id,
                }) => (
                  <div key={id} style={{ margin: "1rem 2rem 1rem 0" }}>
                    <Card
                      style={{ maxWidth: "350px", cursor: "pointer" }}
                      onClick={() => this.updateRoute(id)}
                    >
                      <CardImg
                        src={
                          thumbnail_url
                            ? thumbnail_url
                            : "https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg"
                        }
                      />
                      <CardBody>
                        <CardTitle>{name}</CardTitle>
                        <p>{trimLength(summary)}</p>
                      </CardBody>
                      <CardFooter>
                        <Container>
                          <Row>
                            <Col sm="4">
                              <span
                                style={{ fontWeight: "bold" }}
                              >{`Views `}</span>
                              {num_views}
                            </Col>
                            <Col sm="4">
                              <span
                                style={{ fontWeight: "bold" }}
                              >{`Reviews `}</span>
                              {num_reviews}
                            </Col>
                            <Col sm="4">{`$ ${price}`}</Col>
                          </Row>
                        </Container>
                      </CardFooter>
                    </Card>
                  </div>
                )
              )}
            </GridContainer>
            <div style={{ margin: "2rem", height: "5rem" }}>
              <Pagination
                defaultPageSize={5}
                total={this.state.total}
                onChange={this.updateResults}
              />
            </div>
          </LoadingIndicator>
        </MainContainer>
      </div>
    );
  }
}

export default withRouter(ListingsPage);
