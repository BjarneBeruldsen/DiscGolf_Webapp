import React, { useState } from "react";

const Registrering = () => {
    const [bruker, setBruker] = useState("");
    const [passord, setPassord] = useState("");
    const [melding, setMelding] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMelding("");

        if (!bruker || !passord) {
            setMelding("Brukernavn og passord må fylles ut");
            return;
        }
        try {
            const respons = await fetch("http://localhost:8000/Registrering", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bruker, passord }),
            });

            const data = await respons.json();

            if (respons.ok) {
                setMelding("Registrering vellykket! Du kan nå logge inn.");
            } else {
                setMelding(data.error || "Registrering feilet.");
            }
        } catch (error) {
            console.error("Feil ved registrering:", error);
            setMelding("Noe gikk galt. Prøv igjen.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Opprett bruker</h2>
                
                {melding && <p className="mb-4 text-red-500 text-center">{melding}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Brukernavn"
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
                        className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-3 mt-4 rounded-lg w-full hover:bg-blue-700 transition duration-200"
                    >
                        Opprett bruker
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registrering;