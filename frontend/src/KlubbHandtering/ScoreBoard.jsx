// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UseFetch from './UseFetch';
import VelgSpillere from "./VelgSpillere";

const ScoreBoard = () => {
    const { id: baneId } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}`);
    const [poeng, setPoeng] = useState(0);
    const [hull, setHull] = useState([]);
    const [total, setTotal] = useState(0);
    const [nr, setNr] = useState(0);
    const [spillere, setSpillere] = useState([]);
    const [visning, setVisning] = useState('velgspillere');
    const [visScoreboard, setVisScoreboard] = useState(false);
    const [visVelgSpillere, setVisVelgSpillere] = useState(true);
    const [klubbId, setKlubbId] = useState(null);
    const [rundeId, setRundeId] = useState(null);
    const [visOppsummering, setVisOppsummering] = useState(false);

    useEffect(() => {
        if (bane && bane.hull) {
            setHull(bane.hull);
            setKlubbId(bane.klubbId); // Hent klubbens ID fra bane-dataene
        }
    }, [bane]);

    const hentRundeData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner/${baneId}/runde`);
            if (response.ok) {
                const data = await response.json();
                setSpillere(data.spillere);
                setNr(data.hullNr);
                setRundeId(data.rundeId);
                setVisVelgSpillere(false); // Sett visVelgSpillere til false når rundeData er hentet
                localStorage.setItem('visVelgSpillere', JSON.stringify(false));
            } else {
                console.error('Feil ved henting av runde:', await response.json());
            }
        } catch (error) {
            console.error('Feil ved henting av runde:', error);
        }
    };

    const oppdaterpoeng = async (spillerId, endring) => {
        const oppdatertSpillere = spillere.map(spiller => 
            spiller.id === spillerId ? { ...spiller, poeng: spiller.poeng + endring, total: spiller.total + endring } : spiller
        );
        setSpillere(oppdatertSpillere);
        console.log('Oppdaterte spillere:', oppdatertSpillere);

        try {
            const spiller = oppdatertSpillere.find(spiller => spiller.id === spillerId);
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner/${baneId}/runde/${rundeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ spillerId: spiller.id, poeng: spiller.poeng, hullNr: nr })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Feil ved oppdatering av runde:', errorData);
            }
        } catch (error) {
            console.error('Feil ved oppdatering av runde:', error);
        }
    };

    const endreHull = (retning) => {
        if(bane.hull[nr + 1] && retning) {
            setNr(nr + 1);
        }
        else if(bane.hull[nr - 1] && !retning) {
            setNr(nr - 1);
        }
    }

    const handleBekreftSpillere = async (valgteSpillere) => {
        console.log('KlubbID:', klubbId);
        console.log('Valgte spillere:', valgteSpillere);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner/${bane._id}/runde`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ spillere: valgteSpillere, hullNr: nr })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                setSpillere(valgteSpillere);
                setRundeId(data.rundeId); // Sett rundeId fra responsen
                setVisVelgSpillere(false);
                localStorage.setItem('visVelgSpillere', JSON.stringify(false));
                setVisScoreboard(true);
            } else {
                const errorData = await response.json();
                console.error('Feil ved lagring av spillere:', errorData);
            }
        } catch (error) {
            console.error('Feil ved lagring av spillere:', error);
        }
    };

    const handleAvsluttRunde = () => {
        setVisScoreboard(false);
        setVisOppsummering(true);
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
                            <p className="p-5">{spiller.navn}({spiller.total})</p>
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
            {visVelgSpillere && <VelgSpillere bane={bane} onBekreftSpillere={handleBekreftSpillere}/>}
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