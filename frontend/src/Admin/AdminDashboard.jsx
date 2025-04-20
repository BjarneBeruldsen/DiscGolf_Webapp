//Author: Severin Waller Sørensen

/* Denne filen er en enkel komponent for admin-dashboardsiden
 */

import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Velkommen til admin-dashboardsiden. Her kan du administrere brukere, klubber og annet innhold.
      </p>
      {/* Flere funksjoner for admin, TBC */}
    </div>
  );
};

// Eksporterer slik at siden kan brukes i andre filer, f.eks. App.jsx
export default AdminDashboard;