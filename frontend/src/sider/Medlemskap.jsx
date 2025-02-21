import React, { useState } from "react";
import { useHistory } from "react-router-dom"; 

const Medlemskap = ({ loggetInnBruker }) => {
  const [visSlettSkjema, setVisSlettSkjema] = useState(false);
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const history = useHistory(); 

  const handleSlettBruker = async (e) => {
    e.preventDefault();
    setMelding("");

    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/SletteBruker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bruker: loggetInnBruker.bruker, passord }),
      });

      const data = await respons.json();

      if (respons.ok) {
        setMelding("Bruker slettet.");
        setPassord("");
        setVisSlettSkjema(false);
        localStorage.removeItem("bruker");

        setTimeout(() => {
          history.push("/Innlogging"); 
        }, 1000);
      } else {
        setMelding(data.error);
      }
    } catch (error) {
      setMelding("Uventet feil, prøv igjen.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl mb-4 text-gray-700">Medlemskap</h2>
        <p className="mb-4">
          Velkommen, <span className="font-bold">{loggetInnBruker.bruker}</span>
        </p>
        <p className="mb-4">Du er registrert som medlem av DiscGolf.</p>

        {!visSlettSkjema && (
          <button
            onClick={() => setVisSlettSkjema(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg w-full border border-red-500 hover:bg-red-700"
          >
            Slett Bruker
          </button>
        )}

        {visSlettSkjema && (
          <form onSubmit={handleSlettBruker} className="mt-4">
            <h3 className="text-xl font-bold text-red-600">Bekreft sletting</h3>
            <p className="text-red-500 mb-4">Denne handlingen kan ikke angres!</p>
            <input
              type="password"
              placeholder="Bekreft passord"
              value={passord}
              onChange={(e) => setPassord(e.target.value)}
              required
              className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg w-full border border-red-500 hover:bg-red-700"
            >
              Bekreft Sletting
            </button>
            <button
              onClick={() => setVisSlettSkjema(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 mt-2 rounded-lg w-full border border-gray-400 hover:bg-gray-400"
            >
              Avbryt
            </button>
            {melding && <p className="mt-4 text-red-500">{melding}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Medlemskap;