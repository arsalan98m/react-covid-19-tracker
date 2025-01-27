



import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../util";
import "./Map.css";

const Map = ({ countries, center, zoom, casesType }) => {

    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                {/* Loop through and draw circles on the screen */}
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map;


