import React from 'react';

type FormInputProps = {
    type: 'text' | 'password';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    icon: string; // Material Icons name, e.g., 'person' or 'lock'
    helperText: string;
    disabled?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
    type,
    value,
    onChange,
    placeholder,
    icon,
    helperText,
    disabled = false,
}) => {
    return (
        <div>
            <label className="input focus:border-1 text-gray-100 items-center gap-2">
                <span className="material-icons text-blue-500">{icon}</span>
                <input
                    type={type}
                    className="grow text-gray-100 "
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            </label>
            <div className="text-xs text-gray-500 mt-1 pl-1">{helperText}</div>
        </div>
    );
};

export default FormInput;
