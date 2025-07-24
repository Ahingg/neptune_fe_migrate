import React, { useEffect, useState } from 'react';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import useClassContests from '../../hooks/useClassContests';
import { useContestDetails } from '../../hooks/useContestDetail';
import type { Class } from '../../types/class';
import type { ClassContestAssignment } from '../../types/class';
import type { Case } from '../../types/case';
import { createCasePdfFileUrl } from '../../utils/urlMaker';

const LecturerContestsPage: React.FC = () => {
    const { classes, loading: classesLoading, error: classesError } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>(undefined);

    // Set default class on load
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].class_transaction_id);
        }
    }, [classes, selectedClassId]);

    // Fetch contests for selected class
    const { contests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);

    // Set default contest on load
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) {
            setSelectedContestId(contests[0].contest_id);
        }
    }, [contests, selectedContestId]);

    // Fetch cases for selected contest using the new hook
    const { cases, loading: casesLoading, error: casesError } = useContestDetails(selectedContestId);

    const selectedContest: ClassContestAssignment | undefined = contests.find(c => c.contest_id === selectedContestId);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8 h-[900px]">
                {/* Left Box: Class dropdown and contest list */}
                <div className="lg:w-1/2 w-full bg-blue-50 rounded-xl shadow p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">My Assistant Contests</h2>
                    {/* Class Dropdown */}
                    {classesLoading ? (
                        <div className="text-gray-800">Loading classes...</div>
                    ) : classesError ? (
                        <div className="text-red-600 bg-red-50 p-3 rounded-lg">{classesError}</div>
                    ) : (
                        <>
                            <label className="block mb-2 text-gray-800">Select Class:</label>
                            <select
                                className="select select-bordered w-full mb-4 text-white bg-blue-700"
                                value={selectedClassId}
                                onChange={e => {
                                    setSelectedClassId(e.target.value);
                                    setSelectedContestId(undefined); // reset contest selection
                                }}
                            >
                                {classes.map(cls => (
                                    <option key={cls.class_transaction_id} value={cls.class_transaction_id} className="text-white bg-blue-700">
                                        {cls.class_code} - {cls.class_name || 'No name'}
                                    </option>
                                ))}
                            </select>
                            <div className="mb-2 text-gray-800 font-semibold">Contest List:</div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                {contestsLoading ? (
                                    <div className="text-gray-800">Loading contests...</div>
                                ) : contestsError ? (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{contestsError}</div>
                                ) : contests.length === 0 ? (
                                    <div className="text-gray-400">No contests found for this class.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {contests.map(contest => (
                                            <li key={contest.contest_id}>
                                                <button
                                                    onClick={() => setSelectedContestId(contest.contest_id)}
                                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedContestId === contest.contest_id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white hover:bg-blue-100 text-gray-800'
                                                        }`}
                                                >
                                                    <div className="font-semibold">{contest.contest?.name || 'No name'}</div>
                                                    <div className="text-sm opacity-75">{contest.contest?.description || 'No description'}</div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {/* Right Box: Contest detail and case list */}
                <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Contest Details</h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {selectedContest ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{selectedContest.contest?.name || 'No name'}</h3>
                                    <div className="text-gray-800">{selectedContest.contest?.description || 'No description'}</div>
                                </div>
                                <div className="text-gray-800">
                                    <b>Start Time:</b> {selectedContest.start_time ? new Date(selectedContest.start_time).toLocaleString() : 'N/A'}
                                </div>
                                <div className="text-gray-800">
                                    <b>End Time:</b> {selectedContest.end_time ? new Date(selectedContest.end_time).toLocaleString() : 'N/A'}
                                </div>
                                <div className="text-gray-800 font-semibold mt-4">Problems:</div>
                                {casesLoading ? (
                                    <div className="text-gray-800">Loading problems...</div>
                                ) : casesError ? (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{casesError}</div>
                                ) : cases.length === 0 ? (
                                    <div className="text-gray-400">No problems found for this contest.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {cases.map(problem => (
                                            <li key={problem.case_id}>
                                                <a
                                                    href={createCasePdfFileUrl(problem.pdf_file_url)}
                                                    download
                                                    className="block p-3 rounded-lg bg-gray-100 hover:bg-blue-100 text-blue-800 transition-colors"
                                                >
                                                    {problem.name || 'Untitled Problem'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center mt-8">Select a contest to view details</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerContestsPage;
