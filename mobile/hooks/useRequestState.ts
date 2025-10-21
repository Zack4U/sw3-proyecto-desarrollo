import { useState } from 'react';

export interface RequestState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

export const useRequestState = () => {
    const [state, setState] = useState<RequestState>({
        loading: false,
        success: false,
        error: null,
    });

    const setLoading = () => {
        setState({
            loading: true,
            success: false,
            error: null,
        });
    };

    const setSuccess = () => {
        setState({
            loading: false,
            success: true,
            error: null,
        });
    };

    const setError = (errorMessage: string) => {
        setState({
            loading: false,
            success: false,
            error: errorMessage,
        });
    };

    const reset = () => {
        setState({
            loading: false,
            success: false,
            error: null,
        });
    };

    return {
        ...state,
        setLoading,
        setSuccess,
        setError,
        reset,
    };
};
