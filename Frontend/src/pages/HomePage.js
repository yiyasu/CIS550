import React from "react";
import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Col,
  Container,
  Row,
} from "shards-react";
import MainContainer from "../components/MainContainer";
import Plot from "../components/Plot";
import { getBookingsWithTemp } from "../fetcher";

import MenuBar from "../components/MenuBar";
import { withRouter } from "react-router-dom";

function HomeCard({ img, text, onClick }) {
  return (
    <Card
      style={{ maxWidth: "350px", cursor: "pointer" }}
      onClick={() => onClick(text)}
    >
      <CardImg src={img} />
      <CardBody>
        <CardTitle>{text}</CardTitle>
      </CardBody>
    </Card>
  );
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booking: [],
    };
  }

  componentDidMount() {
    getBookingsWithTemp(this.state.id).then((res) => {
      var arr = res.results.map(({ range_floor, count }) => [
        range_floor,
        count,
      ]);
      arr.unshift(["range_floor", "count"]);
      this.setState({ booking: arr });
    });
  }

  changeRoute = (path) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <div>
        <MenuBar />
        <MainContainer>
          <h1>Home</h1>

          <Container>
            <Row>
              We have evaluated the relationship between AirBnBs and the weather
              for the Boston area. A person who lives in Boston and is
              considering becoming an AirBnB host can decide how to price their
              listing based on the variation in prices and bookings with
              temperature and time of the year. As an example, check the
              variation in the number of bookings for all the listings in Boston
              with the change in temperature.
            </Row>
            <Row>
              <Plot
                dataAvailable={this.state.booking.length !== 0}
                data={this.state.booking}
                title="Bookings with Temperature"
                x="Total Bookings"
                y="Temperature"
              />
            </Row>
            <Row style={{ marginTop: "2rem" }}>
              <Col sm="12" lg="6">
                <HomeCard
                  img="https://lucyonlocale.com/wp-content/uploads/2021/02/Single-Blog-Post-Pics-compressed-40.jpg"
                  text="Listings"
                  onClick={this.changeRoute}
                />
              </Col>
              <Col sm="12" lg="6">
                <HomeCard
                  img="https://as1.ftcdn.net/v2/jpg/04/39/40/38/1000_F_439403801_W624JWrUmnGh0yEyWGPWyjQT23r9Au7W.jpg"
                  text="Hosts"
                  onClick={this.changeRoute}
                />
              </Col>
            </Row>
          </Container>
          <div style={{ margin: "2rem", height: "5rem" }}> </div>
        </MainContainer>
      </div>
    );
  }
}

export default withRouter(HomePage);
