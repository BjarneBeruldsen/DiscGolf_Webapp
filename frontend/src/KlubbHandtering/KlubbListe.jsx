/* 
Denne filen lager en liste over klubber som sendes med som prop. 
Denne listen brukes i Klubbsider-komponenten.
*/

// Author: Bjarne Hovd Beruldsen

import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const KlubbListe = (props) => {
    const { t } = useTranslation();
    const klubber = props.klubber;

    return ( 
        <div className="klubbliste innhold bg-gray-200 py-4 flex flex-col items-center">
            <h2>{t('Klubbsider')}</h2>
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