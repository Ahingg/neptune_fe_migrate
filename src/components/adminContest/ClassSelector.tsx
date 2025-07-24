import React from 'react';
import type { Class } from '../../types/class';

interface ClassSelectorProps {
    classes: Class[];
    loading: boolean;
    selectedClasses: string[];
    onChange: (classId: string, isSelected: boolean) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
    classes,
    loading,
    selectedClasses,
    onChange,
}) => {
    if (loading) return <div>Loading classes...</div>;

    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1">
                Assign to Classes{' '}
                <span className="text-gray-400">
                    ({selectedClasses.length} selected)
                </span>
            </label>
            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-base-100">
                {classes.length === 0 ? (
                    <div className="text-gray-400">
                        No classes available for this course.
                    </div>
                ) : (
                    classes.map((cls) => (
                        <label
                            key={cls.class_transaction_id}
                            className="flex items-center gap-2 cursor-pointer py-1 text-gray-100"
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={selectedClasses.includes(
                                    cls.class_transaction_id
                                )}
                                onChange={(e) =>
                                    onChange(
                                        cls.class_transaction_id,
                                        e.target.checked
                                    )
                                }
                            />
                            <span>{cls.class_code}</span>
                        </label>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClassSelector;
