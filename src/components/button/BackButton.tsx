import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="btn btn-outline btn-primary"
        >
            <ArrowLeft/>
            Back
        </button>
    );
};

export default BackButton;