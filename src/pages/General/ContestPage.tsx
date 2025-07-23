import React, { useState } from 'react';
// TODO: import useContests, useClasses, useCases hooks
// TODO: import ContestFormModal, etc.

const ContestPage: React.FC = () => {
    // TODO: use hooks for contests, classes, cases
    // const { contests, loading, error, ... } = useContests();
    // const { classes } = useClasses();
    // const { cases } = useCases();
    const [showModal, setShowModal] = useState(false);
    const [editContest, setEditContest] = useState(null);

    // TODO: implement handlers for create, edit, delete

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contests</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New Contest</button>
            </div>
            {/* TODO: feedback, loading, error */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Scope</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Assigned Classes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO: map contests */}
                        <tr>
                            <td colSpan={9} className="text-center">No data (TODO)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* TODO: ContestFormModal for create/edit */}
        </div>
    );
};

export default ContestPage;
