// Hjelpefunksjon for å hente API base URL
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_BASE_URL || 
         'http://localhost:8000';
};
