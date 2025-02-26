// Author: Bjarne Hovd Beruldsen
import UseFetch from "./UseFetch";
import KlubbListe from "./KlubbListe";

const Klubbsider = () => {
    const { data: klubber, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`);

    return ( 
        <div className="innhold">
            {error && <div>{ error }</div>}
            {laster && <div>Laster...</div>}
            {klubber && <KlubbListe klubber={klubber}/>}
        </div>
     );
}
 
export default Klubbsider;