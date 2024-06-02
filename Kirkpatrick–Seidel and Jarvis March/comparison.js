let chartInstance = null; // This variable will hold the chart instance

function calculateRuntime() {
    const n = parseInt(document.getElementById('point-count').value);

    if (n && n >= 3) {
        const kpsData = [];
        const jarvisData = [];

        for (let h = 3; h <= Math.min(1000, n); h++) {
           
            const kpsTime = n * Math.log(h) / Math.log(2); 
            kpsData.push(kpsTime);

            const jarvisTime = n * h;
            jarvisData.push(jarvisTime);
        }

        plotGraph(kpsData, jarvisData);
    } else {
        // Provide feedback if n is not valid or too small
        alert("Please enter a valid number of points (n >= 3).");
    }
}

function plotGraph(kpsData, jarvisData) {
    const hValues = Array.from({ length: Math.min(997, kpsData.length) }, (_, i) => i + 3);

    const ctx = document.getElementById('time-complexity-chart').getContext('2d');
    
   
    if (chartInstance) {
        chartInstance.destroy();
    }

    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hValues,
            datasets: [{
                label: 'KPS Algorithm',
                data: kpsData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Jarvis March Algorithm',
                data: jarvisData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { // 'yAxes' is now just 'y'
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time Complexity (No. of Operations)' // Title for the y-axis
                    }
                },
                x: { // 'xAxes' is now just 'x'
                    title: {
                        display: true,
                        text: 'Number of Points on Convex Hull (h)' // Title for the x-axis
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

