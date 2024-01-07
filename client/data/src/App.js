import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import sample from './video4.mp4';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function App() {

  const [file, setFile] = useState()
  const [count, setCount] = useState(0);
  const [data1, setData1] = useState();
  const [csv, csvData] = useState();
  const [selectedFile, setSelectedFile] = useState();

  function handleChange(event) {
    setFile(event.target.files[0]);

    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type === 'text/csv') {

        parseCsvFile(selectedFile);
      }
      else 
      {
        console.error('Unsupported file type. Please upload a CSV or XLS file.');
      }
    }
  }
  

function parseCsvFile(file) {
  Papa.parse(file, {
    complete: function (results) {
      // Handle the parsed CSV data (results.data)
      console.log('Parsed CSV data:', results.data);
      csvData(results.data);
    },
    header: true, // Set to true if your CSV file has headers
    skipEmptyLines: true,
  });
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        setData1(response.data.count); // Assuming response is { count: 14 }
        console.log(response.data.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data1]); // Adding data1 to dependencies to prevent unnecessary re-renders


  function handleSubmit(event) {

    event.preventDefault()
    const url = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });
  
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Set',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  //const labels = [ csv.points , 'February', 'March', 'April', 'May', 'June', 'July'];
  // const labels = csv.map(item => item.points);


  const hardcodedData = {
    labels: [ '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '10' ],
    datasets: [
      {
        fill: true,
        label: 'Dataset',
        data: csv ? csv.map((item) => item.points) : [],
        borderColor: 'rgb(255,229,211)',
        backgroundColor: 'rgba(255,229,211, 0.7)',
      },
    ],
  };
  

  
  return (
    <div style={{ alignItems: 'center', justifyContent: 'center'}}>
      <video className='videoTag' autoPlay loop muted style={{width:"100%"}}>
        <source src={sample} type='video/mp4' />
      </video>

      <Card className="card"  style={{ backgroundColor: 'rgba(0,0,0, 0.5)' }} >
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Text className="text1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:"100%" , marginBottom:"1%" , color:'white'}}> Upload CSV</Form.Text>

        <Form.Control type="file" onChange={handleChange} />
      </Form.Group>

      <Button  type="submit" style={{width:"100%", background:"#ffeaf5", border:"#ffeaf5", color:"grey"}}>
        Submit
      </Button>
      </Form>
      </Card>

      <div style={{height:"20%" , width:"50%" , marginLeft:"25%"}}>
      <Line options={options} data={hardcodedData} />;
      </div>

    </div>
  );
}

export default App;
