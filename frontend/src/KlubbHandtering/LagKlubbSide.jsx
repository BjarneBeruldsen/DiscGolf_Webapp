/*  
Denne filen viser informasjon om en spesifikk klubb, lar brukeren legge til 
nyheter, baner, turneringer, og redigere eksisterende baner. 
*/
// Author: Bjarne Hovd Beruldsen
//Changed by: Laurent Zogaj
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sjekkNyhetTittel, sjekkNyhet } from './validation';
import LagBane from './LagBane';
import LagTurnering from './LagTurnering';
import RedigerBane from './RedigerBane';
import { useTranslation } from 'react-i18next';
import { apiKall } from '../utils/api';

const LagKlubbside = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [klubb, setKlubb] = useState(null);
    const [nyhetTittel, setNyhetTittel] = useState('');
    const [nyhet, setNyhet] = useState('');
    const [laster, setLaster] = useState(false);
    const minne = useHistory();
    const [visNyhetForm, setVisNyhetForm] = useState(false);
    const [visBaneForm, setVisBaneForm] = useState(false);
    const [visTurneringForm, setVisTurneringForm] = useState(false);
    const [errorMelding, setErrorMelding] = useState('');  
    const [visRedigerBane, setVisRedigerBane] = useState(false);
    const [fil, setFil] = useState(null);
    

    // Henter klubbdata fra API
    useEffect(() => {
        apiKall(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`, {
            method: 'GET',
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Kunne ikke hente klubb');
                }
                return res.json();
            })
            .then(data => {
                console.log('Klubb hentet:', data);
                setLaster(false);
                setKlubb(data);
            })
            .catch(error => {
                console.error('Feil ved henting av klubb:', error);
            });
    }, [id]);

    //legger til nyheter samt pdf-fil, visst den eksisterer
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            sjekkNyhetTittel(nyhetTittel);
            sjekkNyhet(nyhet);
        } catch (error) {
            setErrorMelding(error.message);
            setLaster(false);
            return;
        }

        let filPath = null;
        if (fil) {
            // Ekstra validering før opplasting
            if (fil.type !== 'application/pdf' || !fil.name.toLowerCase().endsWith('.pdf')) {
                setErrorMelding(t('Kun PDF-filer er tillatt'));
                setLaster(false);
                return;
            }
            
            const formData = new FormData();
            formData.append('pdf', fil);

            // For FormData, ikke sett Content-Type header (la browseren sette det automatisk)
            const response = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                setErrorMelding('Feil ved opplasting av fil');
                setLaster(false);
                return;
            }

            const data = await response.json();
            filPath = data.filePath; // Relative path to the uploaded file
        }

        const nyNyhet = {
            nyhetTittel,
            nyhet,
            tid: new Date().getTime() / 1000,
            fil: filPath,
            klubbId: id, 
        };

        apiKall(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}/nyheter`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nyNyhet),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Feil ved lagring av nyhet');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Ny nyhet lagt til', data);
                setNyhetTittel('');
                setNyhet('');
                setFil(null);
                alert('Ny nyhet lagt til');
                minne.push(`/`);
            })
            .catch((error) => {
                console.error('Feil ved lagring av nyhet:', error);
            });
    };

    //styrer visning av nyheter, baner, turneringer og rediger bane
    const behandleVisning = (seksjon) => {
        setVisNyhetForm(seksjon === 'nyhet'); 
        setVisBaneForm(seksjon === 'bane');
        setVisTurneringForm(seksjon === 'turnering')
        setVisRedigerBane(seksjon === 'redigerBane');
    }

    //varsler om at bane er lagt til og skjuler skjemaet
    const handleBaneLagtTil = () => {
        setVisBaneForm(false);
        alert('Ny bane lagt til');
    }

    //henter filen som er valgt og validerer at det er en PDF
    const handleEndring = (e) => {
        const filListe = e.target.files;
        if (filListe && filListe.length > 0) {
            const valgtFil = filListe[0];
            
            // Valider filtype
            if (valgtFil.type !== 'application/pdf') {
                setErrorMelding(t('Kun PDF-filer er tillatt'));
                e.target.value = ''; // Nullstill input
                setFil(null);
                return;
            }
            
            // Valider filendelse
            if (!valgtFil.name.toLowerCase().endsWith('.pdf')) {
                setErrorMelding(t('Kun PDF-filer er tillatt'));
                e.target.value = ''; // Nullstill input
                setFil(null);
                return;
            }
            
            // Valider filstørrelse (10MB maks)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (valgtFil.size > maxSize) {
                setErrorMelding(t('Filen er for stor. Maksimal størrelse er 10MB'));
                e.target.value = ''; // Nullstill input
                setFil(null);
                return;
            }
            
            setFil(valgtFil);
            setErrorMelding(''); // Nullstill feilmelding hvis alt er OK
            console.log('Fil valgt:', valgtFil.name, 'Type:', valgtFil.type, 'Størrelse:', valgtFil.size);
        }
    }


    return (
        <div className=" bg-gray-200">
            <div className="lagklubbside p-4 mt-8 min-h-[100vh]">
                {klubb ? (
                    <>
                        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                            <div className='overskriftpanel bg-white border-b'>
                                <h2 className="text-3xl font-bold">{t('Klubb')}: {klubb.klubbnavn}</h2>
                                <p className="text-2xl font-bold">{t('Kontaktinfo')}: {klubb.kontaktinfo}</p>
                            </div>
                            <div className='flex justify-center'>
                            <button onClick={() => behandleVisning("nyhet")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">{t('Nyhet')}
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            <button onClick={() => behandleVisning("bane")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">{t('Bane')}
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            <button onClick={() => behandleVisning("turnering")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">{t('Turnering')}
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            <button onClick={() => behandleVisning("redigerBane")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">{t('Rediger Bane')}
                                <svg className='w-6 pl-2 inline-block' xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 506.3"><path fill="#fff" fill-rule="nonzero" d="M119.42 6.87h125.91l-60.09 62.8h-65.82c-15.62 0-29.77 6.34-39.97 16.53l-.12.13a56.351 56.351 0 00-16.54 39.97v317.24h317.25c15.63 0 29.77-6.34 39.97-16.54l.12-.12c10.2-10.2 16.54-24.35 16.54-39.97V322.1l62.79-65.59v130.4c0 32.73-13.42 62.55-35.05 84.24l-.2.2c-21.68 21.58-51.48 34.98-84.17 34.98H47.92c-13.08 0-25.02-5.38-33.75-14.05l-.18-.19C5.36 483.38 0 471.46 0 458.42V126.3c0-32.74 13.43-62.56 35.06-84.25l.19-.19C56.94 20.27 86.72 6.87 119.42 6.87zm184.8 311.78l-122.6 24.97 17.73-130.45 104.87 105.48zm-66.17-144.94L401.27 3.81c4.47-3.72 8.95-5.16 14.11-2.2l93.64 90.68c3.72 4.48 4.48 9.64-.76 14.87l-165.41 172.1-104.8-105.55z"/></svg>                            </button>
                            </div>
                        </div>
                        {visNyhetForm && (
                            <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                                    <h3 className="text-2xl font-bold">{t('Legg til nyheter')}</h3>
                                    <form onSubmit={handleSubmit}>
                                        <label className="block text-sm font-medium">
                                            {t('Nyhetstittel')}: 
                                        </label>
                                        <div className="mt-2">
                                            <input 
                                                type="text" 
                                                required
                                                value={nyhetTittel}
                                                onChange={(e) => setNyhetTittel(e.target.value)}
                                                className="w-full border border-gray-600 rounded-lg shadow-sm
                                                           px-4 py-2 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <label className="block text-sm font-medium mt-2">
                                            {t('Nyhet')}:
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                type="text"
                                                required
                                                rows="5"
                                                cols="50"
                                                value={nyhet}
                                                onChange={(e) => setNyhet(e.target.value)}
                                                className="w-full border border-gray-600 rounded-lg shadow-sm
                                                           px-4 py-2 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div className='mb-5'>
                                            <label>{t('Last opp pdf')}:</label>
                                            <div className="mt-2">
                                                <label className="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-800">
                                                    {t('Velg fil')}
                                                    <input 
                                                        type="file"
                                                        name="pdf" 
                                                        className="hidden"
                                                        accept='application/pdf'
                                                        onChange={(e) => {handleEndring(e)}}                        
                                                    />
                                                </label>
                                                <label className='ml-2'>{fil ? fil.name : t('Ingen fil valgt')}</label>
                                            </div>
                                        </div>
                                        <span className='text-red-500'>{ errorMelding }</span>
                                        <div className="mt-4">
                                            {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white mt-2">{t('Legg til nyhet')}</button>}
                                            {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-300 rounded-lg text-sm text-white">{t('Legg til nyhet..')}</button>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {visBaneForm && <LagBane klubbId={id} onBaneLagtTil={handleBaneLagtTil} />}
                        {visTurneringForm && <LagTurnering klubbId={id} />}
                        {visRedigerBane && <RedigerBane klubb={klubb} klubbId={id} />}
                    </>
                ) : (
                    <p>Laster klubbdata...</p>
                )}
            </div>
        </div>
    );
}

export default LagKlubbside;