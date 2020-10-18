import React, { useState, useEffect } from 'react';

import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import './App.css';


//Components
import InfoBox from "./components/InfoBoxes/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import LineGraph from "./components/LineGraph/LineGraph";
import "leaflet/dist/leaflet.css";

//Utilities
import { sortData, prettyPrintStat } from "./components/util";





// // API'S

// // https://disease.sh/v3/covid-19/countries


function App() {
  // STATE = How to write a variable in REACT <<<<<
  const [countries, setCountries] = useState([]); // [{name: "United States", value: "USA"}]
  const [country, setCountry] = useState('worldwide'); // PK, US, UK
  const [countryInfo, setCountryInfo] = useState({}); // {active: 12, recovered: 222, deaths: 5}
  const [tableData, setTableData] = useState([]); // [{countrt,cases,recovered, deaths},{}]
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases')
  const [barChart, setBarChart] = useState(true);

  //useEffect = Runs a piese of code based on given condition

  // Getting all Countries Data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then(data => {
        setCountryInfo(data);
        setBarChart(false);
      })
  }, [])

  // Getting Dropdow list Countries name and table data
  useEffect(() => {
    // The Code inside here will run once when the component loads and not again
    // async -> send a request, wait for it, do something with info

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, // United States, Pakistan 
              value: country.countryInfo.iso2 // USA, PK
            }
          ))

          setCountries(countries);

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
        })
    }

    getCountriesData();
  }, [])

  // Getting data on Dropdown Change
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;


    // API <<<<
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then(data => {

        // All of the data...
        // from the country response
        setCountry(countryCode);
        setCountryInfo(data)

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        if (countryCode === 'worldwide') {
          setBarChart(false)
        } else {
          setBarChart(true);
        }
      })

  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* Header */}
          <h1>COVID-19 Tracker</h1>

          {/* Title + Select input dropdown field */}
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show dropdown */}
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* InfoBoxes title="Coronavirus Cases" */}
          <InfoBox isRed active={casesType === 'cases'} onClick={e => setCasesType('cases')} title="Coronavirus cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />

          {/* InfoBoxes title="Coronavirus recoveries" */}
          <InfoBox active={casesType === 'recovered'} onClick={e => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />

          {/* InfoBoxes title="Coronavirus deaths */}
          <InfoBox isRed active={casesType === 'deaths'} onClick={e => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />

        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />


          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph barChart={barChart} countryData={countryInfo} className="app__graph" casesType={casesType} />

        </CardContent>
      </Card>

    </div>
  );
}

export default App;
