// Author: Bjarne Hovd Beruldsen
import { useEffect, useState } from 'react';

const UseFetch = (url) => {
    const [data, setData] = useState(); 
    const [laster, setLaster] = useState(false); 
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
         .then(res => {
            if(!res.ok) {
                throw Error('Kunne ikke hente data');
            }
            return res.json(); 
         })
         .then((data)  => {
            console.log(data);
            setData(data);
            setLaster(false); 
            setError(null);
         })
         .catch(error => {
            setLaster(false); 
            setError(error.message);
         })
    }, [url]); 
    return { data, laster, error };
}
 
export default UseFetch;