import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import numeral from "numeral";


// api
// https://disease.sh/v3/covid-19/historical/all?lastdays=120

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    parser: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            };
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    }


    return chartData

}

const LineGraph = ({ countryData, casesType, barChart, ...props }) => {
    const [data, setData] = useState({});




    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {

                    const chartData = buildChartData(data, casesType);
                    setData(chartData)

                })
        }

        fetchData();

    }, [casesType])





    return (
        <div className={props.className} >
            {barChart ? (
                <Bar
                    data={{
                        labels: ['Infected', 'Recovered', 'Deaths'],
                        datasets: [
                            {
                                borderColor: "#CC1034",
                                label: 'People',
                                backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                                data: [countryData.cases, countryData.recovered, countryData.deaths],
                            },
                        ],
                    }}
                    options={{
                        legend: { display: false },
                        title: { display: true, text: `Current state in ${countryData.country}` },
                    }}
                />
            ) : < Line
                    data={{

                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }
                    }
                    options={options}
                />}

            {/* {countryData && (<Bar
                data={{
                    labels: ['Infected', 'Recovered', 'Deaths'],
                    datasets: [
                        {
                            borderColor: "#CC1034",
                            label: 'People',
                            backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                            data: [countryData.cases, countryData.recovered, countryData.deaths],
                        },
                    ],
                }}
                options={{
                    legend: { display: false },
                    title: { display: true, text: `Current state in ${countryData.country}` },
                }}
            />)
            } */}
        </div>
    )
}

export default LineGraph;