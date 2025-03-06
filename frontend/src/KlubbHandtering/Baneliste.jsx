// Author: Bjarne Hovd Beruldsen
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import HentBruker from "../BrukerHandtering/HentBruker";

const BaneListe = (props) => {
    const baner = props.baner;
    const minne = useHistory();
    const { bruker, venter } = HentBruker();

    const handleClick = (bane) => {
        if(bruker === null) {
            alert('logginn/registrer deg for å spille');
            minne.push('/Innlogging');
        }
        else {
            minne.push(`/ScoreBoard/${bane._id}`); 
        }
    }

    return ( 
        <div>
            {baner && baner.length > 0 ? (
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 lg-grid-cols-2 gap-6">
                        {baner.map((bane, index) => {
                            const antallHull = bane.hull ? bane.hull.length : 0;
                            return (
                                <div className="bg-white rounded-lg shadow-sm p-4 m-4" key={index}>
                                    <div className="topplinje border-b-2 flex justify-between text-xl font-bold">
                                        <p>{bane.baneNavn}</p>
                                        <p className="pl-20">Rating:5/10</p> {/*Kommer senere..*/}
                                    </div>
                                    <div className="hullVanskelighet border-b flex justify-between text-m my-4">
                                        <p>Hull: {antallHull}</p>
                                        <p className="pl-20">Nivå: {bane.vanskelighet}</p> 
                                    </div>
                                    <div className="nederstelinje inline-block">
                                        <div className="beskrivelse pr-4 wrap">
                                            <p>{bane.beskrivelse}</p>
                                        </div>
                                        <div className="knapp">
                                            <button type="submit" onClick={() => handleClick(bane)} className="py-2 px-2 bg-gray-500 rounded-lg text-sm text-white mt-2 hover:bg-gray-400">Spill</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className='flex justify-center'>
                    <h1>Ingen baner tilgjengelig...</h1>
                </div>
            )}
        </div> 
    );
};
 
export default BaneListe;