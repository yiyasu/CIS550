import React from "react";
import { withRouter } from "react-router";
import { getAllHosts } from "../fetcher";
import { trimLength } from "../utils";
import MainContainer from "../components/MainContainer";
import GridContainer from "../components/GridContainer";
import LoadingIndicator from "../components/LoadingIndicator";
import { Card, CardTitle, CardBody, CardFooter } from "shards-react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { Pagination } from "antd";

import MenuBar from "../components/MenuBar";

class HostsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hostsResults: [],
      total: 0,
    };
  }

  componentDidMount() {
    getAllHosts(null, null).then((res) => {
      this.setState({ total: res.results.length });
    });
    getAllHosts(1, 10).then((res) => {
      this.setState({ hostsResults: res.results });
    });
  }

  updateResults = (page, pagesize) => {
    getAllHosts(page, pagesize).then((res) => {
      this.setState({ hostsResults: res.results });
    });
  };

  updateRoute = (id) => {
    this.props.history.push(`/host/${id}`);
  };

  render() {
    return (
      <div>
        <MenuBar />
        <MainContainer>
          <h1>Hosts</h1>
          <LoadingIndicator isLoading={this.state.hostsResults.length === 0}>
            <GridContainer>
              {this.state.hostsResults.map(
                ({
                  host_id,
                  host_name,
                  host_about,
                  host_total_listings_count,
                  host_picture_url,
                }) => (
                  <div key={host_id} style={{ margin: "1rem 2rem 1rem 0" }}>
                    <Card
                      style={{ width: "300px", cursor: "pointer" }}
                      onClick={() => this.updateRoute(host_id)}
                    >
                      <div style={{ margin: "1.5rem auto 0rem auto" }}>
                        <Avatar
                          src={host_picture_url}
                          size={150}
                          icon={<UserOutlined />}
                        />
                      </div>

                      <CardBody>
                        <CardTitle>{host_name}</CardTitle>
                        <p>{trimLength(host_about)}</p>
                      </CardBody>
                      <CardFooter>
                        <span
                          style={{ fontWeight: "bold" }}
                        >{`Listings: `}</span>
                        {host_total_listings_count}
                      </CardFooter>
                    </Card>
                  </div>
                )
              )}
            </GridContainer>
            <div style={{ margin: "2rem", height: "5rem" }}>
              <Pagination
                defaultPageSize={10}
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

export default withRouter(HostsPage);
