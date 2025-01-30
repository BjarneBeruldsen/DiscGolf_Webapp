import { useParams } from 'react-router-dom';
import UseFetch from './UseFetch';

const Klubbside = () => {
    const { id } = useParams(); // Henter id fra URL-parametrene
    const { data: klubb, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`);

    return ( 
        <div className="innhold">
            { laster && <div>Laster...</div> }
            { error && <div>{ error }</div> }
            { klubb && (
                <article>
                    <h2>{ klubb.klubbnavn}</h2>
                    <p>{ klubb.kontaktinfo }</p>
                    <h3>Nyheter: </h3>
                    { klubb.nyheter && klubb.nyheter.map((nyhet, index) => (
                        <div key={index}>
                            <h4>{ nyhet.nyhetTittel }</h4>
                            <p>{ nyhet.nyhet }</p>
                        </div>
                    ))}
                </article>
            )}
        </div>
     );
}
 
export default Klubbside;