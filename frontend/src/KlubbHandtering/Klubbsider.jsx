/* 
Denne filen viser en oversikt over alle klubber ved å hente data fra API 
og sende det til KlubbListe-komponenten.
*/

// Author: Bjarne Hovd Beruldsen
//Changed by: Laurent Zogaj
import UseFetch from "./UseFetch";
import KlubbListe from "./KlubbListe";
import HentBruker from "../BrukerHandtering/HentBruker";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const Klubbsider = () => {
    const { t } = useTranslation();
    const { bruker, venter } = HentBruker();
    const { data: klubber, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`);

    // Vis laster-melding
    if (laster || venter) {
        return (
            <div className="innhold min-h-[100vh] bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">{t('Laster...')}</p>
                </div>
            </div>
        );
    }

    // Vis feilmelding
    if (error) {
        return (
            <div className="innhold min-h-[100vh] bg-gray-200 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{t('Feil ved henting av klubber')}</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-gray-500 text-sm">{t('Prøv å oppdatere siden eller kontakt support hvis problemet vedvarer.')}</p>
                </div>
            </div>
        );
    }

    // Vis melding hvis ingen klubber
    if (!klubber || klubber.length === 0) {
        const harRettighet = bruker && (bruker.rolle === 'klubbleder' || bruker.rolle === 'admin' || bruker.rolle === 'hoved-admin');
        
        return (
            <div className="innhold min-h-[100vh] bg-gray-200 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Ingen klubber funnet')}</h2>
                    {!bruker ? (
                        <>
                            <p className="text-gray-600 mb-4">{t('Du må være logget inn for å se klubbsider.')}</p>
                            <Link to="/Innlogging" className="text-blue-600 hover:underline">
                                {t('Logg inn her')}
                            </Link>
                        </>
                    ) : !harRettighet ? (
                        <>
                            <p className="text-gray-600 mb-4">{t('Du har ikke tilgang til å se klubbsider med din nåværende rolle.')}</p>
                            <p className="text-gray-500 text-sm mb-4">{t('Kontakt en administrator for å få oppgradert din rolle hvis du skal ha tilgang.')}</p>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-4">{t('Det finnes ingen klubber i systemet ennå.')}</p>
                            <Link to="/LagKlubb" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                {t('Opprett første klubb')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return ( 
        <div className="innhold min-h-[100vh] bg-gray-200 justify-center">
            <KlubbListe klubber={klubber}/>
        </div>
     );
}
 
export default Klubbsider;