/*  
Denne filen viser en liste over medlemmer i en klubb, 
inkludert deres roller og kontaktinformasjon. 
*/
// Author: Bjarne Hovd Beruldsen
import React from 'react';
import { useTranslation } from 'react-i18next';

const Medlemmerliste = ({ medlemmer }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4 bg-gray shadow rounded-lg h-[100vh]">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 border-b">{t('Medlemmer')}</h1>
                <ul className="">
                    {medlemmer && medlemmer.length > 0 ? (
                        medlemmer.map((medlem, index) => (
                            <li key={index} className="py-4 flex items-center">
                                <div className="flex-1 border-b border-gray-200 pb-2">
                                    <p className="text-lg font-medium text-gray-900">{medlem.navn}</p>
                                    <p className="text-sm text-gray-500">
                                        {t('Rolle')}: {medlem.rolle ? medlem.rolle : t('Bruker')}
                                    </p>
                                    {medlem.kontaktinfo ? (
                                        <p className="text-sm text-gray-500">{t('kontaktinfo')}: {medlem.kontaktinfo}</p>
                                    ) : (
                                        null
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">{t('Ingen medlemmer funnet.')}</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Medlemmerliste;