//Author: Severin Waller Sørensen

/* Denne filen er en enkel komponent for administrering av klubber
 */

import React from "react";
import { useTranslation } from 'react-i18next';

const AdministrereKlubber = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <p className="mt-4 text-gray-600">
        {t("Ikke implementert")}
      </p>
      {/* Flere funksjoner for, TBC */}
    </div>
  );
};

// Eksporterer slik at siden kan brukes i andre filer, f.eks. App.jsx
export default AdministrereKlubber;