// Author: Bjarne Hovd Beruldsen & Abdinasir Ali
// ObZoner er ikke helt funskjonell, spessielt på baneliste så blir ikke alle zoner vist, men de blir oprettet korrekt

/*
Denne filen inneholder komponentene for å vise baner og deres detaljer. 
Den er gjennbrukt på flere sider i applikasjonen, 
inkludert klubbens side og redigeringsside.
 */

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
import { useTranslation } from 'react-i18next';


const BaneListe = ({ baner, rediger, klubbId }) => {
    const { t } = useTranslation();
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
    const [visObZoner, setVisObZoner] = useState(true); 
    const [banerMedObZoner, setBanerMedObZoner] = useState([]);

    useEffect(() => {
        // Henter brukerens posisjon hvis "Vis baner i nærheten" er aktivert
        if (navigator.geolocation && visNæreBaner) {
            navigator.geolocation.getCurrentPosition(
                position => setBrukerPos({lat: position.coords.latitude, lng: position.coords.longitude})
            );
        }
    }, [visNæreBaner]);

    useEffect(() => {
         // Henter Yr-IDs for baner basert på plassering
         // yr idene i db er generert av copilot
         // kunne blir gjort manuelt men hadde flere timer
        const hentYrIdForBaner = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/byer`);
                const byer = await response.json();

                const yr_Id = {};
                baner.forEach((bane) => {
                    const matchetBy = byer.find((by) =>
                        bane.plassering.toLowerCase().includes(by.navn.toLowerCase())
                      );
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
        // Filtrerer baner basert på plassering, antall hull og brukerens posisjon
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
        // Filtrerer baner basert på brukerens posisjon 
        // brukte copilot på regning av distanse, med mine tilpassninger
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

    //Linker til scoreboard eller redigeringsside avhengig av om redigeringsmodus er aktivert
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
        setAktivBane(baner[0]);
    
        if (baner.length <= aktivBaneIndex) {
            setAktivBaneIndex(0);
        }
    }, [baner]); 
    

    useEffect(() => {
        // oppdaterer Mapbox-kartet med baner, OB-soner og brukerens posisjon
        if (!baner || baner.length === 0) return;

        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
        
        const map = new mapboxgl.Map({
            container: 'mapContainer',
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [
                aktivBane?.hull?.[0]?.startLongitude || 9.059,
                aktivBane?.hull?.[0]?.startLatitude || 59.409
            ],
            zoom: 14.5,
        });

        mapRef.current = map;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });

        map.addControl(geocoder);

        map.on('load', () => {

        
            baner.forEach((bane, baneIndex) => {
                const hull = bane?.hull || [];
       const coordinates = [];

        hull.forEach(({ startLatitude, startLongitude, sluttLatitude, sluttLongitude, obZoner }, i) => {
             // Legger til start- og sluttmarkører for hvert hull
            if (startLatitude && startLongitude) {
                const startEl = document.createElement('div');
                startEl.className = 'marker';
                startEl.style.backgroundImage = 'url("/disc.png")';
                startEl.style.width = `55px`;
                startEl.style.height = `55px`;
                startEl.style.backgroundSize = '100%';
                startEl.style.borderRadius = '50%';
                startEl.style.cursor = 'pointer';

                const popup = new mapboxgl.Popup({ offset: 10 })
                .setHTML(`<h3>${bane.baneNavn}</h3><p>${bane.beskrivelse}</p>`);
    
                new mapboxgl.Marker(startEl)
                .setLngLat([startLongitude, startLatitude])
                .setPopup(popup)  
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

                const popup = new mapboxgl.Popup({ offset: 10 })
                .setHTML(`<h3>${bane.baneNavn}</h3><p>${bane.beskrivelse}</p><p>Hull: ${i + 1}</p>`);
                new mapboxgl.Marker(endEl)
                .setLngLat([sluttLongitude, sluttLatitude])
                .setPopup(popup)  
                    .addTo(map);

                coordinates.push([sluttLongitude, sluttLatitude]);
            }

                   // Legger til OB-soner på kartet brukte copilot her, med mine tilpassninger
                    if (visObZoner && obZoner && obZoner.length > 0) {
                        obZoner.forEach((obZone, i) => {
                            const sourceId = `ob-${baneIndex}-${i}-${i}`;
                            const layerId = `ob-layer-${baneIndex}-${i}-${i}`;
                            
                            if (!map.getSource(sourceId)) {
                                map.addSource(sourceId, {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Polygon',
                                            coordinates: [obZone.coordinates]
                                        }
                                    }
                                });
                            
                                map.addLayer({
                                    id: layerId,
                                    type: 'fill',
                                    source: sourceId,
                                    paint: {
                                        'fill-color': '#FF0000',
                                        'fill-opacity': 0.3
                                    }
                                });
                            }
                        });
            }
        });
        // Legger til linjer mellom hullene
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
        });

        return () => {
            // Fjerner kartet når komponenten blir kjørt
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [baner, rediger, aktivBane, brukerPos, visObZoner]);

    const baneYrId = yrId[aktivBane?._id] || "1-72837"; // yr-id-ene i db er generert av copilot
                                                        // kunne blitt gjort manuelt men hadde tatt lengre tid
    
    
    const toggleObZoner = () => {
        setVisObZoner(!visObZoner);
    };

    return (
        <div className="p-6 bg-white border-black shadow-[0_1px_12px_rgba(0,0,0,0.1)] min-h-screen">
            <div className="filter-controls flex flex-col md:flex-row gap-4 mb-6">
                <div className="location-filter w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Velg bane')}</label>
                    <select
                        value={locationFilter}
                        onChange={(e) => {
                            setLocationFilter(e.target.value);
                            setVisNæreBaner(false);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">{t('Alle baner')}</option>
                        {baner && [...new Set(baner.map(bane => bane.plassering))].filter(Boolean).map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                <div className="hull-filter w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Antall hull')}</label>
                    <select
                        value={hullFilter}
                        onChange={(e) => setHullFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">{t('Alle hull')}</option>
                        <option value="1">{t('1 hull')}</option>
                        <option value="2">{t('2 hull')}</option>
                        <option value="3">{t('3 hull')}</option>
                        <option value="4">{t('4 hull')}</option>
                        <option value="5">{t('5 hull')}</option>
                        <option value="6+">{t('6+ hull')}</option>
                    </select>
                </div>
            
            <div className="near-filter w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('Avstand')}</label>
                <div className="flex space-x-2">
                    <select
                        value={avstandKm} 
                        onChange={(e) => setAvstandKm(Number(e.target.value))} 
                        className="w-1/3 border border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={10}>{t('10km')}</option>
                        <option value={25}>{t('25km')}</option>
                        <option value={50}>{t('50km')}</option>
                       <option value={1000}>{t('100km+')}</option>
                    </select>
                    <button
                        onClick={() => setVisNæreBaner(!visNæreBaner)}
                        className={`w-2/3 rounded-lg p-2.5 font-medium ${visNæreBaner ? 'active' : ''}`}
                    >
                        {visNæreBaner ? t('Viser baner i nærheten') : t('Vis baner i nærheten')}
                    </button>
                    </div>
                </div>
            </div>
            <div className="bane-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bane-left lg:col-span-2">
                {(filteredBaner && filteredBaner.length > 0) ? (
                    <div className="space-y-4">
                        {filteredBaner.map((bane, index) => {
                            const antallHull = bane.hull ? bane.hull.length : 0;
                            return (
                                <div
                                    key={bane._id || index}
                                    className={`border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md ${aktivBaneIndex === index ? "bg-blue-50 border-blue-200 shadow-md" : "bg-white"}`}
                                    onClick={() => {
                                            setAktivBane(filteredBaner[index]);
                                            setAktivBaneIndex(index);
                                        }}
                                >
                                    <div className="topplinje border-b border-gray-200 flex justify-between items-center pb-3 mb-3">
                                        <h3 className="text-xl font-bold text-gray-800">{bane.baneNavn}</h3>
                                    </div>  
                                    <div className="hullVanskelighet flex flex-wrap justify-between text-sm text-gray-600 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                            <span>{t('Antall hull:')} {antallHull}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{t('Tilstand:')} <span className="text-green-500 font-medium">{t('God')}</span></span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>{t('Nivå:')} {bane.vanskelighet}</span>
                                        </div>  
                                    </div>
                                    <div className="nederstelinje ">
                                        <div className="beskrivelse ">
                                            <p className="text-gray-600 mb-4">{bane.beskrivelse}</p>
                                            <div className="flex justify-end">
                                                {!rediger && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleClick(bane)} 
                                                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white  shadow-sm">{t('Spill')}</button>
                                                )}
                                                {rediger && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleClick(bane)} 
                                                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white shadow-sm">{t('Rediger')}</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                    <div className="flex justify-center items-center h-32 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="text-gray-500 font-medium">{t('Ingen baner tilgjengelig...')}</h1>
                        </div>
                </div>
                )}
            </div>
            <div className="bane-right">
                <div className="sticky top-6 space-y-6">
                    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            {t('Værvarsel for')} {aktivBane?.baneNavn || t('valgt bane')}
                        </h3>
                        <div className="h-[350px] w-full">
                        <div className="relative w-full h-[350px] pb-[30%]">
                            <iframe
                                src={`https://www.yr.no/nb/innhold/${baneYrId}/card.html`}                                    frameBorder="0"
                                className="absolute top-0 left-0 w-full h-full rounded-xxl pointer-events-none"
                                title={t('Værmelding')}
                            />
                        </div>
                        </div>
                      
                    </div>
                        <div className="h-96 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div id="mapContainer" className="w-full h-full"></div>
                        </div>
                        {/*Author: Ylli Ujkani*/}
                    {aktivBane && aktivBane._id && (
                        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                {t('Anmeldelser')}
                            </h3>
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