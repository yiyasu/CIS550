import React from "react";
import { withRouter } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import { getListing, getListingPriceWithTemp, getBookingsWithTemp,getListingMonthlyPrices, getListingReviews } from "../fetcher";
import { Image } from "antd";
import { Pagination } from "antd";
import Popup from './Popup';
import './style.css';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
} from "shards-react";
import Plot from "../components/Plot";
class ListingPage extends React.Component {
  constructor(props){
    super(props); 
    this.state = {
      id: this.props.match.params.id,
      reviewsResults:[], 
      total: 0, 
      listing: {listing_picture_url:"", 
      host: []}, 
      isOpen: false, 
      prices: [], 
      booking:[], 
      monthlyPrice: []
    }
  }


  togglePopup = () => {
    this.setState({isOpen: !this.state.isOpen})
  };
  componentDidMount() {
    
    getListingReviews(this.state.id, null, null).then((res) => {
      this.setState({ total: res.results.length });
    });
    getListingReviews(this.state.id, 1, 10).then((res) => {
      this.setState({ reviewsResults: res.results });
    });
    getListing(this.state.id).then((res) => {
      this.setState({ listing: res.listing});
    });
    getListingPriceWithTemp(this.state.id).then((res) => {
      var arr = res.results.map(({range_floor, _, average_price}) => ([range_floor, average_price])); 
      arr.unshift(["range_floor", "average_price"])
      this.setState({ prices: arr});
      console.log(this.state.prices);
    });
    getBookingsWithTemp(this.state.id).then((res) => {
      var arr = res.results.map(({range_floor, count}) => ([range_floor, count])); 
      arr.unshift(["range_floor", "count"])
      this.setState({ booking: arr});

    });
    getListingMonthlyPrices(this.state.id).then((res) => {
      var arr = res.message.map(({month, average_price}) => ([month, average_price]));
      arr.unshift(["month", "average_price"])
      this.setState({ monthlyPrice: arr});

    });
  }

  updateResults = (page, pagesize) => {
    getListingReviews(this.state.id, page, pagesize).then((res) => {
      this.setState({ reviewsResults: res.results });
    });
  };

 Summary = (props) =>  {
    const isPresent = props.isPresent;
    if (isPresent) {
      return <div > 
      <h4>Summary</h4>
      <span> {this.state.listing.summary} </span>
    </div>;
    }
    return null;
  }

  render(){
    return(
      <div>
      <MenuBar/>
      <MainContainer width="80%"> 
      <Container style={{ marginBottom: "2rem" }}>
        <Row>
        <Col sm="12" lg="4" ><Image width = {250} src={this.state.listing.thumbnail_url} fallback="https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg" /></Col>
        <Col sm="12" lg="8"> 
        <h1>{this.state.listing.name}</h1> 
        <div style= {{paddingTop: "24px", paddingBottom: "24px"}} > </div>
        <div> 
          <span className="overflow"> {this.state.listing.space} </span>
          <button style={{ padding: "0", border: "none", background: "none" }} type="button" onClick={this.togglePopup}>
            <span style= {{  textDecoration: "underline"}}>Show More</span>
          </button>
        </div>
        </Col>
        </Row>
        <Row>
          <Col>
          <Plot dataAvailable={this.state.prices} data={this.state.prices} title='Prices with Temperature' x="Total Price" y= 'Temperature'/>
          <Plot dataAvailable={this.state.booking} data={this.state.booking} title='Bookings with Temperature' x="Total Bookings" y= 'Temperature'/>
          <Plot dataAvailable={this.state.monthlyPrice} data={this.state.monthlyPrice} title='Price By Month' x="Price" y= 'Month'/>
          </Col>
        </Row>
      </Container>
      </MainContainer>
        <div>
        
          
          {this.state.isOpen && <Popup content={<>
                  <div> 
                    <h3>About This Space</h3>
                    <span> {this.state.listing.space} </span>
                    <this.Summary isPresent={this.state.listing.summary} />
                    <h4> Description </h4>
                    <span> {this.state.listing.description} </span>
                    <h4> Transit </h4>
                    <span> {this.state.listing.transit} </span>
                  </div>
                </>}
                handleClose={this.togglePopup}
                />}

        </div>

        <h4> Reviews</h4>
        <table>
          <tr>
            <th>Name</th>
            <th>Date</th>
             <th>Review</th>
          </tr>
             {this.state.reviewsResults.map((elem) => (
             <tr key={elem.reviewer_id} >
               <td>{elem.reviewer_name}</td>
                <td>{elem.comments}</td>
                <td>{elem.date}</td>
              </tr>
             ))}
         </table>
        <div style={{ margin: "2rem", height: "5rem" }}>
          <Pagination
            defaultPageSize={10}
            total={this.state.total}
            onChange={this.updateResults}
            />
        </div>
      </div>
      
    );
  }
}

export default withRouter(ListingPage);