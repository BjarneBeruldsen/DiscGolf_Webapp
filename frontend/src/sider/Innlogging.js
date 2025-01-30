import React, { useState, useEffect } from "react";

const Innlogging = () => {
    const [bruker, setBruker] = useState("");
    const [passord, setPassord] = useState("");
    const [melding, setMelding] = useState("");
    const [loggetInnBruker, setLoggetInnBruker] = useState(null);

    useEffect(() => {
        const sjekkSession = async () => {
            try {
                const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sjekk-session`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await respons.json();
                if (respons.ok && data.bruker) {
                    setLoggetInnBruker(data.bruker);
                } else {
                    setLoggetInnBruker(null);
                }
            } catch {
                setLoggetInnBruker(null);
            }
        };

        sjekkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMelding("");

        if (!bruker || !passord) {
            setMelding("Alle felt må fylles ut");
            return;
        }

        try {
            const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Innlogging`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bruker: bruker.trim().toLowerCase(), passord }),
                credentials: "include",
            });

            const data = await respons.json();
            if (respons.ok) {
                setMelding("Innlogging vellykket!");
                setLoggetInnBruker(data.bruker);
                localStorage.setItem("bruker", JSON.stringify(data.bruker));
            } else {
                setMelding(data.error || "Innlogging feilet");
            }
        } catch {
            setMelding("Feil ved innlogging");
        }
    };

    const handleLogout = async () => {
        try {
            const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
                method: "POST",
                credentials: "include",
            });

            if (respons.ok) {
                setMelding("Utlogging vellykket!");
                localStorage.removeItem("bruker");
                setLoggetInnBruker(null);
            } else {
                const data = await respons.json();
                setMelding(data.error || "Utlogging feilet");
            }
        } catch {
            setMelding("Feil ved utlogging");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {loggetInnBruker ? (
                <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80">
                    <p className="text-lg font-semibold">Velkommen, {loggetInnBruker.bruker}!</p>
                    {melding && <p className="mt-2">{melding}</p>}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-red-500"
                    >
                        Logg ut
                    </button>
                </div>
            ) : (
                <form 
                    onSubmit={handleSubmit} 
                    className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80"
                >
                    <input
                        type="text"
                        placeholder="Bruker"
                        value={bruker}
                        onChange={(e) => setBruker(e.target.value)}
                        required
                        className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Passord"
                        value={passord}
                        onChange={(e) => setPassord(e.target.value)}
                        required
                        className="px-5 py-3 m-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        className="bg-gray-600 text-black border-radius-2 px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
                    >
                        Logg inn
                    </button>
                    {melding && <p className="mt-4 text-red-500">{melding}</p>}
                </form>
            )}
        </div>
    );
};

export default Innlogging;