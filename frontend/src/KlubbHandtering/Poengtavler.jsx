import { useEffect, useState } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";

const PoengTavler = () => {

    const { bruker, venter } = HentBruker();
    const [poengTavler, setPoengTavler] = useState([]);

    useEffect(() => {
        if (bruker && bruker.poengkort) {
            setPoengTavler(bruker.poengkort);
            console.log(bruker); 
        }
    }, [bruker]);
   
    return (
        <div className="poengtavler flex justify-center bg-gray-200">
            <div className="grid grid-cols-1 lg-grid-cols-2 gap-6">
            {venter && <div>Laster...</div>}
            {poengTavler && poengTavler.length > 0  ? (
                poengTavler.map((poengTavle, index) => (
                    <div className="oppsummering bg-white shadow rounded-lg m-8 border p-5" key={index}>
                        <h2 className="text-center font-bold text-xl mb-4">Poengkort fra: {poengTavle.nyPoengkort.baneNavn}</h2>
                        <table className="border-separate border rounded-lg border-gray-400">
                            <thead>
                                <tr>
                                    <th className="py-2">Spiller</th>
                                    <th className="py-2">Total Poengsum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poengTavle.nyPoengkort && poengTavle.nyPoengkort.spillere ? (
                                    poengTavle.nyPoengkort.spillere.map(spiller => (
                                        <tr key={spiller.id}>
                                            <td className="border px-4 py-2">{spiller.navn}</td>
                                            <td className="border px-4 py-2">{spiller.total}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="border px-4 py-2">Ingen spillere tilgjengelig</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div className='flex justify-center'>
                    <h1>Ingen poengtavler tilgjengelig...</h1>
                </div>
            )}
            </div>
        </div>
    );
};

export default PoengTavler;