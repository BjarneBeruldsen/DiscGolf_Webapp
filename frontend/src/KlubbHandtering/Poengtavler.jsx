/*  
Denne filen viser brukerens poengtavler og statistikk, inkludert antall runder, 
gjennomsnittlig score og beste score. 
*/
// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";
import { useTranslation } from 'react-i18next';

const PoengTavler = () => {
    const { t } = useTranslation();
    const { bruker, venter } = HentBruker();
    const [poengTavler, setPoengTavler] = useState([]);
    const [visStatistikk, setVisStatistikk] = useState(true);
    const [visPoengtavler, setVisPoengtavler] = useState(false);
    const [valgtSeksjon, setValgtSeksjon] = useState('statistikk');
    const [brukernavn, setBrukernavn] = useState('');   
    //statistikk variabler
    const [antRunder, setAntRunder] = useState(0);
    const [gjennomsnittligScore, setGjennomsnittligScore] = useState(0);
    const [antallKastTotalt, setAntallKastTotalt] = useState(0);
    const [gjennomsnittligKast, setGjennomsnittligKast] = useState(0);
    const [besteScore, setBesteScore] = useState(0);
    const [antHoleInOne, setAntHoleInOne] = useState(0);

    // Henter brukerdata
    useEffect(() => {
        if (bruker && bruker.poengkort && bruker.poengkort.length > 0) {
            setPoengTavler(bruker.poengkort);
            setBrukernavn(bruker.brukernavn);
        }
    }, [bruker]);

    // beregner statistikk når poengTavler basert på brukerens poengkort
    useEffect(() => {
        let totalScore = 0;
        let totalKast = 0;
        let bestScore = 0;
        let holeInOneCount = 0;

        poengTavler.map((poengTavle) => {
            if (poengTavle.nyPoengkort && poengTavle.nyPoengkort.spillere) {
                const spillere = poengTavle.nyPoengkort.spillere;
                setAntRunder(poengTavler.length);
        
                const spiller = spillere[0]
                totalScore += spiller.total || 0;
                totalKast += sumKast(spiller) || 0; 
                if(spiller.total < bestScore) {
                    bestScore = spiller.total;
                }
        
                //finner antall hole in one
                for (let i = 0; i < spiller.antallKast.length; i++) {
                    if (spiller.antallKast[i] === 1) {
                        holeInOneCount++;
                    }
                }

                setAntallKastTotalt(totalKast);
                setGjennomsnittligScore(Math.round(totalScore / poengTavler.length));
                setGjennomsnittligKast(Math.round(totalKast / poengTavler.length));
                setBesteScore(bestScore);
                setAntHoleInOne(holeInOneCount);
            }
        })
    }, [poengTavler]);

    // Funksjon for å håndtere visning av seksjoner
    const handleVis = (seksjon) => {
        setValgtSeksjon(seksjon);
        setVisPoengtavler(seksjon === 'poengtavler');
        setVisStatistikk(seksjon === 'statistikk');
    };

    // beregner antall kast for hver spiller
    const sumKast = (spiller) => {
        let sum = 0;
        if (spiller.antallKast) {
            for (let i = 0; i < spiller.antallKast.length; i++) {
                sum += spiller.antallKast[i] || 0; 
            }
        }
        return sum;
    }
   
    return (
        <div className="statistikk bg-gray-200 min-h-[100vh]">
            <div className='topp-panel bg-white p-4 shadow w-full mb-25'>
                <div className='overskrift border-b'>
                    <h2 className="text-3xl font-bold">{brukernavn} {t('sin statistikk')}</h2>
                </div>
                <div className='navbar p-2'>
                    <button onClick={() => handleVis('statistikk')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'statistikk' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Statistikk')}</button>
                    <button onClick={() => handleVis('poengtavler')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'poengtavler' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Poengtavler')}</button>
                </div>
            </div>
            {venter && <div>{t('Laster...')}</div>}
            {visPoengtavler ? ( 
            <div className="grid lg-grid-cols-2 gap-4">
            {poengTavler && poengTavler.length > 0  ? (
                poengTavler.map((poengTavle, index) => (
                    <div className="oppsummering bg-white shadow rounded-lg m-8 border p-5 min-w-80" key={index}>
                        <h2 className="text-center font-bold text-xl mb-4">{t('Poengkort fra')}: {poengTavle.nyPoengkort.baneNavn}</h2>
                        <div className="bg-white shadow-md rounded-xl">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b bg-gray-200 rounded-tl-xl">{t('Spiller')}</th>
                                        <th className="p-4 border-b bg-gray-200">{t('Antall kast')}</th>
                                        <th className="p-4 border-b bg-gray-200 rounded-tr-xl">{t('Total Poengsum')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poengTavle.nyPoengkort && poengTavle.nyPoengkort.spillere ? (
                                        poengTavle.nyPoengkort.spillere.map(spiller => (
                                            <tr className="even:bg-gray-100" key={spiller.id}>
                                                <td className="p-4">{spiller.navn}</td>
                                                <td className="p-4">{sumKast(spiller)}</td>
                                                <td className="p-4">{spiller.total}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="border px-4 py-2">{t('Ingen spillere tilgjengelig')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div className='flex justify-center'>
                    <h1>{t('Ingen poengtavler tilgjengelig...')}</h1>
                </div>
            )}
            </div> 
            ) : (
                <div className="flex justify-center">
                    <div className="statistikk bg-white shadow rounded-xl m-8 p-5 w-full">
                    <div className="grid md-grid-cols-3 gap-6">
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">{t('Antall runder')}</p>
                                <p className="text-xl font-bold">{antRunder}</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">{t('Gjennomsnittlig score')}</p>
                                <p className="text-xl font-bold">{gjennomsnittligScore}</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">{t('Antall kast totalt')}</p>
                                <p className="text-xl font-bold">{antallKastTotalt}</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                                <p className="text-sm">{t('Gjennomsnittlig kast pr.runde')}</p>
                                <p className="text-xl font-bold">{gjennomsnittligKast}</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <p className="text-sm">{t('Beste score')}</p>
                            <p className="text-xl font-bold">{besteScore}</p>
                            </div>
                            <div className="bg-gray-100 shadow-md rounded-xl p-4">
                            <p className="text-sm">{t('Antall hole in one')}</p>
                            <p className="text-xl font-bold">{antHoleInOne}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoengTavler;