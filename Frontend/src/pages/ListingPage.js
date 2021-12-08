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
import Popup from './Popup';
import './style.css';
function ListingPage() {
  let { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({
    listing_picture_url: "",
    host: [],
  });

  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    getListing(id).then((res) => {
      setListing(res.listing);
      
    });
  }, []);

  function updateRoute(id) {
    history.push(`/host/${id}`);
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
        </Container>
      </MainContainer>
      </LoadingIndicator>
    </div>
  );
}

export default ListingPage;
