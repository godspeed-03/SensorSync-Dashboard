import React, { useEffect, useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Chart from 'chart.js/auto'; // Import Chart.js

function App() {
  const [globalData, setGlobalData] = useState([]);
  const chartRef = useRef(null);
  const localData = localStorage.getItem('globalData');


  useEffect(() => {
    const fetchData = async () => {
      try {
      const firebaseConfig = {
  apiKey: "AIzaSyBte33cXlpB8gKnGRUwvnKduri_yMkK3pU",
  authDomain: "welding-b03da.firebaseapp.com",
  projectId: "welding-b03da",
  storageBucket: "welding-b03da.appspot.com",
  messagingSenderId: "138546934609",
  appId: "1:138546934609:web:30cbae1abd0cb095135970",
  measurementId: "G-15D041D51M"
};

          const app = initializeApp(firebaseConfig);
          const db = getFirestore(app);
          const auth = getAuth();
          
          await signInWithEmailAndPassword(auth, "admin@gmail.com", "admintest");
          
          const querySnapshot = await getDocs(collection(db, "a1"));
          const tempDataArray = [];
          querySnapshot.forEach((doc) => {
            tempDataArray.push({ id: doc.id, ...doc.data() });
          });
          tempDataArray.sort((a, b) => {
            // Extract numeric part of id
            const aNum = parseInt(a.id.replace('b', ''));
            const bNum = parseInt(b.id.replace('b', ''));
            // Compare numeric parts
            return aNum - bNum;
          });
    
          setGlobalData(tempDataArray);
          localStorage.setItem('globalData', JSON.stringify(tempDataArray)); // Update local storage
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30*60*1000); // Fetch data every 30 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (globalData.length > 0) {
      renderChart();
    }
  }, [globalData]);

  const renderChart = () => {
    const labels = globalData.map(item => item.id);
    const data = globalData.map(item => item.analogValue);

    if (chartRef.current !== null) {
      chartRef.current.destroy(); // Destroy the existing chart
    }

    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Data',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            color: '#ffffff',
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'category' // Ensure x-axis type is 'category'
          }
        }
      }
    };

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, chartConfig); // Store reference to the chart instance
  };

  return (
    <div className='overflow-hidden flex flex-col justify-center items-center'>
      <h1 className='text-2xl text-white'>Welding Chart</h1>
      <div className=''>
        <canvas className='h-[90vh] ' id="myChart"></canvas>
      </div>
    </div>
  );
}

export default App;
