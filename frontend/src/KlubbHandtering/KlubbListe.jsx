/* 
Denne filen lager en liste over klubber som sendes med som prop. 
Denne listen brukes i Klubbsider-komponenten.
*/

// Author: Bjarne Hovd Beruldsen
//Changed by: Laurent Zogaj

import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const KlubbListe = (props) => {
    const { t } = useTranslation();
    const klubber = props.klubber;

    if (!klubber || klubber.length === 0) {
        return (
            <div className="klubbliste innhold bg-gray-200 py-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">{t('Klubbsider')}</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                    <p className="text-gray-600">{t('Ingen klubber tilgjengelig')}</p>
                </div>
            </div>
        );
    }

    return ( 
        <div className="klubbliste innhold bg-gray-200 py-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">{t('Klubbsider')}</h2>
            {klubber.map((klubb) => (
                <div className="klubbVisning bg-gray-500 mb-4 p-4 rounded-lg shadow max-w-md w-full text-white" key={klubb._id}>
                 <h2 className="text-xl font-bold">{klubb.klubbnavn}</h2>
                 <p className="mt-4">{klubb.kontaktinfo}</p>
                 <Link to= {`/KlubbSide/${klubb._id}`}>
                 <p className="text-white hover:underline hover:text-blue-400">{t('Se klubbsiden her')}</p>
                 </Link>
                </div>
             ))}
        </div>
     );
}
 
export default KlubbListe;