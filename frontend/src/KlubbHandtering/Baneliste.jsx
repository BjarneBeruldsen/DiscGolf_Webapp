// Author: Bjarne Hovd Beruldsen
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const BaneListe = ({ baner, rediger, klubbId }) => {
    const minne = useHistory();
    const { bruker, venter } = HentBruker();

    const handleClick = (bane) => {
        if(bruker === null) {
            alert('logginn/registrer deg for å spille');
            minne.push('/Innlogging');
        }
        else if(!rediger) {
            minne.push(`/ScoreBoard/${bane._id}`); 
        }
        else {
            minne.push(`/RedigerBane/${klubbId}/${bane._id}`); 
        }
    }

    useEffect(() => {
        if (!baner) return;
        console.log(rediger)
        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";
        baner.forEach((bane, index) => {
        const mapContainer = document.getElementById(`map-${index}`);
        if (!mapContainer) return;
        
    
        const map = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [bane.hull?.[0]?.startLongitude || 9.059, bane.hull?.[0]?.startLatitude || 59.409],
        zoom: 14,
        })
    
        bane.hull?.forEach(({ startLatitude, startLongitude, sluttLatitude, sluttLongitude }) => {
            if (startLatitude && startLongitude) {
                new mapboxgl.Marker({ color: "gray" })
                   .setLngLat([startLongitude, startLatitude])
                   .addTo(map);
                        
               }
            if (sluttLatitude && sluttLongitude) {
                new mapboxgl.Marker({ color: "green" })
                   .setLngLat([sluttLongitude, sluttLatitude])
                   .addTo(map);         
            }
        });
    });
    }, [baner, rediger]);

    return ( 
        <div>
            {baner && baner.length > 0 ? (
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 lg-grid-cols-2 gap-6">
                        {baner.map((bane, index) => {
                            const antallHull = bane.hull ? bane.hull.length : 0;
                            return (
                                <div className="bg-white rounded-lg shadow-sm p-4 m-4 md:w-100 w-80" key={index}>
                                    <div className="topplinje border-b-2 flex justify-between text-xl font-bold ">
                                        <p>{bane.baneNavn}</p>
                                        <p className="pl-20">Rating:5/10</p> {/*Kommer senere..*/}
                                    </div>
                                    <div className="hullVanskelighet border-b flex justify-between text-m my-4">
                                        <p>Hull: {antallHull}</p>
                                        <p className="pl-20">Nivå: {bane.vanskelighet}</p> 
                                    </div>
                                    <div>
                                        <iframe src="https://www.yr.no/nb/innhold/1-43228/card.html" frameborder="0"
                                            className="w-full h-[365px] pointer-events-none"
                                        ></iframe>
                                        <div id={`map-${index}`} className="w-full h-100" />
                                    
                                    </div>
                                    <div className="nederstelinje inline-block">
                                        <div className="beskrivelse pr-4 wrap">
                                            <p>{bane.beskrivelse}</p>
                                            <div className="knapp">
                                                {!rediger && (
                                                    <button type="submit" onClick={() => handleClick(bane)} className="py-2 px-2 bg-gray-500 rounded-lg text-sm text-white mt-2 hover:bg-gray-400">Spill</button>
                                                )}
                                                {rediger && (
                                                    <button type="submit" onClick={() => handleClick(bane)} className="py-2 px-2 bg-gray-500 rounded-lg text-sm text-white mt-2 hover:bg-gray-400">Rediger</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className='flex justify-center'>
                    <h1>Ingen baner tilgjengelig...</h1>
                </div>
            )}
        </div> 
    );
};
 
export default BaneListe;