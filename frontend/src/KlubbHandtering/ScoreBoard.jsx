// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from "react";

const ScoreBoard = () => {
    const [poeng, setPoeng] = useState(0);
    const [par, setPar] = useState(3);
    const [total, setTotal] = useState(0);
    const [spillere, setSpillere] = useState([
        { id: 1, navn: "B1", poeng: 0, total: 0 },
        { id: 2, navn: "B2", poeng: 0, total: 0 },
        { id: 3, navn: "B3", poeng: 0, total: 0 }
,    ]);

    useEffect(() => {
        setPoeng(poeng-par);
    }, [par]);

    const oppdaterpoeng = (id, endring) => {
        setSpillere(spillere.map(spiller => 
            spiller.id === id ? { ...spiller, poeng: spiller.poeng + endring, total: spiller.total + endring } : spiller
        ));
    };

    return (
        <div className="innhold flex justify-center bg-gray-200">
            <div className="hovedpanel bg-white shadow rounded-lg m-8 border">
                <div className="paneltop flex p-5 font-bold border-b">
                    <p>Hull: 1</p>
                    <p className="px-5 ">Avstand: 200m</p>
                    <p>Par: {par}</p>
                </div>
                <div className="midtpanel font-bold">
                    {spillere.map(spiller => (
                        <div key={spiller.id} className="spiller flex justify-center items-center my-2 border-b">
                            <p className="p-5">{spiller.navn}({spiller.total})</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, -1)} className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow px-4 py-2 font-sans">-</button>
                            <p className="p-5">{spiller.poeng}</p>
                            <button onClick={() => oppdaterpoeng(spiller.id, 1)} className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow px-4 py-2">+</button>
                        </div>
                    ))}
                </div>
                <div className="bunn-panel flex justify-between py-2">
                    <button className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow mx-2 px-4 py-2">{"<-"}</button>
                    <button className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow mx-2 px-4 py-2">{"->"}</button>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;