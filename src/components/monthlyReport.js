import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URI } from '../App';
import styled from 'styled-components';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, VictoryPie, VictoryLine, VictoryZoomContainer } from 'victory';
import { GiH2O } from 'react-icons/gi';

const MonthlyReport = ({ month, year }) => {
  const [reportData, setReportData] = useState({});
  const [noofcategory, setNoofCategory] = useState(5);
  const [noofflavour, setNoofflavour] = useState(5);
  //for pie chart of customize cakes

  //for line chart of year
  const [revenueData, setRevenueData] = useState(0);
  const [avg,setAvg]=useState(0)

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get(`${URI}/orders/monthly-report/${month}/${year}`);

        setReportData(response.data);
        setNoofCategory(response.data.categoryCounts.length);
        setNoofflavour(response.data.flavourCounts.length);
        setRevenueData(response.data.revenueData)
        var avg=0;
        response.data.revenueData.map((r)=>{
            avg+=r.revenue;
        })
        setAvg(year===new Date().getFullYear()?avg/(new Date().getMonth()+1):avg/12)

      } catch (error) {
        console.error('Error fetching monthly report data:', error);
      }
    };

    fetchMonthlyReport();
  }, [month, year]);


  const category = reportData.categoryCounts ? reportData.categoryCounts.map((entry) => ({
    category: entry[0],
    count: parseInt(entry[1], 10), // Parse the count as an integer
  })) : [];
  const flavours = reportData.flavourCounts ? reportData.flavourCounts.map((entry) => ({
    flavour: entry[0],
    count: parseInt(entry[1], 10), // Parse the count as an integer
  })) : [];

  const categoryDomain = {
    x: [0.5, noofcategory], // Adjust the values to move the bars to the right// Customize the Y-axis domain as needed
  };
  const flavourDomain = {
    x: [0.5, noofflavour], // Adjust the values to move the bars to the right// Customize the Y-axis domain as needed
  };


  return (
    <Wrapper>
      <div className="monthly-report-container">
        <h1>Monthly Report - {month}, {year}</h1>
        <br />
        {noofcategory!==0?
         <>
              <div className="main">
          <div className="section">
            <h3>Total Orders:   {reportData.totalOrders}</h3>

          </div>
          <div className="section">
            <h3>Total Sales:  {reportData ? reportData.totalSales : ""} Rs.</h3>

          </div>
        </div>

        <div className="section">
          <h3>Popular Cakes</h3>
          <CakeGrid>
            {reportData.popularCakes && reportData.popularCakes.map((cake, index) => (
              <CakeCard key={index}>
                <div className="round-number">{index + 1}</div>
                <div className="cake-image">
                  <img src={cake.image} alt={cake.cakeName} />
                </div>
                <div className="cake-details">
                  <p className="cake-name">{cake.cakeName}</p>
                  <p className="cake-count">{cake.count} orders</p>
                </div>
              </CakeCard>
            ))}
          </CakeGrid>
        </div>

        <div className="main">
          <div className="section" style={{ overflowX: 'auto' }}>
            <h3 style={{ fontWeight: "bold" }}>Monthly Sales based on Category:</h3>
            <div style={{ overflowX: 'auto' }}>

              <VictoryChart
                width={600}
                domain={categoryDomain}
              >
                <VictoryBar

                  data={category}
                  x="category"
                  y="count"
                  barWidth={20} // Adjust the width of the bars
                  style={{
                    data: { fill: 'lightpink' }, // Adjust bar color
                  }}
                  alignment="middle"


                />
                <VictoryAxis
                  label="Category"
                  style={{ axisLabel: { padding: 35 }, tickLabels: { fontSize: 12, fill: 'red' } }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Count"
                  style={{ axisLabel: { padding: 35 }, tickLabels: { fontSize: 12, fill: 'red' } }}
                />
              </VictoryChart>
            </div>
          </div>

          <div className="section" style={{ overflowX: 'auto' }}>
            <h3 style={{ fontWeight: "bold" }}>Monthly Sales based on Flavour:</h3>
            <div style={{ overflowX: 'auto' }}>

              <VictoryChart
                width={600}
                domain={flavourDomain}
              >
                <VictoryBar

                  data={flavours}
                  x="flavour"
                  y="count"
                  barWidth={20} // Adjust the width of the bars
                  style={{
                    data: { fill: 'lightpink' }, // Adjust bar color
                  }}
                  alignment="middle"


                />
                <VictoryAxis
                  label="Flavour"
                  style={{ axisLabel: { padding: 35 }, tickLabels: { fontSize: 12, fill: 'red' } }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Count"
                  style={{ axisLabel: { padding: 35 }, tickLabels: { fontSize: 12, fill: 'red' } }}
                />
              </VictoryChart>
            </div>
          </div>
          <div className="section">
            <h3>Cakes Customization</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VictoryPie
                width={600}
                data={[
                  { x: 'Customized', y: reportData.customize },
                  { x: 'Regular', y: reportData.notCustomize },
                ]}
                colorScale={['#00C49F', '#FF8042']}
                innerRadius={40} // Adjust the innerRadius for a doughnut-style chart
                labelRadius={100}
                labels={({ datum }) => ` ${datum.y}`}
                style={{
                  labels: { fontSize: 14, fill: 'black' },
                }}
              />
            </div>
            <div className="main">
              <div><div className="round-number2" style={{ margin: "auto" }}> </div>Customized : {(reportData.customize / (reportData.customize + reportData.notCustomize) * 100).toFixed(2)}% </div>
              <div><div className="round-number3" style={{ margin: "auto" }}> </div>Regular : {(reportData.notCustomize / (reportData.customize + reportData.notCustomize) * 100).toFixed(2)}% </div>
            </div>
          </div>

        </div>
        <div className="section">
          <h1>Monthly Revenue</h1>
          <VictoryChart
            width={800} // Set the width of the chart
            height={280} // Set the height of the chart
            domainPadding={10} // Add padding to the domain for better visualization
            
          >
            <VictoryAxis
              tickFormat={(date) => new Date(date).toLocaleString('default', { month: 'short' })}
              label={`month ${year}`}
              style={{ axisLabel: { padding: 35 },tickLabels: { fontSize: 10, fill: 'black' } }}
            />

            <VictoryAxis
              dependentAxis
              label="Revenue (in Rs.)"
              tickFormat={(y) => `${y}`} // Format y-axis ticks to show revenue
              style={{ axisLabel: { padding: 35 },tickLabels: { fontSize: 10, fill: 'black' } }}
            />
            <VictoryLine
              data={revenueData}
              x="date" // Property in your data for the x-axis (date)
              y="revenue" // Property in your data for the y-axis (revenue)
              interpolation="monotoneX" // Smooth curve
              style={{
                data: { stroke: '#00C49F' }, // Adjust line color
              }}
              labels={({ datum }) => `${datum.revenue}` // Show revenue as labels on data points
              
              }
              
            />
           <VictoryLine
  data={[{ month: 1, revenue: avg }, { month: 12, revenue: avg }]}
  x="month"
  y="revenue"
  style={{
    data: { stroke: 'red' },
  }}
  labels={({ datum }) => `${datum.revenue.toFixed(2)}`}
  labelComponent={<VictoryLabel style={{ fontSize: 10, fill: '#FF8042' }} x={100} y={220}/>} // Apply style to labels
/>
          </VictoryChart>
          <div className="main">
            <div>
            <div className="round-number2" style={{ margin: "auto" }}> </div> year 
          </div>
          <div>
          <div className="round-number3" style={{ margin: "auto" }}> </div> average
          </div>
          </div>
        </div>


        </>: <h2 style={{textAlign:"center"}}>No orders</h2>}
       
      </div>
    </Wrapper>
  );
};

export default MonthlyReport;

const Wrapper = styled.div`

.round-number {
  position: relative;
  top: 20px;
 right:100px;
  background-color: #FF5733;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}
.round-number2 {
  
  background-color: #00C49F;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.round-number3 {
  
  background-color: #FF8042;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

   .main{
    display:flex;
    justify-content:space-between;
    flex-wrap: wrap;
   }
  .monthly-report-container {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    max-width: 100vw;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    font-size: 24px;
    margin bottom: 20px;
  }

  .section {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const CakeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const CakeCard = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .cake-image img {
    width: 100px;
    height: 100px;
    border-radius: 10%;
    object-fit: cover;
    margin-bottom: 10px;
  }

  .cake-name {
    font-size: 16px;
  }

  .cake-count {
    font-size: 14px;
  }
`;
