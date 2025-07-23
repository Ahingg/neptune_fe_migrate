import React from 'react';
// TODO: import useClasses hook

const ClassPage: React.FC = () => {
    // TODO: use hook for classes
    // const { classes, loading, error } = useClasses();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Classes</h1>
                <button className="btn btn-primary">+ Add New Class (TODO)</button>
            </div>
            {/* TODO: feedback, loading, error */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Class Code</th>
                            <th>Semester</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO: map classes */}
                        <tr>
                            <td colSpan={3} className="text-center">No data (TODO)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* TODO: ClassFormModal for create/edit */}
        </div>
    );
};

export default ClassPage;
