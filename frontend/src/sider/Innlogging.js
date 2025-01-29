import React from 'react';
import { useState } from "react";


const Innlogging = () => {
    const [bruker, setBruker] = useState("");
    const [passord, setPassord] = useState("");
    const [melding, setMelding] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMelding(""); 

        if (!bruker || !passord) {
            setMelding("Alle felt må fylles ut");
            return;
        }

        try {
            const respons = await fetch("http://localhost:8000/Innlogging", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bruker, passord }),
            });

            const data = await respons.json();

            if (respons.ok) {
                setMelding("Innlogging vellykket!");
                console.log("Bruker:", data.bruker); 
            } else {
                setMelding(data.error || "Innlogging feilet");
            }
        } catch (error) {
            setMelding("Feil passord eller brukernavn");
            console.error("Feil ved innlogging:", error);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
                className="px-5 py-3 m-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
                type="password"
                placeholder="Passord"
                value={passord}
                onChange={(e) => setPassord(e.target.value)}
                required
                className="px-5 py-3 m-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
                type="submit"
                className="bg-gray-600 text-black border-radius-2 px-4 py-2 mt-4 rounded-full w-full border border-gray-500;"
            >
                Logg inn
            </button>
            {melding && <p className="mt-4 text-red-500">{melding}</p>}
        </form>
    </div>

    );
};

export default Innlogging;