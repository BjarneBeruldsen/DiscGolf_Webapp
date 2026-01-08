/* 
Denne filen viser en oversikt over alle klubber ved å hente data fra API 
og sende det til KlubbListe-komponenten.
*/

// Author: Bjarne Hovd Beruldsen
import UseFetch from "./UseFetch";
import KlubbListe from "./KlubbListe";

const Klubbsider = () => {
    const { data: klubber, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/klubber`);

    return ( 
        <div className="innhold min-h-[100vh] bg-gray-200 justify-center">
            {error && <div>{ error }</div>}
            {laster && <div>Laster...</div>}
            {klubber && <KlubbListe klubber={klubber}/>}
        </div>
     );
}
 
export default Klubbsider;