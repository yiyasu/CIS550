import React from "react";
import { getAllListings } from "../fetcher";
import { trimLength } from "../utils";
import Container from "../components/Container";
import GridContainer from "../components/GridContainer";
import LoadingIndicator from "../components/LoadingIndicator";
import { Card, CardTitle, CardImg, CardBody, CardFooter } from "shards-react";

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

  render() {
    return (
      <div>
        <MenuBar />
        <Container>
          <h1>Listings</h1>
          <LoadingIndicator isLoading={this.state.listingResults.length === 0}>
            <GridContainer>
              {this.state.listingResults.map(
                ({ name, summary, price, thumbnail_url, num_reviews, id }) => (
                  <div key={id} style={{ margin: "1rem 2rem 1rem 0" }}>
                    <Card style={{ maxWidth: "300px" }}>
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
                        <p
                          style={{
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                            }}
                          >
                            <span
                              style={{ fontWeight: "bold" }}
                            >{`Reviews: `}</span>
                            {num_reviews}
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              right: 0,
                              fontWeight: "bold",
                            }}
                          >{`$ ${price}`}</span>
                        </p>
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
        </Container>
      </div>
    );
  }
}

export default ListingsPage;
