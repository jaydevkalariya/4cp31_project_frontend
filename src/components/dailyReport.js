import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FURI, URI } from '../App';
import styled from 'styled-components';

const DailyReport = ({ selectedDate }) => {
    const [orders, setOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);
    const [requestData, setRequestData] = useState(new Date());
    const [revenueOnSelectedDate, setRevenueOnSelectedDate] = useState(0);
    const [cakes, setCakes] = useState([]);
  
    useEffect(() => {
      const temp = async () => {
      axios.get(`${URI}/orders/allNCOrders`)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
      }
      temp();
    }, [requestData]);
  
    const filterOrdersByDate = () => {
      const neww = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toISOString().slice(0, 10) === selectedDate;
      });
      return neww;
    };
  
    const calculateRevenueOnSelectedDate = () => {
      console.log("hi")
      const filteredOrders = filterOrdersByDate();
      setFilterOrders(filteredOrders)
      const revenue = filteredOrders.reduce((acc, order) => acc + order.amount, 0);
      setRevenueOnSelectedDate(revenue);
    };
  
   
  
  
  
    // Function to find the most common cake ID
    const findMostCommonCakeId = () => {

      var cakeIdCounts = {};
      const filteredOrders = filterOrdersByDate();
      setFilterOrders(filteredOrders)
      filteredOrders.map((order) => {
        order.order.map((cake) => {
          if (cakeIdCounts[cake.cakeid]) {
            cakeIdCounts[cake.cakeid]++;
          } else {
            cakeIdCounts[cake.cakeid] = 1;
          }
        });
      });
      const dataArray = Object.entries(cakeIdCounts);
      dataArray.sort((a, b) => b[1] - a[1]);
      cakeIdCounts = Object.fromEntries(dataArray);
      let i = 0;
      let cakes = [];
      for (const cakeId in cakeIdCounts) {
          i++;
          cakes.push(cakeId)
          if(i===3) break;
      }
  
      return cakes;
    };
  
    useEffect(() => {
      const temp = async () => {
        calculateRevenueOnSelectedDate();
        var mostCommonId = findMostCommonCakeId();
  
        await axios.post(`${URI}/cakes/getCakesbyIds`, {
          ids: mostCommonId
        })
          .then(response => {
            setCakes(response.data);
          })
  
  
      }
      temp();
    }, [selectedDate]);

  return (
    <Wrapper>
      <div className="daily-report-container">
      <h1>Daily Report - {new Date(selectedDate).getDate()}/{new Date(selectedDate).getMonth()+1}/{new Date(selectedDate).getFullYear()}</h1>
      {filterOrders.length !== 0 ? (
        <>
          <div className="container-fluid">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="roww">
                    <th>Sr No.</th>
                    <th>Order id</th>
                    <th>Cakes</th>
                    <th>User</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filterOrders?.map((order, idx) => {
                    return (
                      <>
                        <tr className="roww">
                          <td>{idx + 1}</td>
                          <td>{order._id}</td>
                          <td>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>SrNo.</th>
                                  <th>Cake ID</th>
                                  <th>Flavour</th>
                                  <th>Weight</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.order.map((o, i) => {
                                  return (
                                    <tr>
                                      <td>{i + 1}</td>
                                      <td>
                                        <a href={`${FURI}/singleproduct/${o.cakeid}`}>
                                          {o.cakeid}
                                        </a>
                                      </td>
                                      <td>{o.flavour}</td>
                                      <td>{o.wt}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </td>
                          <td>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Birthdate</th>
                                  <th>Mobile No</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{order.user.name}</td>
                                  <td>{order.user.date}</td>
                                  <td>{order.user.mobileno}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td>{order.amount-50}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="container">
            <h3>Total Revenue: <b>{revenueOnSelectedDate}</b></h3>
            {cakes.length!==0?<>
              <h3>Top {cakes.length} Cakes of Today:</h3>
            <CakeGrid>
            
              {cakes?.map((cake,index) => (
                <CakeCard key={index}>
                <div className="cake-item" key={cake.id}>
                  
                    <div className="cake-image">
                    <img src={cake.image} alt="" />
                   </div>
                   <div className="cake-details">
                    <p className="cake-name">{cake.name}</p>
                    {/* <p className="cake-count">{cake.count} orders</p> */}
                  </div>
                    
      
                </div>
                </CakeCard>
              ))}
            </CakeGrid>
            </>:""}
           
          </div>
        </>
      ) : (
        <h3>No Orders!!</h3>
      )}
       </div>
    </Wrapper>
   
  );
};

export default DailyReport;

const Wrapper = styled.div`


.daily-report-container {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  max-width: 80vw;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  margin-bottom: 10px;
}
  h2 {
    text-align: center;
    margin: 5px;
    font-weight: bold;
  }

  .custom-date-picker {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    font-size: 16px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  table,
  th,
  td {
    border: 1px solid #ccc;
  }

  th,
  td {
    text-align: center;
    padding: 8px;
  }

  .roww {
    border: 3px solid black;
  }

  td {
    font-weight: normal;
  }

  th {
    background-color: #f2f2f2;
  }

  .container {
    max-width: 100%;
    padding: 10px;
  }


  .b {
    font-weight: bold;
  }

  

  
`;

const CakeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust the minmax value for responsiveness */
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
