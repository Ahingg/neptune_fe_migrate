import React from 'react';

interface AdminModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({
    open,
    onClose,
    title,
    children,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
                className="bg-base-300 text-gray-100 rounded-lg shadow-lg w-full max-w-lg flex flex-col border border-gray-600"
                style={{ maxHeight: '90vh' }}
            >
                <div className="p-4 border-b border-gray-600 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-500">{title}</h2>
                    <button className="btn btn-sm btn-ghost" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default AdminModal;
