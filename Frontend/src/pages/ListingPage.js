import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import MenuBar from "../components/MenuBar";
import MainContainer from "../components/MainContainer";
import { getListing, getListingPriceWithTemp, getBookingsWithTemp,getListingMonthlyPrices, getListingReviews } from "../fetcher";
import LoadingIndicator from "../components/LoadingIndicator";
import { Col, Container, Row} from "shards-react";
import { Image, Table, Column} from "antd";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Popup from './Popup';
import './style.css';
import { Chart } from "react-google-charts";


function ListingPage() {
  let { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({
    listing_picture_url: "",
    host: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [prices, setPrices] = useState([]); 
  const [booking, setBooking] = useState([]); 
  const [monthlyPrice, setMonthlyPrice] = useState([]); 
  const [reviews, setReviews] = useState([]); 
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    getListing(id).then((res) => {
      setListing(res.listing);
      
    });
    
  }, []);

  useEffect(() => {
    getListingPriceWithTemp(id).then((res) => {
      var arr = res.results.map(({range_floor, _, average_price}) => ([range_floor, average_price])); 
      arr.unshift(["range_floor", "average_price"])
      setPrices(arr);

    });
  }, []);

  useEffect(() => {
    getBookingsWithTemp(id).then((res) => {
      var arr = res.results.map(({range_floor, count}) => ([range_floor, count])); 
      arr.unshift(["range_floor", "count"])
      setBooking(arr);

    });
  }, []);

  useEffect(() => {
    getListingMonthlyPrices(id).then((res) => {
      var arr = res.message.map(({month, average_price}) => ([month, average_price]));
      arr.unshift(["month", "average_price"])
    
      setMonthlyPrice(arr);

    });
  }, []);

  useEffect(() => {
    getListingReviews(id).then((res) => {
      var arr = res.results.map(({_,_Y, reviewer_name, comments, date}) => ([reviewer_name,  comments, date]));
      setReviews(arr);

    });
  }, []);

  function updateRoute(id) {
    history.push(`/host/${id}`);
  }


  function MonthHistogram(props) {

    const dataAvailable = props.dataAvailable
    if (dataAvailable){
      return <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={monthlyPrice}
      options={{
        title: 'Prices By Month',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Price',
          minValue: 0,
        },
        vAxis: {
          title: 'Month',
        },
      }}
      // For tests
      rootProps={{ 'data-testid': '1' }}
    />
    }
    return null; 

  }
  
  function BookingHistogram(props) {

    const dataAvailable = props.dataAvailable
    if (dataAvailable){
      return <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={booking}
      options={{
        title: 'Bookings With Temperature',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Total Bookings',
          minValue: 0,
        },
        vAxis: {
          title: 'Temperature',
        },
      }}
      // For tests
      rootProps={{ 'data-testid': '1' }}
    />
    }
    return null; 

  }
  function Histogram(props){
    
    const dataAvailable = props.dataAvailable
    if (dataAvailable){
      return <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={prices}
      options={{
        title: 'Prices with Temperature',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Total Price',
          minValue: 0,
        },
        vAxis: {
          title: 'Temperature',
        },
      }}
      // For tests
      rootProps={{ 'data-testid': '1' }}
    />
    }
    return null; 
  }

  
  function AvatarP(props) {
    const isAvail = props.isAvail; 
    if (isAvail) {
      return <Avatar

               
      src={listing.host_thumbnail_url}
      size={150}
      icon={<UserOutlined />}
      />
    } else{
      return null
    }
  }
  
  function Summary(props) {
    const isPresent = props.isPresent;
    if (isPresent) {
      return <div > 
      <h4>Summary</h4>
      <span> {listing.summary} </span>
    </div>;
    }
    return null;
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
              <div style= {{paddingTop: "24px", paddingBottom: "24px"}} > </div>
              <div> 
                
                <span className="overflow"> {listing.space} </span>
              </div>

              
              <div>
                <button style={{ padding: "0", border: "none", background: "none" }} type="button" onClick={togglePopup}>
                  <span style= {{  textDecoration: "underline"}}>Show More</span>
                </button>
                
                  <div><Histogram dataAvailable={prices}/></div>
                  <div><BookingHistogram dataAvailable={booking}/></div>
                  <div><MonthHistogram dataAvailable={monthlyPrice}/></div>

                {isOpen && <Popup content={<>
                  <div> 
                    <h3>About This Space</h3>
                    <span> {listing.space} </span>
                    <Summary isPresent={listing.summary} />
                    <h4> Description </h4>
                    <span> {listing.description} </span>
                    <h4> Transit </h4>
                    <span> {listing.transit} </span>
                  </div>
                </>}
                handleClose={togglePopup}
                />}
              </div>
            </Col>
            
          </Row>
          
          <h3>Hosted By {listing.host_name} </h3>
          
              
          <AvatarP isAvail={!isOpen} />
               <button type="button" onClick={() => updateRoute(listing.host_id)}>  See Profile </button>
          <h3> Reviews </h3>
          <table>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Review</th>
            </tr>
            {reviews.map((elem) => (
            <tr >
              <td>{elem[0]}</td>
              <td>{elem[1]}</td>
              <td>{elem[2]}</td>
            </tr>
            
            ))}
          </table>
         
        </Container>
      </MainContainer>
      </LoadingIndicator>
    </div>
  );
}

export default ListingPage;
