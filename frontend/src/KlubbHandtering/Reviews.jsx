// Author: Ylli Ujkani

import React, { useState, useEffect } from 'react';
import HentBruker from '../BrukerHandtering/HentBruker';
import { useTranslation } from 'react-i18next';
import { apiKall } from '../utils/api';

const Review = ({ baneId }) => {
    const { bruker } = HentBruker();
    const [rating, setRating] = useState(0);
    const [kommentar, setKommentar] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    // Henter anmeldelser og nullstiller skjema/meldinger når bane byttes
    useEffect(() => {
        if (baneId) {
            fetchReviews();
            setSuccess('');
            setError('');
            setRating(0);
            setKommentar('');
        }
    }, [baneId]);

    // Funksjon for å hente anmeldelser
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}/reviews`);
            if (!response.ok) {
                throw new Error('Kunne ikke hente anmeldelser');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Feil ved henting av anmeldelser:', error);
            setError('Kunne ikke hente anmeldelser');
        } finally {
            setLoading(false);
        }
    };

    // Håndterer sending av skjema
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!bruker) {
            setError('Du må være logget inn for å legge til en anmeldelse');
            return;
        }
        if (rating < 1 || rating > 5) {
            setError('Vennligst velg en vurdering mellom 1 og 5');
            return;
        }

        try {
            const response = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/baner/${baneId}/reviews`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating, kommentar })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Kunne ikke legge til anmeldelse');
            }
            setSuccess('Anmeldelse lagt til!');
            setRating(0);
            setKommentar('');
            fetchReviews();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    // Beregner gjennomsnittlig rating
    const calculateAverageRating = () => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    // Håndterer klikk på stjerne
    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    return (
        <div className="mt-4">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold mr-2">{t('Vurdering:')}</h3>
                <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{calculateAverageRating()}</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className="w-6 h-6"
                                fill="currentColor"
                                style={{ color: star <= calculateAverageRating() ? '#facc15' : '#d1d5db' }}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                        ({reviews.length} {reviews.length === 1 ? t('anmeldelse') : t('anmeldelser')})
                    </span>
                </div>
            </div>
    
            {bruker && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Din vurdering:')}</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    className="cursor-pointer p-1"
                                >
                                    <svg
                                        className="w-8 h-8"
                                        fill="currentColor"
                                        style={{ color: star <= rating ? '#facc15' : '#d1d5db' }}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {t('Du har valgt')} {rating} {t('stjerne')}{rating > 1 && t('r')}
                            </p>
                        )}
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">{t('Din kommentar:')}</label>
                        <textarea
                            value={kommentar}
                            onChange={(e) => setKommentar(e.target.value)}
                            className="w-full border rounded p-2"
                            rows="3"
                            maxLength="500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold px-6 py-2.5 rounded shadow-sm border border-blue-600 hover:bg-blue-600 transition-colors duration-200"
                    >
                        {t('Legg til anmeldelse')}
                    </button>
                </form>
            )}
    
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}

            <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">{t('Anmeldelser:')}</h4>
                {loading && <p>{t('Laster anmeldelser...')}</p>}
                {!loading && reviews.length === 0 && <p>{t('Ingen anmeldelser ennå')}</p>}
                {reviews && reviews.map((review) => (
                    <div key={review._id} className="border rounded p-4 mb-2">
                        <div className="flex items-center mb-2">
                        <span className="font-semibold mr-2">{review.navn || t('Anonym')}</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        style={{ color: star <= review.rating ? '#facc15' : '#d1d5db' }}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600">{review.kommentar}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(review.dato).toLocaleDateString('nb-NO')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Review;