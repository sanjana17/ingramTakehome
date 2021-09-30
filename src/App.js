import "./App.css";
import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Chart } from "react-google-charts";
import { getStations, getData } from "./services/stations";
import Select from 'react-select'


function App() {
  const [stations, setStations] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [selectLabel, setSelectLabel] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());


  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getStations()
      .then(items => {
        if(mounted) {
          let result =[]
          for(let id in items.results){
            const item = items.results[id]
            result.push({value: item.id, label: item.name, minDate: item.mindate, maxDate: item.maxdate})
          }
          setStations(result)
        }
      })
    return () => mounted = false;
  }, []);

  let changeSelect = ({value, label, minDate, maxDate}) =>{
    setSelectValue(value)
    setSelectLabel(label)
    setMinDate(new Date(minDate))
    setStartDate(new Date(minDate))
    setMaxDate(new Date(maxDate))
    setEndDate(new Date(maxDate))
  }

  let getMonth = (month) =>{
    if(month<10){
      return "0"+ (Number(month)+1)
    }else{
      return month;
    }
  }

  let getEndMonth = (month) =>{
    if(month<10){
      return "0"+ (Number(month)+2)
    }else{
      return month;
    }
  }

  let getDate = (date) =>{
    if(date<10){
      return "0"+ (Number(date))
    }else{
      return date;
    }
  }

  let submitData = () =>{
    let start = startDate.getFullYear()+'-'+getMonth(startDate.getMonth()) + '-'+ getDate(startDate.getDate());
    let end = endDate.getFullYear()+ '-'+ getMonth(endDate.getMonth()) +'-'+getDate(endDate.getDate());
    getData(selectValue, start, end)
      .then(res =>{
        let result=[]
        if(res.results){
          for(let i=0;i<res.results.length;i++){
              result.push([res.results[i].date, res.results[i].value])
          }
        }
        setData(result)
      })
  }

  return (
    <div>
      <div style={{ height: "50%", width: "50%", padding: "30px" }}>
        <Select
            placeholder='Select Station'
            className="basic-single"
            options={stations}
            onChange={changeSelect}
          />   
          <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
          dateFormat="MM/dd/yyyy"
          minDate={minDate}
          maxDate={endDate}
          />
          <DatePicker 
          selected={endDate} 
          onChange={(date) => setEndDate(date)} 
          dateFormat="MM/dd/yyyy"
          minDate ={startDate}
          maxDate = {maxDate}
          />
          <button variant="warning" onClick={submitData}>submit</button>
      </div>  
      {data.length===0 ? <span>data not found</span>:
    <div style={{ height: "50%", width: "50%" }}>
      <Chart
      width={'600px'}
      height={'400px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={[
        ['x', 'value'],
        ...data
      ]}
      options={{
        hAxis: {
          title: 'Date',
        },
        vAxis: {
          title: 'Precipitation',
        },
      }}
      rootProps={{ 'data-testid': '1' }}
    />       
    </div>
}
    </div>
  );
}

export default App;
