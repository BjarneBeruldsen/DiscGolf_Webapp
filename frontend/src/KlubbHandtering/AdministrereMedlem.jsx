//Author: Severin Waller Sørensen
//Changed by: Laurent Zogaj

/* Denne filen er en enkel komponent for administrering av klubbmedlem
 */

import React from "react";
import { useTranslation } from 'react-i18next';

const MedlemsAdministrasjon = () => {
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
export default MedlemsAdministrasjon;