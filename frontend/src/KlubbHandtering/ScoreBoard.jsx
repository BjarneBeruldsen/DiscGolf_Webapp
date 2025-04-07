// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UseFetch from './UseFetch';
import VelgSpillere from "./VelgSpillere";
import HentBruker from "../BrukerHandtering/HentBruker";

const ScoreBoard = () => {
    const { id: baneId } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}`);
    const { bruker, venter } = HentBruker();
    const [hull, setHull] = useState([]);
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

    const oppdaterpoeng = (spillerId, endring) => {
        const oppdatertSpillere = spillere.map(spiller => {
            if (spiller.id === spillerId) {
                const oppdatertAntallKast = [...spiller.antallKast];
                oppdatertAntallKast[nr] = (oppdatertAntallKast[nr] || 0) + endring;
                const oppdatertTotal = oppdatertAntallKast[nr] === -1 ? spiller.total : spiller.total + endring;
                setErrorMelding(null);
                if(oppdatertAntallKast[nr] < 0) {
                    oppdatertAntallKast[nr] = 0; 
                }

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

    const handleBekreftSpillere = (valgteSpillere) => {
        const spillereMedPoeng = valgteSpillere.map(spiller => ({
            ...spiller,
            antallKast: Array(hull.length).fill(0), 
            total: 0 - hull[nr].par,
        }));
        setSpillere(spillereMedPoeng);
        setVisVelgSpillere(false);
        setVisScoreboard(true);
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