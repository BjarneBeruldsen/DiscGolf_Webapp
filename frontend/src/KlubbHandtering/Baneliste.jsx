import React from "react";

const BaneListe = (props) => {
    const baner = props.baner;

    return ( 
        <div>
            {baner && baner.length > 0 ? (
                baner.map((bane, index) => (
                    <div className='flex justify-center' key={index}>
                        <h1>{bane.baneNavn}</h1>
                    </div>
                ))
            ) : (
                <div className='flex justify-center'>
                    <h1>Ingen baner tilgjengelig</h1>
                </div>
            )}
        </div> 
    );
};
 
export default BaneListe;