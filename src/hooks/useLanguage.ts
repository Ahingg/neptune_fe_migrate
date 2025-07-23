import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { languagesAtom } from '../store/language';
import { getSupportedLanguagesApi } from '../api/language';

export const useLanguages = () => {
    const [languages, setLanguages] = useAtom(languagesAtom);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLanguages = async () => {
            if (languages.length > 0) {
                // Simple caching: if already loaded, don't refetch
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getSupportedLanguagesApi(); // Assume this fetches LanguageInfo[]
                setLanguages(data);
            } catch (err: any) {
                console.error('Failed to fetch languages:', err);
                setError(
                    err.response?.data?.error ||
                        'Failed to load supported languages.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchLanguages();
    }, [languages, setLanguages]);

    return { languages, loading, error };
};
