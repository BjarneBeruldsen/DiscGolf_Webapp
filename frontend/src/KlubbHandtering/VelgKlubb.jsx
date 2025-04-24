//Author: Bjarne Hovd Beruldsen
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";
import { useTranslation } from 'react-i18next';

const VelgKlubb = () => {
    const [klubber, setKlubber] = useState([]);
    const [valgtKlubb, setValgtKlubb] = useState('');
    const minne = useHistory();
    const [laster, setLaster] = useState(false);
    const { bruker } = HentBruker(); // Henter brukerdata fra HentBruker-hooket
    const { t } = useTranslation();


    useEffect(() => {
        setLaster(true);

        console.log('Henter klubber');
        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                let filtrerteKlubber = data;
                if (bruker.rolle !== 'admin' && bruker.rolle !== 'hoved-admin') {
                    filtrerteKlubber = data.filter(klubb =>
                        klubb.medlemmer?.some(medlem => medlem.id === bruker.id && medlem.rolle === 'Klubbleder')
                    );
                }

                setKlubber(filtrerteKlubber);
                setLaster(false);
            })
            .catch(error => {
                console.error('Feil ved henting av klubber:', error);
                setLaster(false);
            });
    }, [bruker]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valgtKlubb) {
            minne.push(`/LagKlubbSide/${valgtKlubb}`);
        }
    };

    return (
        <div className="velg bg-gray-100 p-6 flex justify-center min-h-[100vh]">
            <div className="innhold bg-white p-6 mt-12 rounded-2xl shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{t('Velg en klubb')}</h2>
                <p className="text-center text-gray-600 mb-2">{t('Ikke registrert klubb?')}</p>
                <Link to="/LagKlubb" className="text-center text-blue-600 hover:text-blue-800 underline mb-6 block transition-colors">{t('Opprett ny klubb her')}</Link>
                <p className="text-center text-gray-700 mb-6">{t('Velg en klubb du skal redigere side for:')}</p>
                <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                    <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow-md rounded-2xl sm:px-10 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Klubber:')}
                        </label>
                        <div className="mt-2">
                            <select
                                name="klubber"
                                id="klubber"
                                value={valgtKlubb}
                                onChange={(e) => setValgtKlubb(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="">{t('Velg en klubb')}</option>
                                {klubber.map(klubb => (
                                    <option key={klubb._id} value={klubb._id}>{klubb.klubbnavn}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6">
                        {!laster &&( <button type="submit" className="w-full flex justify-center py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-xl shadow">{t('Velg klubb')}</button>)}
                        {laster &&( <button disabled className="w-full flex justify-center py-3 bg-blue-300 text-white font-medium rounded-xl shadow">{t('Velg klubb..')}</button>)}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VelgKlubb;