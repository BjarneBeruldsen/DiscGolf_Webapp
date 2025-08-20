/* 
Denne filen henter bane-data fra API ved bruk av UseFetch-hooket 
og sender dataene til BaneListe-komponenten for visning.
*/

// Author: Bjarne Hovd Beruldsen
import React from "react";
import BaneListe from "./Baneliste";
import UseFetch from './UseFetch';

const Baner = () => {
  const { data: baner, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/banerListe`);
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      
      {error && <div>{error}</div>}
      {isPending && <div>Laster...</div>}
      <BaneListe baner={baner} />
    </div>
  );
};

export default Baner;