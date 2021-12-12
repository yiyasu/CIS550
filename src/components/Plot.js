import React from "react";
import { Chart } from "react-google-charts";
import LoadingIndicator from "./LoadingIndicator";
//dataAvail data, title, x title, y title
function Plot(props) {
  const dataAvailable = props.dataAvailable;

  return (
    <LoadingIndicator isLoading={!dataAvailable}>
      <Chart
        width={"600px"}
        height={"400px"}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={props.data}
        options={{
          title: props.title,
          chartArea: { width: "50%" },
          hAxis: {
            title: props.x,
            minValue: 0,
          },
          vAxis: {
            title: props.y,
          },
        }}
        // For tests
        rootProps={{ "data-testid": "1" }}
      />
    </LoadingIndicator>
  );
}

export default Plot;
