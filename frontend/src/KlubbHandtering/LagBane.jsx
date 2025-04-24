// Author: Bjarne Hovd Beruldsen & Abdinasir Ali
import { useState } from 'react';
import { validering } from './validation';
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import InfoTooltip from './infoTooltip';
import { useTranslation } from 'react-i18next';

const LagBane = ({ klubbId, onBaneLagtTil }) => {
    const { t } = useTranslation();
    const [hullNr, setHullNr] = useState(1);
    const [avstand, setAvstand] = useState('');
    const [par, setPar] = useState('');
    const [baneNavn, setBaneNavn] = useState('');
    const [vanskelighet, setVanskelighet] = useState('');
    const [beskrivelse, setBeskrivelse] = useState('');
    const [plassering, setPlassering] = useState('');
    const [hull, setHull] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');
    const [hullVisning, setHullVisning] = useState(true);
    const [baneVisning, setBaneVisning] = useState(false);
    const mapContainerRef = useRef(null);
    const[startPosisjon, setStartPosisjon] = useState({startLatitude:null, startLongitude:null});
    const[sluttPosisjon, setSluttPosisjon] =useState({sluttLatitude:null, sluttLongitude:null});
    const [obZoner, setObZoner] = useState([]);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        const nyttHull = { hullNr, avstand, par, 
            
            startLatitude: startPosisjon.startLatitude,
            startLongitude: startPosisjon.startLongitude,
            sluttLatitude: sluttPosisjon.sluttLatitude,
            sluttLongitude: sluttPosisjon.sluttLongitude
        };
        setHull([...hull, nyttHull]);
        setHullNr(hullNr + 1);
        setAvstand('');
        setPar('');
    };

    const handleLagreBane = () => {
        setErrorMelding('');
        if (hull.length < 2) {
            setErrorMelding('Du må legge til minst 2 hull før du kan lagre banen.');
            return;
        }
        try {
            validering(beskrivelse, 2, 60);
        }
        catch (error) {
            setErrorMelding(error.message + ' i beskrivelsen');
            return;
        }

        const nyBane = { baneNavn, hull, vanskelighet, beskrivelse, plassering, obZoner };

        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nyBane)
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Feil ved lagring av bane');
            } else {
                return response.json();
            }
        }).then((data) => {
            console.log('Ny bane lagt til', data);
            setHull([]);
            setHullNr(1);
            onBaneLagtTil();
        }).catch(error => {
            console.error('Feil ved lagring av bane:', error);
            setErrorMelding('Feil ved lagring av bane');
        });
        window.location.reload(false);
    };

    const handleVisning = (seksjon) => {
        if (seksjon === 'bane' && hull.length < 2) {
            setErrorMelding('Du må legge til minst 2 hull før du kan fullføre registreringen.');
            return;
        }
        setErrorMelding('');
        setHullVisning(seksjon === 'hull');
        setBaneVisning(seksjon === 'bane');
    };
      
    useEffect(() => {
        if (!mapContainerRef.current) return;
      
        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";
        const map = new mapboxgl.Map({
         container: mapContainerRef.current,
         style: "mapbox://styles/mapbox/satellite-streets-v12",
         center: [9.059,59.409 ],
         zoom: 15,
        });
      
        let startPunkt = null;
        let obKoordinater = []; 
        let obNr = 0;
      
        map.on("click", (e) => {
                   
            if (e.originalEvent.altKey) {
                const closed = [...obKoordinater, obKoordinater[0]];
                obKoordinater.push([e.lngLat.lng, e.lngLat.lat]);
                
                new mapboxgl.Marker({ color: "red", scale: 0.5 })
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .addTo(map);

                    if (obKoordinater.length > 2) {
                        const closed = [...obKoordinater, obKoordinater[0]];
                      
                        setObZoner(prev => [...prev, { coordinates: closed }]);
                        obKoordinater = [];
                      }  

                if (obKoordinater.length > 2) {
                    const obId = `ob-${obNr++}`;
                    
                    if (map.getSource(obId)) map.removeSource(obId);
                    map.addSource(obId, {
                        type: 'geojson',
                        data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [obKoordinater]
                            }
                        }
                    });
                    map.addLayer({
                        id: obId,
                        type: 'fill',
                        source: obId,
                        paint: {
                            'fill-color': '#FF0000',
                            'fill-opacity': 0.3
                            }
                    });
                    
                    setObZoner(prev => [...prev, { coordinates: closed }]);
                    obKoordinater = [];
                }
                return;  
            }
                
            const clickedPos = { latitude: e.lngLat.lat, longitude: e.lngLat.lng };

            
      
          if (!startPunkt) {

            setStartPosisjon({
                startLatitude: clickedPos.latitude,
                startLongitude: clickedPos.longitude,
                
              })

            
            startPunkt = [clickedPos.longitude, clickedPos.latitude];
            new mapboxgl.Marker({ color: "gray" })
            .setLngLat(startPunkt)
            .addTo(map)
          
            
          } else {

            setSluttPosisjon({
                sluttLatitude: clickedPos.latitude,
                sluttLongitude: clickedPos.longitude,
              })
           
           const stopPunkt = [clickedPos.longitude, clickedPos.latitude];
            new mapboxgl.Marker({ color: "green" }) 
            .setLngLat(stopPunkt)
            .addTo(map);

            if (map.getSource("hole-path")){
              map.removeLayer("hole-path");
              map.removeSource("hole-path");
            }
      
          
            map.addSource("hole-path",{
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: [startPunkt, stopPunkt],
                },
              },
            });
      
            map.addLayer({
              id: "hole-path",
              type: "line",
              source: "hole-path",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#ff7f00",
                "line-width": 4,
              },
            });
      
           
            startPunkt = null;
          }
        });
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
          }
        );
        map.addControl(geocoder);
        
        let lokasjon = null;

        geocoder.on('result', function (e) {
            lokasjon = e.result.place_name;
            console.log("Navn på sted:", lokasjon); 
        });

        return () => {
          map.remove();
          map.off("click");
        };
      }, []);

    return (
        <div className="lagbane-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container flex justify-center">
            <div className='bg-gray-100 rounded-lg shadow p-4'>
                {hullVisning && (
                <div>
                    <div className='border rounded-lg font-bold text-xl bg-white flex justify-center py-4'>
                        <h2>{t('Hull')}: { hullNr }</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 mt-4 md:w-150 w-100">
                        <label className='block font-medium mt-2'>
                            {t('Avstand')}:
                        </label>
                        <input 
                            type="number" 
                            min="1"
                            max="1000" //Vil tro at ingen er lengre enn 1km. 
                            required
                            value={avstand}
                            onChange={(e) => setAvstand(e.target.value)}
                            className="w-full border border-gray-600 rounded-lg shadow-sm
                                    px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                        />
                        <label className='block font-medium mt-2'>
                            {t('Par')}:
                        </label>
                        <input 
                            type="number" 
                            min="1"
                            max="10" 
                            required
                            value={par}
                            onChange={(e) => setPar(e.target.value)}
                            className="w-full border border-gray-600 rounded-lg shadow-sm
                                    px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                        />
                        <div className='flex items-center justify-between border rounded-lg px-4 py-2 mt-4'>
                            <label className='block font-medium mt-2'>
                                {t('Start og sluttposisjon')}:
                            </label>
                            <InfoTooltip tekst={
                                <>
                                    {t('Trykk en gang for å velge startposisjon (utslagssted).')}<br />
                                    {t('Deretter trykk en gang for å velge sluttposisjon (kurv).')}<br />
                                    {t('Hold Alt og klikk for å markere OB-soner (min/maks 3 punkter for å opprette en sone).')}<br />
                                </>
                                } />
                        </div>
                        <div>
                        <div ref={mapContainerRef} className="w-full h-100" />
                        </div>

                        <div className='flex items-center justify-between border rounded-lg px-4 py-2 mt-4'>
                            <label className='block font-medium mt-2'>
                                {t('Legg til hull')}:
                            </label>
                            <button type="submit" className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow px-4 py-2">+</button>
                        </div>
                        <button onClick={() => handleVisning("bane")} className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow mx-2 px-4 py-2 mt-4">{t('Fullfør Registrering')}</button>
                    </form>
                </div>
                )}
                {baneVisning && (
                <div className='bunn-panel m-4'>
                    <form>
                        <label className='block font-medium mt-2'>
                            {t('Navn')}:
                        </label>
                        <input 
                            type="text"
                            required
                            value={baneNavn}
                            onChange={(e) => setBaneNavn(e.target.value)}
                            className="w-full border border-gray-600 rounded-lg shadow-sm
                                    px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                        />
                        <label>
                            {t('Vanskelighetsgrad')}:
                        </label>
                        <select id="vanskelighetsgrad" name='vanskelighetsgrad' value={vanskelighet} onChange={(e) => setVanskelighet(e.target.value)} className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500 font-serif">
                            <option value="Lett">{t('Lett')}</option>
                            <option value="Middels">{t('Middels')}</option>
                            <option value="Vanskelig">{t('Vanskelig')}</option>
                        </select>
                        <label>
                            {t('Beskriv banen')}:
                        </label>
                        <input 
                            type="text"
                            required
                            value={beskrivelse}
                            onChange={(e) => setBeskrivelse(e.target.value)}
                            className="w-full border border-gray-600 rounded-lg shadow-sm
                                    px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                        />
                         <label>
                            {t('Plassering')}:
                        </label>
                        <input 
                            type="text"
                            required
                            value={plassering}
                            onChange={(e) => setPlassering(e.target.value)}
                            className="w-full border border-gray-600 rounded-lg shadow-sm
                                    px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                        />
                    </form>
                    <button onClick={handleLagreBane} className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow mx-2 px-4 py-2 mt-4">{t('Lagre bane')}</button>
                </div>
                )}
                {errorMelding && <p className='text-red-500'>{errorMelding}</p>}
            </div>
        </div>
    );
}

export default LagBane;