/*  
Denne filen lar brukeren opprette en ny klubb. 
Brukeren kan legge inn klubbnavn, kontaktinformasjon og 
blir automatisk lagt til som klubbleder. 
*/
// Author: Bjarne Hovd Beruldsen
//Changed by: Laurent Zogaj
import { useState } from 'react';   
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { sjekkKlubbnavn, sjekkKontaktinfo } from './validation';
import HentBruker from '../BrukerHandtering/HentBruker';
import { useTranslation } from 'react-i18next';
import { apiKall } from '../utils/api';

const LagKlubb = () => {
    const { t } = useTranslation();
    const [klubbnavn, setKlubbnavn] = useState('');
    const [kontaktinfo, setKontaktinfo] = useState('');
    const [laster, setLaster] = useState(false);
    const minne = useHistory();
    const [errorMelding, setErrorMelding] = useState('');
    const { bruker } = HentBruker(); // Henter brukerdata fra HentBruker-hooket

    //metode som legger til ny klubb i databasen
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setErrorMelding('');

        // Sjekk om brukeren er logget inn og har riktig rolle
        if (!bruker || !bruker.id) {
            setErrorMelding(t('Du må være logget inn for å opprette en klubb'));
            return;
        }
        
        // Sjekk om brukeren har riktig rolle (klubbleder eller høyere, ikke loggetInn eller klubbmedlem)
        const tillatteRoller = ['klubbleder', 'admin', 'hoved-admin'];
        if (!bruker.rolle || !tillatteRoller.includes(bruker.rolle)) {
            setErrorMelding(t('Du må ha rolle som klubbleder eller høyere for å opprette en klubb'));
            return;
        }

        try {
            sjekkKlubbnavn(klubbnavn);
            sjekkKontaktinfo(kontaktinfo);
        } catch(error) {
            setErrorMelding(error.message);
            return;
        }
        const klubbleder = bruker; 


        const medlemmer = [{ id: klubbleder.id, navn: klubbleder.brukernavn, 
            rolle: "Klubbleder", kontaktinfo: klubbleder.epost }]; // Legger til den innloggede brukeren som klubbleder

        const klubb = { klubbnavn, kontaktinfo, medlemmer }; 

        setLaster(true); 

        try {
            const response = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/klubber`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(klubb)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Feil ved lagring av klubb:', errorData);
                setErrorMelding(errorData.error || t('Feil ved lagring av klubb'));
                setLaster(false);
                return;
            }
            
            const data = await response.json();
            
            if (data.errors) {
                console.error('Feil ved lagring av klubb:', data.errors);
                setErrorMelding(data.errors[0].msg);
                setLaster(false);
            } else {
                console.log('Ny klubb lagt til', data);
                setLaster(false);
                alert(t('Ny klubb lagt til'));
                // Bruk insertedId hvis tilgjengelig, ellers bruk _id
                const klubbId = data.insertedId || data._id || (data.acknowledged && data.insertedId);
                if (klubbId) {
                    minne.push(`/LagKlubbSide/${klubbId}`);
                } else {
                    // Hvis ingen ID, last inn på nytt for å hente den nye klubben
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Feil ved lagring av klubb:', error);
            setLaster(false); 
            setErrorMelding(error.message || t('Feil ved lagring av klubb'));
        }
    }


    // Sjekk om brukeren har riktig rolle for å opprette klubb
    const tillatteRoller = ['klubbleder', 'admin', 'hoved-admin'];
    const harRettighet = bruker && bruker.rolle && tillatteRoller.includes(bruker.rolle);

    // Hvis brukeren ikke har riktig rolle, vis melding
    if (bruker && !harRettighet) {
        return (
            <div className="lag bg-gray-200 p-4 flex justify-center min-h-screen">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center text-red-600">{t('Ingen tilgang')}</h2>
                    <p className="text-gray-600 mb-4 text-center">{t('Du har ikke tilgang til å opprette en klubb med din nåværende rolle.')}</p>
                    <p className="text-gray-500 text-sm mb-4 text-center">{t('Kun brukere med rolle som klubbleder, admin eller hoved-admin kan opprette klubber.')}</p>
                    <p className="text-gray-500 text-sm text-center">{t('Kontakt en administrator for å få oppgradert din rolle hvis du skal ha tilgang.')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lag bg-gray-200 p-4 flex justify-center min-h-screen">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center">{t('Legg Til en klubb')}</h2>
                <Link to="/VelgKlubb" className="text-blue-500 underline mb-4 block text-center">{t('Har allerede en klubb?')}</Link>
                <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                    <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <label className="block text-sm font-medium mb-2">
                            {t('Klubbnavn')}:
                        </label>
                        <div className="mt-2 mb-4">
                            <input 
                                type="text" 
                                required
                                value={klubbnavn}
                                onChange={(e) => setKlubbnavn(e.target.value)}
                                setErrorMelding={""}
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <label className="block text-sm font-medium mb-2">
                            {t('Mailadresse')}:
                        </label>
                        <div className="mt-2 mb-4">
                            <input 
                                type="email" 
                                required
                                value={kontaktinfo}
                                onChange={(e) => setKontaktinfo(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <span className='text-red-500'>{errorMelding}</span>
                        </div>
                        <div className="mt-4">
                            {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white">{t('Legg til klubb')}</button>}
                            {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-400 rounded-lg text-sm text-white">{t('Legger til klubb..')}</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LagKlubb;