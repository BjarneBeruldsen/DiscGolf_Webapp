// Author: Bjarne Hovd Beruldsen
import React from "react";
import UseFetch from './UseFetch'; 
import Nyhetsliste from './Nyhetsliste';

const Nyheter = () => {
  const { data: nyheter, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/nyheterListe`);
  return (
    <div className="min-h-screen bg-gray-200">
      <h1 className="text-xl font-bold flex justify-center pt-2">Alle nyheter:</h1>
      {error && <div>{error}</div>}
      {isPending && <div>Laster...</div>}
      <Nyhetsliste nyheter={nyheter} />
    </div>
  );
};

export default Nyheter;