// Hjelpefunksjon for å hente API base URL
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_BASE_URL;
};

// CSRF Token håndtering
let csrfToken = null;
let tokenPromise = null;

/**
 * Henter CSRF token fra backend og lagrer det
 * @returns {Promise<string>} CSRF token
 */
export const getCsrfToken = async () => {
  // Hvis vi allerede har en pending request, vent på den
  if (tokenPromise) {
    return tokenPromise;
  }

  // Hvis vi allerede har token, returner det
  if (csrfToken) {
    return csrfToken;
  }

  // Hent nytt token
  tokenPromise = fetch(`${getApiBaseUrl()}/api/csrf-token`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Kunne ikke hente CSRF token');
      }
      const data = await res.json();
      csrfToken = data.csrfToken;
      tokenPromise = null;
      return csrfToken;
    })
    .catch((err) => {
      tokenPromise = null;
      throw err;
    });

  return tokenPromise;
};

/**
 * Nullstiller CSRF token (brukes ved utlogging)
 */
export const resetCsrfToken = () => {
  csrfToken = null;
  tokenPromise = null;
};

/**
 * Hjelpefunksjon for å gjøre API-kall med CSRF token
 * @param {string} url - API URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const apiKall = async (url, options = {}) => {
  const method = options.method || 'GET';
  
  // Hent CSRF token for POST, PUT, PATCH, DELETE
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    try {
      const token = await getCsrfToken();
      // For FormData, ikke overskriv Content-Type (la browseren sette det automatisk)
      const isFormData = options.body instanceof FormData;
      if (isFormData) {
        // For FormData, ikke sett Content-Type header - browseren setter det automatisk med boundary
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': token,
        };
        // Fjern Content-Type hvis den er satt, slik at browseren kan sette den automatisk
        if (options.headers['Content-Type']) {
          delete options.headers['Content-Type'];
        }
      } else {
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': token,
        };
      }
    } catch (error) {
      console.error('Feil ved henting av CSRF token:', error);
      throw error;
    }
  }

  // Sørg for at credentials alltid er inkludert
  options.credentials = options.credentials || 'include';

  return fetch(url, options);
};
