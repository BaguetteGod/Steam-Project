// Calculate standard deviation of an array
function getVariance (array) {
    const n = array.length;
    mean = Math.floor(array.reduce((a, b) => a + b) / n);
    return Math.floor(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

// Calculate standard deviation of an array
function getStandardDeviation (array) {
    const n = array.length;
    mean = Math.floor(array.reduce((a, b) => a + b) / n);
    return Math.floor(Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n));
}

// Calculate median of an array
function getMedian(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

// Calculate range of an array
function getRange (array) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    return Math.floor(max - min);
}

// Create donut chart for reviews
function createDonutChart (posRev, negRev) {
    let labels = ['Positive Reviews', 'Negative Reviews']
    let ctx = document.getElementById('donut').getContext('2d');
    let myDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    labels: 'Reviews',
                    data: [posRev, negRev],
                    backgroundColor: [
                        'rgba(2, 119, 189, 1)',
                        'rgba(221, 44, 0, 1)'
                    ],
                    borderColor: [
                        'rgba(2, 119, 189, 1)',
                        'rgba(221, 44, 0, 1)'
                    ],
                    hoverOffset: 4
                },
            ],
        }
    })
}

// Create gaussian distribution chart for game
function createGameChart(array) {
    let data2 = [];
    let labels = [];
    let maxVal = Math.max(...array);
    for(let i = 1; i < 11; i++) {
        if(i === 1) {
            labels.push(0);
        } else {
            labels.push(maxVal * 0.1 * i);
        }
    } 

    for(x in array){
        let y = gaussian(x);
        data2.push({ x , y })
    }

    function gaussian(x) {
        const gaussianConstant = 1 / (standardDev * Math.sqrt(2 * Math.PI));
        x = (x - mean) / standardDev;    
        return (gaussianConstant * Math.exp(-0.5 * x * x));
    }

    while(data2.length > 120) data2 = data2.filter((e, i) =>  i % 2 == 0);
    let ctx = document.getElementById('myChart').getContext('2d');
    let myLineChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Median Playtime',
                    data: data2,
                    backgroundColor: 'rgba(221, 44, 0, 0.2)',
                    borderColor: 'rgba(221, 44, 0, 1)',
                    borderWidth: 2,
                    showLine: true,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    lineTension: 0.4
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                  display: false
                }
            },
            scales: {
                x: {
                    labels,
                    offset: false,
                    display: true,
                    max: Math.ceil(maxVal),
                    ticks: {
                        autoSkip: false,
                        stepSize: Math.ceil(maxVal*0.05)
                    },
                    title: {
                        display: true,
                        text: 'Playtimes in hours'
                    }
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                    },
                    title: {
                        display: true,
                        text: 'Probability Density'
                    }
                },
            },
        },
    });
}

// Calculate the spread of playtime in ranges for a game
function calcDataSpread (array) {
    let maxValue = Math.max(...array) / 60;
    let newArray = [];
    histogramData.length = 0;
    for(const k in array){
        let cvOne = array[k] / 60;
        if (cvOne >= 0 && cvOne <= (maxValue * 0.1)) {
            newArray.push(cvOne);
        } else continue;
    }
    let maxValueTwo = Math.max(...newArray);
    histogramData.push({x:0, y: 0});
    for(let i = 1; i < 21; i++) {
        histogramData.push({x: Math.ceil(maxValueTwo * 0.05 * i), y: 0});
    } 
    for(const j in newArray) {
        let cvTwo = newArray[j];
        if (cvTwo >= 0 && cvTwo <= (maxValueTwo * 0.05)) {
            histogramData[0]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.05) && cvTwo <= (maxValueTwo * 0.1)) {
            histogramData[1]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.1) && cvTwo <= (maxValueTwo * 0.15)) {
            histogramData[2]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.15) && cvTwo <= (maxValueTwo * 0.2)) {
            histogramData[3]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.2) && cvTwo <= (maxValueTwo * 0.25)) {
            histogramData[4]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.25) && cvTwo <= (maxValueTwo * 0.3)) {
            histogramData[5]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.3) && cvTwo <= (maxValueTwo * 0.35)) {
            histogramData[6]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.35) && cvTwo <= (maxValueTwo * 0.4)) {
            histogramData[7]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.4) && cvTwo <= (maxValueTwo * 0.45)) {
            histogramData[8]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.45) && cvTwo <= maxValueTwo * 0.5) {
            histogramData[9]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.5) && cvTwo <= (maxValueTwo * 0.55)) {
            histogramData[10]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.55) && cvTwo <= (maxValueTwo * 0.6)) {
            histogramData[11]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.6) && cvTwo <= (maxValueTwo * 0.65)) {
            histogramData[12]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.65) && cvTwo <= (maxValueTwo * 0.7)) {
            histogramData[13]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.7) && cvTwo <= (maxValueTwo * 0.75)) {
            histogramData[14]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.75) && cvTwo <= (maxValueTwo * 0.8)) {
            histogramData[15]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.8) && cvTwo <= (maxValueTwo * 0.85)) {
            histogramData[16]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.85) && cvTwo <= (maxValueTwo * 0.9)) {
            histogramData[17]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.9) && cvTwo <= maxValueTwo * 0.95) {
            histogramData[18]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.95) && cvTwo <= maxValueTwo) {
            histogramData[19]['y'] ++;
        }  
    } 
    return newArray;   
}

// Create histogram for spread of playtime for a game
function createHistogram(dict) {
    let labels = [];
    let data = [];
    for (const i in dict) {
        labels.push(dict[i]['x']);
    }
    for (const j in dict) {
        data.push(dict[j]['y']);
    }
    const ctx = document.getElementById('histogram').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Frequency',
                    data: data,
                    backgroundColor: 'rgba(221, 44, 0, 0.1)',
                    borderColor: 'rgba(221, 44, 0, 1)',
                    borderWidth: 2,
                    barPercentage: 1,
                    categoryPercentage: 1.0
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                    callbacks: {
                        title: (TooltipItem, data) => {
                            let title = TooltipItem[0].x;
                            return title
                        },
                    }
                }
            },
            scales: {
                x1: {
                    display: false,
                    max: 19,
                },
                x2: {
                    labels,
                    offset: false,
                    display: true,
                    ticks: {
                        autoSkip: false,
                    },
                    title: {
                        display: true,
                        text: 'Playtimes in hours'
                    }
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                    },
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
            },
        },
    });
}

