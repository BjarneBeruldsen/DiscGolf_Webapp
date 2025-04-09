// Author: Bjarne Hovd Beruldsen
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";
import mapboxgl from "mapbox-gl";
import { v4 as uuidv4 } from 'uuid';
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../App.css';

    const BaneListe = ({ baner, rediger, klubbId }) => {
    const minne = useHistory();
    const { bruker, venter } = HentBruker();
    const [yrId, setYrId] = useState({});
    const [aktivBaneIndex, setAktivBaneIndex] = useState(0);
    const [aktivBane, setAktivBane] = useState(baner || []);


    useEffect(() => {
        const hentYrIdForBaner = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/byer`);
                const byer = await response.json();

                const yr_Id = {};
                baner.forEach((bane) => {
                    const matchetBy = byer.find((by) => by.navn === bane.plassering);
                    if (matchetBy) {
                        yr_Id[bane._id] = matchetBy.yr_id;
                    }
                });
                setYrId(yr_Id);
            } catch (error) {
                console.error('Feil ved henting av byer:', error);
            }
        };

        hentYrIdForBaner();
    }, [baner]);

    const handleClick = (bane) => {
        const rundeId = uuidv4(); // Generer et unikt rundeId for hver bane

        if(bruker === null) {
            alert('logginn/registrer deg for å spille');
            minne.push('/Innlogging');
        }
        else if(!rediger) {
            minne.push(`/ScoreBoard/${bane._id}/${rundeId}`); 
        }
        else {
            minne.push(`/RedigerBane/${klubbId}/${bane._id}`); 
        }
    }
    useEffect(() => {
        if (!baner) return;
        setAktivBane(baner);
    
        if (baner.length <= aktivBaneIndex) {
            setAktivBaneIndex(0);
        }
    }, [baner]); 
    

    useEffect(() => {
        if (!baner || baner.length === 0) return;

        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";

        const map = new mapboxgl.Map({
            container: 'mapContainer',
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [
                baner[aktivBaneIndex]?.hull?.[0]?.startLongitude || 9.059,
                baner[aktivBaneIndex]?.hull?.[0]?.startLatitude || 59.409
            ],
            zoom: 14,
        })

        const hull = baner[aktivBaneIndex]?.hull || [];
        const coordinates = [];

        hull.forEach(({ startLatitude, startLongitude, sluttLatitude, sluttLongitude }, i) => {
            if (startLatitude && startLongitude) {
                const startEl = document.createElement('div');
                startEl.className = 'marker';
                startEl.style.backgroundImage = `url(https://cdn.discordapp.com/attachments/934547779773153340/1359127691684483072/2826998-removebg-preview.png?ex=67f659cd&is=67f5084d&hm=a9c531dd925933c9ee9cb2b2ddf0a1d95966270f0ee316d41d97d72bd98a6cbd&)`;
                startEl.style.width = `50px`;
                startEl.style.height = `50px`;
                startEl.style.backgroundSize = '100%';
                startEl.style.borderRadius = '50%';
                startEl.style.cursor = 'pointer';

                new mapboxgl.Marker(startEl)
                    .setLngLat([startLongitude, startLatitude])
                    .addTo(map);

                coordinates.push([startLongitude, startLatitude]);
            }

            if (sluttLatitude && sluttLongitude) {
                const endEl = document.createElement('div');
                endEl.className = 'marker';
                endEl.style.backgroundImage = `url(https://cdn.discordapp.com/attachments/934547779773153340/1359125685070987284/BJYGBgwH78PGmlpaWn7tcLkfuqkXm3bt3menpaWlmZiazvLz8mZjdbv94r0SSpFQqJdfX10uNjY2yzeTp6am5ObmZmnfvn3J2dnZxfn5cSFCxdEcOEDAQQsKEDQsGDTKRkBBBBAAAG9BAgaekmzHwQQQAABBCwoQNCwYNMpGQEEEEAAAb0ECBp6SbMfBBBAAAEELChA0LBg0ykZAQQQQAABvQQIGnpJsx8EEEAAAQQsKEDQsGDTKRkBBBBAAAG9BAgaekmzHwQQQAABBCwoQNCwYNMpGQEEEEAAAb0ECBp6SbMfBBBAAAEELChA0LBg0ykZAQQQQAABvQQIGnpJsx8EEEAAAQQsKEDQsGDTKRkBBBBAAAG9BAgaekmzHwQQQAABBCwoQNCwYNMpGQEEEEAAAb0ECBp6SbMfBBBAAAEELChA0LBg0ykZAQQQQAABvQTB2rEekv1VHZjAAAAAElFTkSuQmCC.png?ex=67f657ee&is=67f5066e&hm=af5d21c82f779b5feacacd22fc21391642dfc3321f81d4ed22d4450c4ad5c6fa&)`;
                endEl.style.width = `50px`;
                endEl.style.height = `50px`;
                endEl.style.backgroundSize = '100%';
                endEl.style.borderRadius = '50%';
                endEl.style.cursor = 'pointer';

                new mapboxgl.Marker(endEl)
                    .setLngLat([sluttLongitude, sluttLatitude])
                    .addTo(map);

                coordinates.push([sluttLongitude, sluttLatitude]);
            }
        });

        if (coordinates.length > 1) {
            map.on('load', () => {
                map.addSource('line', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates,
                        },
                    },
                });

                map.addLayer({
                    id: 'line-layer',
                    type: 'line',
                    source: 'line',
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': 'BLUE',
                        'line-width': 4,
                    },
                });
            });
        }

        return () => map.remove();
    }, [baner,rediger, aktivBaneIndex]);

    const baneYrId = yrId[aktivBane[aktivBaneIndex]?._id] || "1-72837";

    return (
        <div className="p-4">
            <div className="bane-layout">
                <div className="bane-left">
                {baner && baner.length > 0 ? (
                    <div className="space-y-4">
                        {baner.map((bane, index) => {
                            const antallHull = bane.hull ? bane.hull.length : 0;
                            return (
                                <div
                                    key={bane._id || index}
                                    className={`border rounded-lg p-4 cursor-pointer ${aktivBaneIndex === index ? "bg-gray-50" : ""}`}
                                    onClick={() => setAktivBaneIndex(index)}
                                >

                                    <div className="topplinje border-b-2 flex justify-between text-xl font-bold ">
                                        <p>{bane.baneNavn}</p>
                                        <p className="pl-20">Rating:5/10</p> {/*Kommer senere..*/}
                                    </div>
                                    <div className="hullVanskelighet border-b flex justify-between text-m my-4">
                                        <p>Antall hull: {antallHull}</p>
                                        <p>Tilstand: <span className="text-green-400">God</span></p>
                                        <p className="pl-20">Nivå: {bane.vanskelighet}</p>
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
                    ) : (
                        <div className='flex justify-center'>
                    <h1>Ingen baner tilgjengelig...</h1>
                </div>
                    )}
                </div>
                <div className="bane-right">
                    <div className="sticky space-y-4">
                        <div className="border rounded-lg p-4 bg-white">
                            <h3 className="text-lg font-semibold mb-2">
                            Værvarsel for {aktivBane[aktivBaneIndex]?.baneNavn || "valgt bane"}
                            </h3>
                            <iframe
                                src={`https://www.yr.no/nb/innhold/${baneYrId}/card.html`}
                                frameBorder="0"
                                className="w-full h-[290px]"
                                title="Værmelding"
                            />
                        </div>
    
                        <div className="h-[500px] rounded-lg border mt-6">
                            <div id="mapContainer" className="w-full h-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaneListe;