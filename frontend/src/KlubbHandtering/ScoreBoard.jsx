// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UseFetch from './UseFetch';

const ScoreBoard = () => {
    const { id } = useParams();
    const { data: bane, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/baner/${id}`);
    const [poeng, setPoeng] = useState(0);
    const [hull, setHull] = useState([]);
    const [total, setTotal] = useState(0);
    const [nr, setNr] = useState(0);
    const [spillere, setSpillere] = useState([
        { id: 1, navn: "B1", poeng: 0, total: 0 },
        { id: 2, navn: "B2", poeng: 0, total: 0 },
        { id: 3, navn: "B3", poeng: 0, total: 0 }
    ]);

    useEffect(() => {
        if (bane && bane.hull) {
            setHull(bane.hull);
        }
    }, [bane]);

    useEffect(() => {
        setPoeng(poeng - 0);
    }, [hull]);

    const oppdaterpoeng = (id, endring) => {
        setSpillere(spillere.map(spiller => 
            spiller.id === id ? { ...spiller, poeng: spiller.poeng + endring, total: spiller.total + endring } : spiller
        ));
    };

    const endreHull = (retning) => {
        if(bane.hull[nr + 1] && retning) {
            setNr(nr + 1);
        }
        else if(bane.hull[nr - 1] && !retning) {
            setNr(nr - 1);
        }
    }

    return (
        <div className="innhold flex justify-center bg-gray-200">
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
                    <button onClick={() => endreHull(true)} className="rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2">{"->"}</button>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;