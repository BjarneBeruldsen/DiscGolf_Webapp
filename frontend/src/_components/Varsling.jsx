//Author: Bjarne Hovd Beruldsen

import UseFetch from "../KlubbHandtering/UseFetch";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HentBruker from "../BrukerHandtering/HentBruker";

const Varsling = ({ toggleVarsling }) => {
    const { data: klubber, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`);
    const [nyheter, setNyheter] = useState([]);
    const [invitasjoner, setInvitasjoner] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [laster, setLaster] = useState(true); 
    const [varslinger, setVarslinger] = useState([]);
    const { bruker, venter } = HentBruker();
    const itemsPerPage = 4; 

    useEffect(() => {
        if(bruker) {
            console.log("Bruker:", bruker);
            setInvitasjoner(bruker.invitasjoner || []);
        }

        if (klubber && klubber.length > 0) {
            const nyheterMedKlubb = klubber
                .filter(klubb => Array.isArray(klubb.nyheter))
                .map(klubb =>
                    klubb.nyheter.map(nyhet => ({
                        ...nyhet,
                        klubbNavn: klubb.klubbnavn,
                        klubbId: klubb._id,
                        tid: nyhet.tid || 0 // Hvis nyhet ikke har tid, bruk 0 som fallback
                    }))
                )
                .flat();

            const alleVarslinger = [
                ...(bruker?.invitasjoner || []).map(i => ({ ...i, tid: i.invitasjon?.tid || 0 })),
                ...nyheterMedKlubb
            ];

            // Sorter etter tid synkende
            alleVarslinger.sort((a, b) => b.tid - a.tid);

            setVarslinger(alleVarslinger);
            console.log("Sorterte varslinger:", alleVarslinger);
            setLaster(false);
        }
    }, [klubber, bruker]);


    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVarslinger = varslinger.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (endIndex < varslinger.length) {
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
            {isPending && laster && <div>Laster...</div>}
            <p className="text-xs mt-2">Her er dine siste varsler.</p>
            {currentVarslinger.length > 0 ? (
            currentVarslinger.map((varsling, index) => (
            <div key={index} className="bg-white px-2 rounded-lg mt-4">
            {varsling.nyhetTittel ? (
                // Hvis det er en nyhet
                <>
                    <h2 className="text-md font-bold">{varsling.nyhetTittel || "Ukjent tittel"}</h2>
                    <p className="text-sm">Klubb: {varsling.klubbNavn || "Ukjent klubb"}</p>
                    <Link
                        onClick={toggleVarsling}
                        to={`/KlubbSide/${varsling.klubbId}`}
                        className="underline text-sm"
                    >
                        Se nyheten her
                    </Link>
                </>
            ) : varsling.invitasjon ? (
                console.log("Invitasjon:", varsling.invitasjon),
                // Hvis det er en invitasjon
                <>
                    <h2 className="text-md font-bold">Invitasjon til runde</h2>
                    <p className="text-sm">Avsender: {varsling.invitasjon.avsender || "Ikke definert"}</p>
                    <div className="">
                        <button className="w-7 cursor-pointer">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                        <button className="w-7 cursor-pointer">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 6L18 18M18 6L6 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-sm">Ukjent varslingstype</p>
            )}
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
                    disabled={endIndex >= varslinger.length}
                    className={`rounded-full text-white bg-gray-500 hover:bg-gray-200 shadow mx-2 px-4 py-2 ${endIndex >= varslinger.length ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {"->"}
                </button>
            </div>
        </div>
    );
};

export default Varsling;