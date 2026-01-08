/*  
Denne filen er en custom hook som brukes til å hente data fra en gitt URL og håndtere lasting og feil. 
*/
// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from 'react';

const UseFetch = (url) => {
    const [data, setData] = useState(); 
    const [laster, setLaster] = useState(false); 
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        setLaster(true);
        setError(null);
        
        fetch(url, {
            credentials: 'include'
        })
         .then(res => {
            if(!res.ok) {
                throw Error('Kunne ikke hente data');
            }
            return res.json(); 
         })
         .then((data)  => {
            if (!isCancelled) {
                setData(data);
                setLaster(false); 
                setError(null);
            }
         })
         .catch(error => {
            if (!isCancelled) {
                setLaster(false); 
                setError(error.message);
            }
         });
         
        return () => {
            isCancelled = true;
        };
    }, [url]); 
    return { data, laster, error, isPending: laster };
}
 
export default UseFetch;