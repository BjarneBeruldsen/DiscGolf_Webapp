//Author: Bjarne Hovd Beruldsen

import UseFetch from "../KlubbHandtering/UseFetch";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Varsling = ({ toggleVarsling }) => {
    const { data: klubber, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`);
    const [nyheter, setNyheter] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const itemsPerPage = 4; 

    useEffect(() => {
        if (klubber && klubber.length > 0) {
            const nyheterMedKlubb = klubber
                .filter(klubb => Array.isArray(klubb.nyheter))
                .map(klubb =>
                    klubb.nyheter.map(nyhet => ({
                        ...nyhet,
                        klubbNavn: klubb.klubbnavn,
                        klubbId: klubb._id
                    }))
                )
                .flat();
            setNyheter(nyheterMedKlubb);
        }
    }, [klubber]);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNyheter = nyheter.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (endIndex < nyheter.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="fixed top-16 right-4 bg-gray-200 text-black rounded-lg shadow-md p-4 z-50 w-80">
            <div className="flex justify-between items-center border-b pb-2">
                <h1 className="text-md font-bold">Oppdateringer</h1>
                <button className="text-2xl hover:bg-gray-500 hover:rounded-full px-3 pb-1" onClick={toggleVarsling}>x</button>
            </div>
            {error && <div>{error}</div>}
            {isPending && <div>Laster...</div>}
            <p className="text-xs mt-2">Her er dine siste varsler.</p>
            {currentNyheter.length > 0 ? (
                currentNyheter.map((nyhet, index) => (
                    <div key={index} className="bg-white p-2 rounded-lg mt-4">
                        <h2 className="text-md font-bold">{nyhet?.nyhetTittel || "Ukjent tittel"}</h2>
                        <p className="text-sm">Klubb: {nyhet.klubbNavn || "Ukjent klubb"}</p>
                        <Link
                            onClick={toggleVarsling}
                            to={`/KlubbSide/${nyhet.klubbId}`}
                            className="underline text-sm"
                        >
                            Se nyheten her
                        </Link>
                    </div>
                ))
            ) : (
                <p className="text-xs">Ingen varsler tilgjengelig.</p>
            )}
            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className={`rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2 ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {"<-"}
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={endIndex >= nyheter.length}
                    className={`rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2 ${endIndex >= nyheter.length ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {"->"}
                </button>
            </div>
        </div>
    );
};

export default Varsling;