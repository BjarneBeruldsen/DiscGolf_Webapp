// Author: Bjarne Hovd Beruldsen
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import UseFetch from './UseFetch';
import VelgSpillere from "./VelgSpillere";
import HentBruker from "../BrukerHandtering/HentBruker";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from "mapbox-gl";

const ScoreBoard = () => {
    const { baneId, rundeId } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}`);
    const { bruker, venter } = HentBruker();
    const [hull, setHull] = useState([]);
    const [invitasjon, setInvitasjon] = useState({});
    const mapContainerRef = useRef(null);
    const [antInviterte, setAntInviterte] = useState(0);
    const [spillereSomVises, setSpillereSomVises] = useState([]);
    const [nr, setNr] = useState(() => {
        const nr = localStorage.getItem('nr');
        return nr ? JSON.parse(nr) : 0;
    });
    const [spillere, setSpillere] = useState(() => {
        const lagretSpillere = localStorage.getItem('spillere');
        return lagretSpillere ? JSON.parse(lagretSpillere) : []; 
    })
    const [antallKast, setAntallKast] = useState([]);
    const [visScoreboard, setVisScoreboard] = useState( () => {
        const lagretVisScoreboard = localStorage.getItem('visScoreboard');
        return lagretVisScoreboard ? JSON.parse(lagretVisScoreboard) : false;
    })
    const [visVelgSpillere, setVisVelgSpillere] = useState(() => {
        const lagretVisVelgSpillere = localStorage.getItem('visVelgSpillere');
        return lagretVisVelgSpillere ? JSON.parse(lagretVisVelgSpillere) : true;
    });
    const [visOppsummering, setVisOppsummering] = useState(() => {
        const lagretVisOppsummering = localStorage.getItem('visOppsummering');
        return lagretVisOppsummering ? JSON.parse(lagretVisOppsummering) : false;
    });

    const [errorMelding, setErrorMelding] = useState(null);

    useEffect(() => {
        localStorage.setItem('spillere', JSON.stringify(spillere));
        localStorage.setItem('nr', JSON.stringify(nr));
        localStorage.setItem('visVelgSpillere', JSON.stringify(visVelgSpillere));
        localStorage.setItem('visScoreboard', JSON.stringify(visScoreboard));
        localStorage.setItem('visOppsummering', JSON.stringify(visOppsummering));
    }, [spillere, nr, visVelgSpillere, visScoreboard, visOppsummering]); 

    useEffect(() => {
        if (bane && bane.hull) {
            setHull(bane.hull);
        }
    }, [bane]);

    useEffect(() => {
        if (bane && bane.hull && nr === 0) { // Only apply logic when on hole number 1
            const oppdatertSpillere = spillere.map(spiller => {
                if (spiller.total === 0) {
                    return {
                        ...spiller,
                        total: 0 - hull[nr]?.par || 0
                    };
                }
                return spiller;
            });
            setSpillere(prevSpillere => {
                // Avoid unnecessary updates if no changes are made
                const isSame = JSON.stringify(prevSpillere) === JSON.stringify(oppdatertSpillere);
                return isSame ? prevSpillere : oppdatertSpillere;
            });
        }
    }, [bane, hull, nr]); // Removed `spillere` from dependencies to avoid infinite loop

    const oppdaterpoeng = (spillerId, endring) => {
        const oppdatertSpillere = spillere.map(spiller => {
            if (spiller.id === spillerId) {
                const oppdatertAntallKast = [...spiller.antallKast];
                oppdatertAntallKast[nr] = (oppdatertAntallKast[nr] || 0) + endring;
                if (oppdatertAntallKast[nr] < 0) {
                    oppdatertAntallKast[nr] = 0; // Prevent negative throws
                }
                const oppdatertTotal = spiller.total + endring;
                setErrorMelding(null);

                return {
                    ...spiller,
                    antallKast: oppdatertAntallKast,
                    total: oppdatertTotal
                };
            }
            return spiller;
        });
        setSpillere(oppdatertSpillere);
    };

    useEffect(() => {
        if (spillereSomVises.length > 0) {
            setSpillere(spillereSomVises);
        }
    }, [spillereSomVises]);

    const oppdaterTotal = (retning) => {
        if (retning) {
            const oppdatertSpillere = spillere.map(spiller => ({
                ...spiller,
                poeng: 0,
                total: Number(spiller.total) - Number(hull[nr + 1] ? hull[nr + 1].par : 0) //Number ble lagt til ved hjelp av Copilot
            }));
            setSpillere(oppdatertSpillere);
        } else {
            const oppdatertSpillere = spillere.map(spiller => ({
                ...spiller,
                poeng: 0,
                total: Number(spiller.total) + Number(hull[nr] ? hull[nr].par : 0)
            }));
            setSpillere(oppdatertSpillere);
        }
    };


    const endreHull = (retning) => {
        setErrorMelding(null);
        let erNull = sjekkErNullKast(nr); 
        
        if (retning && nr < hull.length - 1 && !erNull) {
            setNr(nr + 1); 
            if(nr <= hull.length - 1) {
                oppdaterTotal(retning);
            }
            
        } else if (!retning && nr > 0) {
            setNr(nr - 1);
            if(nr >= 1) {
                oppdaterTotal(retning);
            }
        }
        else {
            setErrorMelding("Alle spillere må kaste")
        }
    };

    const handleBekreftSpillere = async (valgteSpillere) => {
        console.log(bruker);
        const spillereMedPoeng = valgteSpillere.map(spiller => ({
            ...spiller,
            antallKast: Array(hull.length).fill(0),
            total: 0 - hull[nr].par,
        }));
        const oppdatertInvitasjon = {
            avsender: bruker.brukernavn,
            baneId: baneId,
            rundeId: rundeId,
            tid: new Date().getTime() / 1000,
        };
        setInvitasjon(oppdatertInvitasjon);

        // Vent til invitasjon er oppdatert før du sender den
        await new Promise(resolve => setTimeout(resolve, 0));

        console.log('invitasjon:', oppdatertInvitasjon);
        setSpillere(spillereMedPoeng);
        console.log('spillere med poeng:', spillereMedPoeng);
        for (const spiller of spillereMedPoeng) {
            if (bruker.id !== spiller.id && !spiller.id.startsWith("guest") && oppdatertInvitasjon) {
                sendInvitasjon(spiller, oppdatertInvitasjon);
                setAntInviterte(prevAntInviterte => prevAntInviterte + 1);
                console.log('antall inviterte:', antInviterte); 
            }
            else {
                setSpillereSomVises(prevSpillereSomVises => [...prevSpillereSomVises, spiller]);
                console.log('spillere som skal vises', spillereSomVises);
            }
        }
        console.log('spillere: ', spillere); 
        setVisVelgSpillere(false);
        setVisScoreboard(true);
        setSpillere(spillereSomVises)
    };

    const lagreRunde = async () => {
        console.log('antall inviterte i lagrerunde: ', antInviterte)
        if (antInviterte === 0) {
            console.error('Ingen spillere å lagre runde for');
            return;
        }
        const runde = {
            antInviterte: antInviterte,
            rundeId: rundeId
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/runder`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(runde)
            });
            if (!response.ok) {
                throw new Error('Feil ved lagring av runde');
            }
            const data = await response.json();
            console.log('Runde lagret:', data);
        } catch (error) {
            console.error('Feil ved lagring av runde:', error);
        }
    };

    const sendInvitasjon = (spiller, invitasjon) => {
        const brukerId = spiller.id;

        // Legg til mottakerId i invitasjonen
        const invitasjonMedMottaker = {
            ...invitasjon,
            mottakerId: brukerId  // eller "mottaker": { id: brukerId } hvis det forventes
        };

        fetch(`${process.env.REACT_APP_API_BASE_URL}/brukere/${brukerId}/invitasjoner`, {
            method: 'POST', 
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({ invitasjon: invitasjonMedMottaker })
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Feil ved sending av invitasjon');
            }
            return response.json();
        }).then((data) => {
            console.log('Invitasjon sendt:', data);
            console.log('Invitasjon:', invitasjon, 'Spiller:', spiller);
        }).catch((error) => {
            console.error('Feil ved sending av invitasjon:', error);
        }); 

        lagreRunde(); 
    };

    const handleAvsluttRunde = () => {
        if(!sjekkErNullKast(nr)) {
            const nyPoengkort = {
                spillere: spillere,
                baneNavn: bane.baneNavn,
                baneId: baneId
            };
            
            fetch(`${process.env.REACT_APP_API_BASE_URL}/brukere/${bruker.id}/poengkort`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nyPoengkort })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Feil ved lagring av poengkort');
                }
                return response.json();
            }).catch(error => {
                console.error('Feil ved lagring av poengkort:', error);
            });

            setVisScoreboard(false);
            setVisVelgSpillere(false);
            setVisOppsummering(true);
        }
        else {
            setErrorMelding("Alle spillere må kaste")
        }
    };
    
    const handleNyRunde = () => {
        setVisOppsummering(false);
        setVisVelgSpillere(true);
        setSpillere([]);
        setSpillereSomVises([]); 
        setNr(0);
        setVisScoreboard(false);
    }

    const sjekkErNullKast = (nr) => {
        let erNull = false;
        for(let i=0;i<spillere.length;i++) {
            if(spillere[i].antallKast[nr] === 0) {
                erNull = true; 
            }
        }
        return erNull;
    }
    useEffect(() => {
        if (!mapContainerRef.current || !hull || hull.length === 0 || !hull[nr]) return;
    
        mapboxgl.accessToken = "pk.eyJ1IjoidW5rbm93bmdnc3MiLCJhIjoiY203eGhjdXBzMDUwaDJxc2RidXgwbjBqeSJ9.wlnVO6sI2-cY5Tx8uYv_XQ";
    
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            center: [
                hull[nr].startLongitude || 9.059,
                hull[nr].startLatitude || 59.409
            ],
            zoom: 16,
        });
        const coordinates = [];

        hull.forEach(({ startLatitude, startLongitude, sluttLatitude, sluttLongitude }, i) => {
            if (startLatitude && startLongitude) {
                const startEl = document.createElement('div');
                startEl.className = 'marker';
                startEl.style.backgroundImage = 'url("/disc.png")';
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
                endEl.style.backgroundImage = 'url("/kurv.png")';
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
    }, [hull, nr]);
    

    return (
        <div className="innhold flex justify-center bg-gray-200">
            {error && <div>{error}</div>}
            {isPending && <div>Laster...</div>}
            {visScoreboard && (
            <div className="hovedpanel bg-white shadow rounded-lg m-8 border">
                {isPending && <div>Laster...</div>}
                {error && <div>{error}</div>}
                {hull.length > 0 && (
                    <div className="paneltop flex p-5 font-bold border-b">
                        <p>Hull: {hull[nr].hullNr}</p>
                        <p className="px-5">Avstand: {hull[nr].avstand}m</p>
                        <p>Par: {hull[nr].par}</p>
                    </div>
                )}
                <div className="midtpanel font-bold">
                    {spillere.map(spiller => (
                        <div key={spiller.id} className="spiller flex justify-center items-center my-2 border-b">
                            <p className="p-5">{spiller.navn} ({spiller.total})</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, -1)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow px-4 py-2 font-sans">-</button>
                            <p className="p-5">{spiller.antallKast[nr] || 0}</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, 1)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow px-4 py-2">+</button>
                        </div>
                    ))}
                    <div className="flex justify-center items-center my-2">
                        <p className="text-red-500">{errorMelding}</p>
                    </div>
                </div>
                <div ref={mapContainerRef} className="w-full h-[300px]" />
                <div className="bunn-panel flex justify-between py-2">
                    <button onClick={() => endreHull(false)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{"<-"}</button>
                    {nr === hull.length - 1 && (
                        <button onClick={handleAvsluttRunde} className="rounded-full text-white bg-red-500 hover:bg-red-200 shadow mx-2 px-4 py-2">Avslutt</button>
                    )}
                    <button onClick={() => endreHull(true)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{"->"}</button>
                </div>
            </div>
            )}
            {visVelgSpillere && <VelgSpillere bane={bane} bruker={bruker} onBekreftSpillere={handleBekreftSpillere}/>}
            {visOppsummering && (
                <div className="oppsummering bg-white shadow rounded-lg m-8 border p-5 flex flex-col items-center">
                    <h2 className="text-center font-bold text-xl mb-4">Oppsummering av runden</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Spiller</th>
                                <th className="py-2">Total Poengsum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spillere.map(spiller => (
                                <tr key={spiller.id}>
                                    <td className="border px-4 py-2">{spiller.navn}</td>
                                    <td className="border px-4 py-2">{spiller.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleNyRunde} className="mt-2 rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">Ny runde</button>
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;