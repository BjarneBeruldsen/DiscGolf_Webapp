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
    const [nr, setNr] = useState(0);
    const [spillere, setSpillere] = useState([])
    const [visScoreboard, setVisScoreboard] = useState(false);
    const [visVelgSpillere, setVisVelgSpillere] = useState(true);
    const [visOppsummering, setVisOppsummering] = useState(false);

    useEffect(() => {
        if (bane && bane.hull) {
            setHull(bane.hull);
        }
    }, [bane]);

    const oppdaterpoeng = (spillerId, endring) => {
        const oppdatertSpillere = spillere.map(spiller => 
            spiller.id === spillerId ? { ...spiller, poeng: spiller.poeng + endring, total: spiller.total+endring } : spiller
        );
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
        if (retning && nr < hull.length - 1) {
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
    };

    const handleBekreftSpillere = (valgteSpillere) => {
        const spillereMedPoeng = valgteSpillere.map(spiller => ({ ...spiller, poeng: 0, total: 0-hull[nr].par }));
        setSpillere(spillereMedPoeng);
        setVisVelgSpillere(false);
        setVisScoreboard(true);
    };

    const handleAvsluttRunde = () => {
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
    };

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
                            <p className="p-5">{spiller.poeng}</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, 1)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow px-4 py-2">+</button>
                        </div>
                    ))}
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
                <div className="oppsummering bg-white shadow rounded-lg m-8 border p-5">
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
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;