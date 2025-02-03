import React, { useState } from "react";

const Registrering = () => {
    const [bruker, setBruker] = useState("");
    const [passord, setPassord] = useState("");
    const [melding, setMelding] = useState("");

    const handleSubmit = async (event) => {             //https://react-hook-form.com/docs/useform/handlesubmit
        event.preventDefault();
        setMelding("");

        if (!bruker || !passord) {
            setMelding("Brukernavn og passord må fylles ut");
            return;
        }
        try {
            const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Registrering`, {
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
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80"
            >
                <h2 className="text-xl font-bold mb-4">Registrering deg som bruker!</h2>

                <input
                    type="text"
                    placeholder="Brukernavn"
                    value={bruker}
                    onChange={(e) => setBruker(e.target.value)}
                    required
                    className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Passord"
                    value={passord}
                    onChange={(e) => setPassord(e.target.value)}
                    required
                    className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <button
                    type="submit"
                    className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
                >
                    Registrer deg
                </button>

                {melding && <p className="mt-4 text-red-500">{melding}</p>}
            </form>
        </div>
    );
};

export default Registrering;