
import React, { useState} from 'react';
import MonthlyReport from '../components/monthlyReport';
import DailyReport from '../components/dailyReport';
import Switch  from 'react-switch';


const Report = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMonthlyReport, setShowMonthlyReport] = useState(true);

  const toggleReport = () => {
    setShowMonthlyReport((prevValue) => !prevValue);
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>
        <label >Select Date: &nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input class="custom-date-picker" type="date" onChange={handleDateChange} /> <br /> <br />
        </div>
        <div>
        <h3>Toggle Report</h3>
      <Switch
        onChange={toggleReport}
        checked={showMonthlyReport}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={30}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
      />
      </div>
        
        </div>
      {showMonthlyReport ? <MonthlyReport month={new Date(selectedDate).getMonth()+1} year={new Date(selectedDate).getFullYear()}/> : <DailyReport selectedDate={selectedDate}/>}
      </>
  );
};

export default Report;

