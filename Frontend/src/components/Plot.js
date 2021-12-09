import React from "react";
import { Chart } from "react-google-charts";
//dataAvail data, title, x title, y title
function Plot(props){
    
    const dataAvailable = props.dataAvailable
    if (dataAvailable){
      return <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={props.data}
      options={{
        title: props.title,
        chartArea: { width: '50%' },
        hAxis: {
          title: props.x,
          minValue: 0,
        },
        vAxis: {
          title: props.y,
        },
      }}
      // For tests
      rootProps={{ 'data-testid': '1' }}
    />
    }
    return null; 
  }

export default Plot; 