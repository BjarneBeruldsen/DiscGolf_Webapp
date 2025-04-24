// Author: Bjarne Hovd Beruldsen & Abdinasir Ali
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import UseFetch from './UseFetch';
import VelgSpillere from "./VelgSpillere";
import HentBruker from "../BrukerHandtering/HentBruker";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from "mapbox-gl";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import socket from "../socket";
import { useTranslation } from 'react-i18next';

const ScoreBoard = () => {
    const { t } = useTranslation();
    const minne = useHistory();
    const location = useLocation(); // Hent gjeldende rute
    const { baneId, rundeId } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}`);
    const { bruker, venter } = HentBruker();
    const [hull, setHull] = useState([]);
    const [invitasjon, setInvitasjon] = useState({});
    const mapContainerRef = useRef(null);
    const [antInviterte, setAntInviterte] = useState(0);
    const [spillereSomVises, setSpillereSomVises] = useState([]);
    const [visVenter, setVisVenter] = useState(false);
    const [visVenterFerdig, setVisVenterFerdig] = useState(false);  
    const [antallAkseptert, setAntallAkseptert] = useState(0);
    const [antFerdig, setAntFerdig] = useState(0);
    const [venterAntall, setVenterAntall] = useState(0);    
    const [venterFerdigAntall, setVenterFerdigAntall] = useState(0);
    const [lagretPoengkort, setLagretPoengkort] = useState(false);
    const [sortertPoengkort, setSortertPoengkort] = useState([]);
    const [totalAntKast, setTotalAntKast] = useState(0);
    const [runde, setRunde] = useState({});
    const [nr, setNr] = useState(() => {
        const nr = localStorage.getItem('nr');
        return nr ? JSON.parse(nr) : 0;
    });
    const [spillere, setSpillere] = useState(() => {
        const lagretSpillere = localStorage.getItem('spillere');
        return lagretSpillere ? JSON.parse(lagretSpillere) : []; 
    })
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
    const [visVentSpillere, setVisVentSpillere] = useState(false);

    const [errorMelding, setErrorMelding] = useState(null);
    const hasUpdatedOnce = useRef(false); // Legg til useRef for å spore om handlingen er utført

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

    //for spillere som blir invitert 
    useEffect(() => {
        if (bane && bane.hull && nr === 0) { 
            const oppdatertSpillere = spillere.map(spiller => {
                console.log("spiller: ", spiller);
                if (spiller.total === 0 && spiller.antallKast.length <= 1) {
                    return {
                        ...spiller,
                        antallKast: Array(hull.length).fill("-"),
                        total: 0,
                    };
                }
                return spiller;
            });
            setSpillere(prevSpillere => {
                const isSame = JSON.stringify(prevSpillere) === JSON.stringify(oppdatertSpillere);
                return isSame ? prevSpillere : oppdatertSpillere;
            });
        }
    }, [nr, bane, hull, spillere]);
   

    useEffect(() => {
        if (!rundeId) {
            setVisVelgSpillere(true);
            setVisScoreboard(false);
            setVisOppsummering(false);
        }
    });

    useEffect(() => {
        socket.on("rundeLagret", (data) => {
            console.log("runde fra socket: " + data.data.rundeId);
            console.log("runde fra socket: " + JSON.stringify(data.data)); 
            console.log("rundeId fra url: " + rundeId);
            if(data.data.rundeId === rundeId) {
                if(data.data.antInviterte > 0) {
                    console.log("vis venter slår til"); 
                    setVisVenter(true);
                    setVisVelgSpillere(false);
                    setVisScoreboard(false);
                    setVisOppsummering(false);
                }
                setAntInviterte(data.data.antInviterte)
                console.log("antall inviterte: " + antInviterte);
            }
        });

        socket.on("akseptertOppdatert", (data) => {
            console.log("akseptert oppdatert fra socket: " + data.data.rundeId);
            console.log("runde fra socket akseptert: " + JSON.stringify(data.data)); 
            console.log("rundeId fra url: " + rundeId);
            if(data.data.rundeId === rundeId) {
                setAntallAkseptert(data.data.antallAkseptert); 
                console.log("antall akseptert: ", data.data.antallAkseptert)
            }
        }); 

        socket.on("akseptertFerdig", (data) => {
            console.log("akseptert oppdatert fra socket: " + data.data.rundeId);
            console.log("runde fra socket akseptert: " + JSON.stringify(data.data)); 
            if(data.data.rundeId === rundeId) {
                leggTilPoengkort(data.data.poengkort);
                setAntFerdig(data.data.antallFerdig); 
                setAntInviterte(data.data.antInviterte);
                setAntallAkseptert(data.data.antallAkseptert);
                console.log("antall ferdig: ", data.data.antallFerdig)
            }
        })

        setVenterAntall(antInviterte - antallAkseptert);

        setVenterFerdigAntall(antInviterte - antFerdig);

        if (venterAntall === 0) {
            console.log("venterAntall: ", venterAntall);
            if(visVelgSpillere) {
                hasUpdatedOnce.current = false;
            }
            setVisVenter(false);
            console.log("status: ", visVelgSpillere, visOppsummering, visVenterFerdig);
            console.log("har oppdatert: ", hasUpdatedOnce.current);
            if (!visVelgSpillere && !visOppsummering && !visVenterFerdig) {
                setVisScoreboard(true);
                if (!hasUpdatedOnce.current) {
                    hasUpdatedOnce.current = true; // Marker at handlingen er utført
                    setNr(1);
                    setTimeout(() => setNr(0), 100);
                }
            }
        }

        return () => {
            socket.off('rundeLagret'); 
            socket.off('akseptertOppdatert'); 
            socket.off('akseptertFerdig');
        };
    })


    const oppdaterpoeng = (spillerId, endring) => {
        const oppdatertSpillere = spillere.map(spiller => {
            if (spiller.id === spillerId) {
                const oppdatertAntallKast = [...spiller.antallKast];
                if(oppdatertAntallKast[nr] === "-" && endring > 0) {
                    oppdatertAntallKast[nr] = parseInt(hull[nr].par);
                }
                else if(oppdatertAntallKast[nr] === "-" && endring < 0) {
                    oppdatertAntallKast[nr] = parseInt(hull[nr].par - 1);
                }
                else {
                    oppdatertAntallKast[nr] = parseInt(oppdatertAntallKast[nr] || 0) + endring;
                }

                if(oppdatertAntallKast[nr] === 0) {
                    oppdatertAntallKast[nr] = "-";
                }



                let oppdatertTotal = 0;
                console.log("oppdatertAntallKast: ", oppdatertAntallKast);
                console.log("hull lengde: ", hull.length);
                console.log("spiller: ", spiller);
                for(let i=0;i<hull.length;i++) {
                    if(oppdatertAntallKast[i] != "-") {
                        oppdatertTotal += parseInt(oppdatertAntallKast[i]) - hull[i].par; 
                    }
                }   
                setErrorMelding(null);

                return {
                    ...spiller,
                    antallKast: oppdatertAntallKast,
                    total: oppdatertTotal,
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



    const endreHull = (retning) => {
        
        if (retning && nr < hull.length - 1) {
            setNr(nr + 1); 
            setErrorMelding(null);
            
        } else if (!retning && nr > 0) {
            setNr(nr - 1);
            setErrorMelding(null);
        }
        console.log("spillere: ", spillere);
    };

    const handleBekreftSpillere = async (valgteSpillere, antInviterte) => {
        const nyRundeId = uuidv4(); // Generate a unique rundeId

        const basePath = `/ScoreBoard/${baneId}`;
        minne.push(`${basePath}/${nyRundeId}`);
      
        setAntInviterte(antInviterte);
        const spillereMedPoeng = valgteSpillere.map(spiller => ({
            ...spiller,
            antallKast: Array(hull.length).fill("-"),
            total: 0,
        }));
        const oppdatertInvitasjon = {
            avsender: bruker.brukernavn,
            baneId: baneId,
            rundeId: nyRundeId, // Use the generated rundeId
            tid: new Date().getTime() / 1000,
        };
        setInvitasjon(oppdatertInvitasjon);
    
        // Wait for the invitation to update
        await new Promise(resolve => setTimeout(resolve, 0));

    
        for (const spiller of spillereMedPoeng) {
            if (bruker.id !== spiller.id && !spiller.id.startsWith("guest") && oppdatertInvitasjon) {
                sendInvitasjon(spiller, oppdatertInvitasjon);
            } else {
                setSpillereSomVises(prevSpillereSomVises => [...prevSpillereSomVises, spiller]);
            }
        }
        setSpillere(spillereMedPoeng);
        setVisVelgSpillere(false);
        setVisScoreboard(true);
        setNr(1);
        setTimeout(() => setNr(0), 100);
        lagreRunde(antInviterte, nyRundeId); 
    };
    
    const lagreRunde = async (antall, nyRundeId) => {
        const runde = {
            antInviterte: antall,
            rundeId: nyRundeId, 
            antallAkseptert: 0,
            antallFerdig: 0,
            poengkort: [],
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/runder`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(runde),
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

    };


    const handleAvsluttRunde = async () => {
        if(!sjekkErNullKast() && !lagretPoengkort) {
            setVisVenterFerdig(true);
            const nyPoengkort = {
                spillere: spillere,
                baneNavn: bane.baneNavn,
                baneId: baneId
            };
            //lagrer poengkort pr.bruker
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


            //lagrer poengkort i runde 
            fetch(`${process.env.REACT_APP_API_BASE_URL}/runder/${rundeId}/poengkort`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nyPoengkort })
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Feil ved lagring av poengkort i runde');
                }
                return response.json();
            }).catch(error => {
                console.error('Feil ved lagring av poengkort i runde:', error);
            });
            setLagretPoengkort(true);

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/runder/ferdig/${rundeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error('Feil ved oppdatering av antall akseptert');
            }
        }
        else {
            setErrorMelding("Alle hull er ikke fyllt ut")
        }
            setVisScoreboard(false);
            setVisVelgSpillere(false);
            if(venterFerdigAntall <= -1) {
                setVisVenterFerdig(false);
                setVisOppsummering(true);
                setAntInviterte(0);
                setAntallAkseptert(0);
                setAntFerdig(0);
            }
    };
    
    const handleNyRunde = () => {
        setVisOppsummering(false);
        setVisVelgSpillere(true);
        setSpillere([]);
        setSpillereSomVises([]); 
        setNr(0);
        setVisScoreboard(false);
        setLagretPoengkort(false); 
        hasUpdatedOnce.current = false;
        setSortertPoengkort([]);
    }

    const leggTilPoengkort = (poengkort) => {
        console.log("poengkort fra socket: ", poengkort);
        const eksisterendeIds = new Set(sortertPoengkort.map(p => p.nyPoengkort.spillere[0]?.id)); //lagt til ved hjelp av Copilot
        const nyePoengkort = poengkort.filter(p => !eksisterendeIds.has(p.nyPoengkort.spillere[0]?.id));
        
        const oppdatertPoengkort = [...sortertPoengkort, ...nyePoengkort].sort((a, b) => {
            const totalA = a.nyPoengkort.spillere[0]?.total || 0;
            const totalB = b.nyPoengkort.spillere[0]?.total || 0;
            return totalA - totalB; 
        });
        
        setSortertPoengkort(oppdatertPoengkort);
        console.log('oppdaterte poengkort:', oppdatertPoengkort);
    }

    const sjekkErNullKast = () => {
        for(let spiller of spillere) {
            console.log("spiller sjekkes: ", spiller);
            for(let antall of spiller.antallKast) {
                if(antall === "-" || antall === 0) {
                    console.log("true returneres")
                    return true;
                }
            }
        }
        console.log("false returneres")
        return false;
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
                
                
                if (bane && bane.obZoner) {
                    bane.obZoner.forEach((obZone, i) => {
                        map.addSource(`ob-${i}`, {
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
                            id: `ob-layer-${i}`,
                            type: 'fill',
                            source: `ob-${i}`,
                            paint: {
                                'fill-color': '#FF0000',
                                'fill-opacity': 0.3
                            }
                        });
                    });
                }
            });
        }

        return () => map.remove();
    }, [hull, nr, bane]);

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
                            <p className="p-5">{spiller.navn} ({spiller.total === 0 ? "E" : spiller.total > 0 ? "+" + spiller.total : spiller.total})</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, -1)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow px-4 py-2 font-sans">-</button>
                            <p className="p-5">{spiller.antallKast[nr] || 0}</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, 1)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow px-4 py-2">+</button>
                        </div>
                    ))}
                </div>
                <div ref={mapContainerRef} className="w-full h-[300px]" />
                <div className="flex justify-center items-center my-2">
                        <p className="text-red-500">{errorMelding}</p>
                </div>
                <div className="bunn-panel flex justify-between py-2">
                    <button onClick={() => endreHull(false)} className={`rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2 ${nr === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>{"<-"}</button>
                    {nr === hull.length - 1 && (
                        <button onClick={handleAvsluttRunde} className="rounded-full text-white bg-red-500 hover:bg-red-200 shadow mx-2 px-4 py-2">Avslutt</button>
                    )}
                    <button onClick={() => endreHull(true)} className={`rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2 ${nr === hull.length-1 ? "opacity-50 cursor-not-allowed" : ""}`}>{"->"}</button>
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
                                <th className="py-2">Plassering</th>
                                <th className="py-2">Spiller</th>
                                <th className="py-2">Total Poengsum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortertPoengkort.map((poengkort, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{poengkort.nyPoengkort.spillere[0]?.navn}</td>
                                    <td className="border px-4 py-2">{poengkort.nyPoengkort.spillere[0]?.total > 0 ? "+"+poengkort.nyPoengkort.spillere[0]?.total : poengkort.nyPoengkort.spillere[0]?.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleNyRunde} className="mt-2 rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">Ny runde</button>
                </div>
            )}
            {visVenter && (
                <div className="vent-spillere bg-white shadow rounded-lg m-8 border p-5 flex flex-col items-center">
                    <h2 className="text-center font-bold text-xl mb-4">Venter på {venterAntall || 0} til å akseptere invitasjon...</h2>
                </div>
            )}
            {visVenterFerdig && (
                <div className="vent-spillere bg-white shadow rounded-lg m-8 border p-5 flex flex-col items-center">
                    <h2 className="text-center font-bold text-xl mb-4">Venter på {(venterFerdigAntall+1) < 0 ? 0: venterFerdigAntall+1} spillere til å bli ferdig...</h2>
                    {venterFerdigAntall <= -1 && (
                        <button onClick={handleAvsluttRunde} className="rounded-full text-white bg-green-500 hover:bg-green-200 shadow mx-2 px-4 py-2">Se resultat</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;