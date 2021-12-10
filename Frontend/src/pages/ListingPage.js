import React from "react";
import { withRouter } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import {
  getListing,
  getListingPriceWithTemp,
  getBookingsWithTemp,
  getListingMonthlyPrices,
  getListingReviews,
} from "../fetcher";
import { Image, Table } from "antd";
import Popup from "./Popup";
import "./style.css";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Container, Row, Col, Button } from "shards-react";

import Plot from "../components/Plot";
import Column from "antd/lib/table/Column";
class ListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      reviewsResults: [],
      listing: { listing_picture_url: "", host: [] },
      isOpen: false,
      prices: [],
      booking: [],
      monthlyPrice: [],
    };
  }

  updateRoute = (id) => {
    this.props.history.push(`/host/${id}`);
  };

  togglePopup = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  componentDidMount() {
    getListingReviews(this.state.id, null, null).then((res) => {
      this.setState({ reviewsResults: res.results });
    });
    getListing(this.state.id).then((res) => {
      this.setState({ listing: res.listing });
    });
    getListingPriceWithTemp(this.state.id).then((res) => {
      var arr = res.results.map(({ range_floor, _, average_price }) => [
        range_floor,
        average_price,
      ]);
      arr.unshift(["range_floor", "average_price"]);
      this.setState({ prices: arr });
      console.log(this.state.prices);
    });
    getBookingsWithTemp(this.state.id).then((res) => {
      var arr = res.results.map(({ range_floor, count }) => [
        range_floor,
        count,
      ]);
      arr.unshift(["range_floor", "count"]);
      this.setState({ booking: arr });
    });
    getListingMonthlyPrices(this.state.id).then((res) => {
      var arr = res.message.map(({ month, average_price }) => [
        month,
        average_price,
      ]);
      arr.unshift(["month", "average_price"]);
      this.setState({ monthlyPrice: arr });
    });
  }

  AvatarP = (props) => {
    const isAvail = props.isAvail;
    if (isAvail) {
      return (
        <Avatar
          src={this.state.listing.host_picture_url}
          size={150}
          icon={<UserOutlined />}
        />
      );
    } else {
      return null;
    }
  };

  updateResults = (page, pagesize) => {
    getListingReviews(this.state.id, page, pagesize).then((res) => {
      this.setState({ reviewsResults: res.results });
    });
  };

  Summary = (props) => {
    const isPresent = props.isPresent;
    if (isPresent) {
      return (
        <div>
          <h4>Summary</h4>
          <span> {this.state.listing.summary} </span>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <MenuBar />
        <MainContainer width="80%">
          <Container style={{ marginBottom: "2rem" }}>
            <Row>
              <Col sm="12" lg="4">
                <Image
                  width={350}
                  src={
                    this.state.listing.thumbnail_url
                      ? this.state.listing.thumbnail_url
                      : "https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg"
                  }
                />
              </Col>
              <Col sm="12" lg="8">
                <div style={{ marginLeft: "1.5rem" }}>
                  <h1>{this.state.listing.name}</h1>
                  <div
                    style={{
                      paddingTop: "24px",
                      paddingBottom: "24px",
                    }}
                  ></div>
                  <div>
                    <span className="overflow">
                      {" "}
                      {this.state.listing.space}{" "}
                    </span>
                    <button
                      style={{
                        padding: "0",
                        border: "none",
                        background: "none",
                      }}
                      type="button"
                      onClick={this.togglePopup}
                    >
                      <span style={{ textDecoration: "underline" }}>
                        Show More
                      </span>
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Plot
                  dataAvailable={this.state.prices.length !== 0}
                  data={this.state.prices}
                  title="Prices with Temperature"
                  x="Total Price"
                  y="Temperature"
                />
                {/*
                 Displayed on home page
                 <Plot
                  dataAvailable={this.state.booking.length !== 0}
                  data={this.state.booking}
                  title="Bookings with Temperature"
                  x="Total Bookings"
                  y="Temperature"
                /> */}
                <Plot
                  dataAvailable={this.state.monthlyPrice.length !== 0}
                  data={this.state.monthlyPrice}
                  title="Price By Month"
                  x="Price"
                  y="Month"
                />
              </Col>
            </Row>
          </Container>

          <div>
            {this.state.isOpen && (
              <Popup
                content={
                  <>
                    <div>
                      <h3>About This Space</h3>
                      <span> {this.state.listing.space} </span>
                      <this.Summary isPresent={this.state.listing.summary} />
                      <h4> Description </h4>
                      <span> {this.state.listing.description} </span>
                      <h4> Transit </h4>
                      <span> {this.state.listing.transit} </span>
                    </div>
                  </>
                }
                handleClose={this.togglePopup}
              />
            )}
          </div>

          <h3 style={{ marginTop: "2rem" }}>
            Hosted By {this.state.listing.host_name}
          </h3>
          <div
            style={{
              display: "flex",
              alignContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <this.AvatarP isAvail={!this.state.isOpen} />
            <Button
              size="sm"
              onClick={() => this.updateRoute(this.state.listing.host_id)}
            >
              See Profile
            </Button>
          </div>
          <h4 style={{ marginTop: "2rem" }}> Reviews</h4>
          <Table
            dataSource={this.state.reviewsResults}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 5,
              showQuickJumper: true,
            }}
          >
            <Column
              title="Name"
              dataIndex="reviewer_name"
              key="reviewer_name"
            />
            <Column title="Review" dataIndex="comments" key="comments" />
            <Column
              title="Date"
              dataIndex="date"
              key="date"
              sorter={(a, b) => a.date.localeCompare(b.date)}
            />
          </Table>
        </MainContainer>
      </div>
    );
  }
}

export default withRouter(ListingPage);
