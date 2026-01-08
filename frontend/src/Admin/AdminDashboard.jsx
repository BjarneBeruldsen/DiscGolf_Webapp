//Author: Severin Waller Sørensen

/* Denne filen er en enkel komponent for admin-dashboardsiden
 */

import React from "react";
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <p className="mt-4 text-gray-600">
        {t("Ikke implementert")}
      </p>
      {/* Flere funksjoner for admin, TBC */}
    </div>
  );
};

// Eksporterer slik at siden kan brukes i andre filer, f.eks. App.jsx
export default AdminDashboard;