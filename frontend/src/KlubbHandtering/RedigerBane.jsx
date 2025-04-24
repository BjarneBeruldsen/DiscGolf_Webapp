// Author: Bjarne Hovd Beruldsen & Abdinasir Ali
import { useState, useEffect, useRef } from "react";
import BaneListe from "./Baneliste";
import UseFetch from "./UseFetch";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import InfoTooltip from "./infoTooltip";
import { useTranslation } from 'react-i18next';

const RedigerBane = ({ klubb }) => {
    const { t } = useTranslation();
    const minne = useHistory();
    const [rediger, setRediger] = useState(true);
    const { klubbId, baneId } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}`);
    const [baneNavn, setBaneNavn] = useState("");
    const [vanskelighet, setVanskelighet] = useState('');
    const [beskrivelse, setBeskrivelse] = useState('');
    const [avstand, setAvstand] = useState('');
    const [par, setPar] = useState('');
    const [redigerNavn, setRedigerNavn] = useState(false);
    const [redigerVanskelighet, setRedigerVanskelighet] = useState(false);
    const [redigerBeskrivelse, setRedigerBeskrivelse] = useState(false);
    const [redigerAvstand, setRedigerAvstand] = useState(false);
    const [redigerPar, setRedigerPar] = useState(false);
    const [redigerHull, setRedigerHull] = useState(false);
    const [visRedigerHull, setVisRedigerHull] = useState(false);
    const [visRedigerBane, setVisRedigerBane] = useState(true);
    const [hull, setHull] = useState([]);
    const [oppdaterteHull, setOppdaterteHull] = useState([]);
    const baneNavnRef = useRef(null);
    const vanskelighetRef = useRef(null);
    const beskrivelseRef = useRef(null);
    const avstandRef = useRef(null);
    const parRef = useRef(null);
    const [nr, setNr] = useState(0);
    const mapContainerRef = useRef(null);
    const [startPosisjon, setStartPosisjon] = useState({startLatitude:null, startLongitude:null});
    const [sluttPosisjon, setSluttPosisjon] = useState({sluttLatitude:null, sluttLongitude:null});
    const [valgtHullNr, setValgtHullNr] = useState('');
   
    const lagreEndrng = async () => {
        lagreHull(); 
        setNr(0);
    
        const oppdaterteData = { 
            baneNavn,
            vanskelighet,
            beskrivelse,
            hull
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner/${baneId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oppdaterteData)
            });
    
            if (!response.ok) {
                throw new Error(`Feil ved oppdatering av bane: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('Oppdatering vellykket:', result);
            alert('Oppdatering vellykket!');
            if(visRedigerBane) {
                minne.push(`/LagKlubbSide/${klubbId}`);
            }
        } catch (error) {
            console.error('Feil:', error);
        }
    };

    const angreEndring = () => { 
        alert('Endringer angret!');
        minne.push(`/LagKlubbSide/${klubbId}`);
    }


    useEffect(() => {
        if (bane) {
            setBaneNavn(bane.baneNavn);
            setVanskelighet(bane.vanskelighet);
            setBeskrivelse(bane.beskrivelse);
            setHull(bane.hull);
        }
    }, [bane]);

    useEffect(() => {
        if (hull.length > 0) {
            setAvstand(hull[nr].avstand);
            setPar(hull[nr].par);
        }
    }, [nr, hull]);


    const endreHull = (retning) => {
        if (retning && nr < hull.length - 1) {
            lagreHull();
            setNr(nr + 1);  
        } else if (!retning && nr > 0) {
            setNr(nr - 1);
        }
    };

    const regHull= () => {
        lagreEndrng();
        alert('Endringer på hull er lagret');
        handleVisning('bane')();
    }

    const lagreHull = () => {
        hull[nr] = { 
            ...hull[nr], 
            avstand, 
            par,
            startLatitude: startPosisjon.startLatitude || hull[nr].startLatitude,
            startLongitude: startPosisjon.startLongitude || hull[nr].startLongitude,
            sluttLatitude: sluttPosisjon.sluttLatitude || hull[nr].sluttLatitude,
            sluttLongitude: sluttPosisjon.sluttLongitude || hull[nr].sluttLongitude
        };
        
        console.log('lagre Hull:', hull);
    }

    const handleVisning = (seksjon) => () => {
        setVisRedigerBane(seksjon === 'bane');
        setVisRedigerHull(seksjon === 'hull');
    }



    const handleRediger = (seksjon) => () => {
        setRedigerBeskrivelse(false);
        setRedigerVanskelighet(false);
        setRedigerNavn(false); 
        setRedigerAvstand(false);
        setRedigerPar(false);
        setRedigerHull(false);
    
        const stateSetters = {
            baneNavn: [setRedigerNavn, baneNavnRef],
            beskrivelse: [setRedigerBeskrivelse, beskrivelseRef],
            vanskelighet: [setRedigerVanskelighet, vanskelighetRef],
            avstand: [setRedigerAvstand, avstandRef],
            par: [setRedigerPar, parRef],
            hull: [setRedigerHull, null]
        };
    
        if (stateSetters[seksjon]) {
            stateSetters[seksjon][0](true);
            if (stateSetters[seksjon][1]) {
                setTimeout(() => {
                    stateSetters[seksjon][1].current.focus();
                }, 0);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const finnHullNr = () => {
        if (!valgtHullNr || hull.length === 0) return;
        
        const hullIndex = hull.findIndex(hole => hole.hullNr === parseInt(valgtHullNr));
        if (hullIndex !== -1) {
            lagreHull();
            setNr(hullIndex);

            setStartPosisjon({startLatitude: null, startLongitude: null});
            setSluttPosisjon({sluttLatitude: null, sluttLongitude: null});  
            if (mapContainerRef.current) {
                visMap();
            }
        } else {
            alert(`Hull nummer ${valgtHullNr} ble ikke funnet.`);
        }
    };
    
   
    const visMap = () => {
        if (!mapContainerRef.current) return;
      
        while (mapContainerRef.current.firstChild) {
            mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
        }
        
        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";
        
        
       
        
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [hull[nr].startLongitude || 9.059, hull[nr].startLatitude || 59.409],
            zoom: 15,
        });
        
        
        map.on('load', () => {
            if (hull[nr].startLatitude && hull[nr].startLongitude) {
                const startPoint = [hull[nr].startLongitude, hull[nr].startLatitude];
                new mapboxgl.Marker({ color: "gray" })
                    .setLngLat(startPoint)
                    .addTo(map);
                
                if (hull[nr].sluttLatitude && hull[nr].sluttLongitude) {
                    const stopPoint = [hull[nr].sluttLongitude, hull[nr].sluttLatitude];
                    new mapboxgl.Marker({ color: "green" })
                        .setLngLat(stopPoint)
                        .addTo(map);
                    
                    
                    map.addSource("hole-path", {
                        type: "geojson",
                        data: {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: [startPoint, stopPoint],
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
                }
            }
        });
        
        let startPunkt = null;
      
        map.on("click", (e) => {
            const clickedPos = { latitude: e.lngLat.lat, longitude: e.lngLat.lng };
            
            

            //console.log("Saved position:", clickedPos);
      
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
    
  
};
    useEffect(() => {
        if (visRedigerHull && mapContainerRef.current) {
            visMap();
        }
    }, [visRedigerHull, nr]);
    return ( 
    <div className="innhold bg-gray-100">
        {klubb && klubb.baner ? (
            <>
                <BaneListe baner={klubb.baner} klubbId={klubb._id} rediger={rediger} />
            </>
        ) : (
            bane  ? (
                <div className="rediger flex justify-center bg-gray-100">
                    {visRedigerBane && (
                    <div className="border rounded-lg shadow-lg p-4 m-4 md:w-100 w-80 bg-white">
                        {error && <p>{error}</p>}
                        {isPending && <p>{t('Laster baneinformasjon...')}</p>}
                        <div className="overskrift flex justify-center border-b">
                            <h1 className="text-xl font-bold">{t('Rediger banen her')}:</h1>
                        </div>
                        <div className="form">
                            <form onSubmit={handleSubmit} className="text-md font-semibold">
                                <label>{t('Banenavn')}:</label>
                                <div className="linje2 flex">
                                    <input 
                                        type="text"
                                        className="w-full border rounded-lg p-2 inline-block" 
                                        value={baneNavn}
                                        {...redigerNavn ? {readOnly: false} : {readOnly: true}}
                                        onChange={(e) => setBaneNavn(e.target.value)}
                                        ref={baneNavnRef}
                                    />
                                    <button onClick={handleRediger('baneNavn')} className="p-2 w-12 cursor-pointer"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                                <label>{t('Vanskelighet')}:</label>
                                <div className="linje3 flex">
                                <select id="vanskelighetsgrad" 
                                    name='vanskelighetsgrad' value={vanskelighet} 
                                    onChange={(e) => setVanskelighet(e.target.value)} 
                                    {...redigerVanskelighet ? {disabled: false} : {disabled: true}}
                                    ref={vanskelighetRef}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2">

                                        <option value="Lett">{t('Lett')}</option>
                                        <option value="Middels">{t('Middels')}</option>
                                        <option value="Vanskelig">{t('Vanskelig')}</option>
                                </select>
                                    <button onClick={handleRediger('vanskelighet')} className="p-2 w-12 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                                <label>{t('Beskrivelse')}:</label>
                                <div className="linje4 flex">
                                    <input 
                                        type="text"
                                        className="w-full border rounded-lg p-2 inline-block" 
                                        value={beskrivelse}
                                        onChange={(e) => setBeskrivelse(e.target.value)}
                                        {...redigerBeskrivelse ? {readOnly: false} : {readOnly: true}}
                                        ref={beskrivelseRef}

                                    />
                                    <button onClick={handleRediger('beskrivelse')} className="p-2 w-12 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                                <div className="linje 5 flex justify-between pt-2">
                                    <label>{t('Rediger hull')}:</label>
                                    <button onClick={handleVisning('hull')} className="p-2 w-11 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                                <div className="bunn-panel flex justify-between py-2">
                                    <button onClick={angreEndring} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('Angre')}</button>
                                    <button onClick={lagreEndrng} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('Fullfør')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    )}
                    {hull.length > 0 && visRedigerHull && (
                    <div className="border rounded-lg shadow bg-white p-4 m-4">
                        <div className="paneltop flex p-5 font-bold border-b">
                            <h1 className="text-xl font-bold">{t('Hull')}: {hull[nr].hullNr}</h1>
                        </div>
            
                        <div className="midtpanel font-bold">
                            <form onSubmit={handleSubmit} className="text-md font-semibold">
                                <label>{t('Avstand')}:</label>
                                <div className="linje2 flex">
                                    <input 
                                        type="text"
                                        className="w-full border rounded-lg p-2 inline-block" 
                                        value={avstand}
                                        {...redigerAvstand ? {readOnly: false} : {readOnly: true}}
                                        onChange={(e) => setAvstand(e.target.value)}
                                        ref={avstandRef}
                                    />
                                    <button onClick={handleRediger('avstand')} className="p-2 w-12 cursor-pointer"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                                <label>{t('Par')}:</label>
                                <div className="linje2 flex">
                                    <input 
                                        type="text"
                                        className="w-full border rounded-lg p-2 inline-block" 
                                        value={par}
                                        {...redigerPar ? {readOnly: false} : {readOnly: true}}
                                        onChange={(e) => setPar(e.target.value)}
                                        ref={parRef}
                                    />
                                    <button onClick={handleRediger('par')} className="p-2 w-12 cursor-pointer"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div>
                        <div className="flex items-center justify-between mt-2">
                        <label className='block font-medium mt-2'>
                                {t('Start og sluttposisjon')}:
                            </label>
                            <InfoTooltip tekst={
                                <>
                                    {t('Trykk en gang for å velge startposisjon (utslagssted).')}<br />
                                    {t('Deretter trykk en gang for å velge sluttposisjon (kurv).')}<br />
                                    {t('Gamle posisjoner blir overskrevet.')}
                                </>
                                } /> 
                        </div>
                                <div ref={mapContainerRef} className="w-full h-100" />
                        </div>                      
                        <div className="bunn-panel flex justify-between py-2 font-semibold text-md">
                            <button onClick={() => endreHull(false)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('<-')}</button>
                            <button onClick={() => endreHull(true)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('->')}</button>
                        </div>
                        <div className="bunn-panel flex justify-between py-2 font-semibold text-md">
                            <button onClick={handleVisning('bane')} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('Angre')}</button>
                            <button onClick={regHull} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{t('Fullfør')}</button>
                        </div>
                    </div>
                    )} 
                </div>
            ) : (
                <p>{t('Ingen baner tilgjengelig...')}</p>
            )
        )}
    </div> );
}
 
export default RedigerBane;