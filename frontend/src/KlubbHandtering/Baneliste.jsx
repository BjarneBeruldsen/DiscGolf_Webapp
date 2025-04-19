// Author: Bjarne Hovd Beruldsen & Abdinasir Ali
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
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Review from './Reviews';

    const BaneListe = ({ baner, rediger, klubbId }) => {
    const minne = useHistory();
    const { bruker, venter } = HentBruker();
    const [yrId, setYrId] = useState({});
    const [aktivBaneIndex, setAktivBaneIndex] = useState(0);
    const [aktivBane, setAktivBane] = useState(baner || []);
    const [filteredBaner, setFilteredBaner] = useState(baner || []);
    const [locationFilter, setLocationFilter] = useState('');
    const [hullFilter, setHullFilter] = useState('');
    const mapRef = useRef(null);
    const [brukerPos, setBrukerPos] = useState(null);
    const [visNæreBaner, setVisNæreBaner] = useState(false);
    const [avstandKm, setAvstandKm] = useState(50);

    useEffect(() => {
        if (navigator.geolocation && visNæreBaner) {
            navigator.geolocation.getCurrentPosition(
                position => setBrukerPos({lat: position.coords.latitude, lng: position.coords.longitude})
            );
        }
    }, [visNæreBaner]);

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
    
    useEffect(() => {
        if (!baner) return;
        
        let filtered = baner.filter(bane => 
            (!locationFilter || bane.plassering === locationFilter) && 
            (!hullFilter || 
                (hullFilter === "6+" ? 
                    (bane.hull?.length >= 6) : 
                    (bane.hull?.length === parseInt(hullFilter))
                )
            )
        );
        
        if (visNæreBaner && brukerPos && filtered.length > 0) {
            filtered = filtered.filter(bane => {
                if (!bane.hull?.[0]?.startLatitude) return false;
                const dist = Math.sqrt(Math.pow(bane.hull[0].startLatitude - brukerPos.lat, 2) + 
                                     Math.pow(bane.hull[0].startLongitude - brukerPos.lng, 2)) * 111;
                return dist <= avstandKm;
            });
        }
        setFilteredBaner(filtered);
        setAktivBane(filtered[aktivBaneIndex] || filtered[0] || null);

        if (filtered.length === 0 || aktivBaneIndex >= filtered.length) {
            setAktivBaneIndex(0);
        }
    }, [baner, locationFilter, hullFilter, aktivBaneIndex, visNæreBaner, brukerPos, avstandKm]);

    const handleClick = (bane) => {
        if (bruker === null) {
            alert('logginn/registrer deg for å spille');
            minne.push('/Innlogging');
        } else if (!rediger) {
            minne.push(`/ScoreBoard/${bane._id}`); 
        } else {
            minne.push(`/RedigerBane/${klubbId}/${bane._id}`);
        }
    };
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

        if (mapRef.current) return;
        const map = new mapboxgl.Map({
            container: 'mapContainer',
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [
                aktivBane?.hull?.[0]?.startLongitude || 9.059,
                aktivBane?.hull?.[0]?.startLatitude || 59.409
            ],
            zoom: 16.5,
        });

        mapRef.current = map;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });

        map.addControl(geocoder);

        map.on('load', () => {

            if (brukerPos) {
                new mapboxgl.Marker({color: '#4285F4'})
                    .setLngLat([brukerPos.lng, brukerPos.lat])
                    .addTo(map);
            }
            
            baner.forEach((bane, baneIndex) => {
                const hull = bane?.hull || [];
       const coordinates = [];

        hull.forEach(({ startLatitude, startLongitude, sluttLatitude, sluttLongitude }, i) => {
            if (startLatitude && startLongitude) {
                const startEl = document.createElement('div');
                startEl.className = 'marker';
                startEl.style.backgroundImage = 'url("/disc.png")';
                startEl.style.width = `55px`;
                startEl.style.height = `55px`;
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
                endEl.style.backgroundImage = 'url("/kurv.png")';
                endEl.style.width = `55px`;
                endEl.style.height = `55px`;
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
                    const sourceId = `line-${baneIndex}`;
                    const layerId = `line-layer-${baneIndex}`;
                    
            if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
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
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': 'BLUE',
                        'line-width': 4,
                    },
                });
            }
        }
            });
        })

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [baner, rediger, aktivBane, brukerPos]);

    const baneYrId = yrId[aktivBane?._id] || "1-72837";

    return (
        <div className="p-4">
            <div className="filter-controls flex gap-4 mb-4">
                <div className="location-filter w-1/2">
                    <select
                        value={locationFilter}
                        onChange={(e) => {
                            setLocationFilter(e.target.value);
                            setVisNæreBaner(false);
                        }}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Alle baner</option>
                        {baner && [...new Set(baner.map(bane => bane.plassering))].filter(Boolean).map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                
                <div className="hull-filter w-1/2">
                    <select
                        value={hullFilter}
                        onChange={(e) => setHullFilter(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Alle hull</option>
                        <option value="1">1 hull</option>
                        <option value="2">2 hull</option>
                        <option value="3">3 hull</option>
                        <option value="4">4 hull</option>
                        <option value="5">5 hull</option>
                        <option value="6+">6+ hull</option>
                    </select>
                </div>
                
                <div className="near-filter w-1/3 flex space-x-2">
                    <select value={avstandKm} onChange={(e) => setAvstandKm(Number(e.target.value))} className="w-1/3 border rounded p-2">
                        <option value={10}>10km</option>
                        <option value={25}>25km</option>
                        <option value={50}>50km</option>
                        <option value={1000}>100km+</option>
                    </select>
                    <button
                        onClick={() => setVisNæreBaner(!visNæreBaner)}
                        className={`w-2/3 border rounded p-2 ${visNæreBaner ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                        {visNæreBaner ? 'Viser baner i nærheten' : 'Vis baner i nærheten'}
                    </button>
                </div>
            </div>
            
            <div className="bane-layout">
                <div className="bane-left">
                {(filteredBaner && filteredBaner.length > 0) ? (
                    <div className="space-y-4">
                        {filteredBaner.map((bane, index) => {
                            const antallHull = bane.hull ? bane.hull.length : 0;
                            return (
                                <div
                                    key={bane._id || index}
                                    className={`border rounded-lg p-4 cursor-pointer ${aktivBaneIndex === index ? "bg-gray-50" : ""}`}
                                    onClick={() => {
                                            setAktivBane(filteredBaner[index]);
                                            setAktivBaneIndex(index);
                                        }}
                                >
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
                                Værvarsel for {aktivBane?.baneNavn || "valgt bane"}
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
                        {/*Author: Ylli Ujkani*/}
                        {aktivBane && aktivBane._id && (
                            <div className="border rounded-lg p-4 bg-white mt-6">
                                <Review baneId={aktivBane._id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaneListe;