import { useEffect, useState } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";

const PoengTavler = () => {

    const { bruker, venter } = HentBruker();
    const [poengTavler, setPoengTavler] = useState([]);
    const [visStatistikk, setVisStatistikk] = useState(true);
    const [visPoengtavler, setVisPoengtavler] = useState(false);
    const [valgtSeksjon, setValgtSeksjon] = useState('statistikk');
    const [brukernavn, setBrukernavn] = useState('');   

    useEffect(() => {
        if (bruker && bruker.poengkort) {
            setPoengTavler(bruker.poengkort);
            setBrukernavn(bruker.brukernavn);
            console.log(bruker); 
        }
    }, [bruker]);

    const handleVis = (seksjon) => {
        setValgtSeksjon(seksjon);
        setVisPoengtavler(seksjon === 'poengtavler');
        setVisStatistikk(seksjon === 'statistikk');
    };
   
    return (
        <div className="statistikk bg-gray-200">
            <div className='topp-panel bg-white p-4 shadow w-full'>
                <div className='overskrift border-b'>
                    <h2 className="text-3xl font-bold">{ brukernavn }sin statistikk</h2>
                </div>
                <div className='navbar p-2'>
                    <button onClick={() => handleVis('statistikk')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'statistikk' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Statistikk</button>
                    <button onClick={() => handleVis('poengtavler')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'poengtavler' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Poengtavler</button>
                </div>
            </div>
            {venter && <div>Laster...</div>}
            {visPoengtavler ? ( 
            <div className="grid md-grid-cols-2 gap-4">
            {poengTavler && poengTavler.length > 0  ? (
                poengTavler.map((poengTavle, index) => (
                    <div className="oppsummering bg-white shadow rounded-lg m-8 border p-5 min-w-80" key={index}>
                        <h2 className="text-center font-bold text-xl mb-4">Poengkort fra: {poengTavle.nyPoengkort.baneNavn}</h2>
                        <div className="bg-white shadow-md rounded-xl">
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b bg-gray-200 rounded-tl-xl">Spiller</th>
                                        <th className="p-4 border-b bg-gray-200">Antall kast</th>
                                        <th className="p-4 border-b bg-gray-200 rounded-tr-xl">Total Poengsum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poengTavle.nyPoengkort && poengTavle.nyPoengkort.spillere ? (
                                        poengTavle.nyPoengkort.spillere.map(spiller => (
                                            <tr className="even:bg-gray-100" key={spiller.id}>
                                                <td className="p-4">{spiller.navn}</td>
                                                <td className="p-4">{spiller.total}</td>
                                                <td className="p-4">{spiller.total}</td>
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
                    </div>
                ))
            ) : (
                <div className='flex justify-center'>
                    <h1>Ingen poengtavler tilgjengelig...</h1>
                </div>
            )}
            </div> 
            ) : (
                <div className="flex justify-center">
                    <div className="statistikk bg-white shadow rounded-xl m-8 p-5 w-full">
                        <p>kommer senere..</p>
                    <div className="grid md-grid-cols-3 gap-6">
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">Antall runder</p>
                                <p className="text-xl font-bold">100</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">Gjennomsnitlig score</p>
                                <p className="text-xl font-bold">100</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">Antall kast totalt</p>
                                <p className="text-xl font-bold">100</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">Gjennomsnitlig kast pr.runde</p>
                                <p className="text-xl font-bold">100</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <p className="text-sm">Beste score</p>
                            <p className="text-xl font-bold">100</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <p className="text-sm">Antall hole in one</p>
                            <p className="text-xl font-bold">100</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoengTavler;