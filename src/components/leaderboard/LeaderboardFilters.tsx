import React from 'react';
import { useAtomValue } from 'jotai';
import { isAdminAtom } from '../../store/auth';
import type { Semester } from '../../types/semester';
import type { Class, ClassContestAssignment } from '../../types/class';
import type { GlobalContestResponse } from '../../types/contest';

interface LeaderboardFiltersProps {
    scope: 'class' | 'global';
    setScope: (scope: 'class' | 'global') => void;

    selectedSemesterId?: string;
    setSelectedSemesterId: (id: string) => void;
    semesters: Semester[];

    selectedClassId?: string;
    setSelectedClassId: (id: string) => void;
    classes: Class[];

    selectedContestId?: string;
    setSelectedContestId: (id: string) => void;
    classContests: ClassContestAssignment[];
    globalContests: GlobalContestResponse[];

    loading: boolean;
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = (props) => {
    const isAdmin = useAtomValue(isAdminAtom);
    console.log(props)

    return (
        <div className="bg-base-300 rounded-lg p-4 border border-gray-600 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Scope Toggle for Admins */}
                {isAdmin && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-blue-500">
                                Scope
                            </span>
                        </label>
                        <div className="tabs tabs-boxed bg-base-100">
                            <a
                                className={`tab ${
                                    props.scope === 'class' ? 'tab-active' : ''
                                }`}
                                onClick={() => props.setScope('class')}
                            >
                                Class
                            </a>
                            <a
                                className={`tab ${
                                    props.scope === 'global' ? 'tab-active' : ''
                                }`}
                                onClick={() => props.setScope('global')}
                            >
                                Global
                            </a>
                        </div>
                    </div>
                )}

                {/* Class-based Filters (Only for Admins in 'class' scope) */}
                {props.scope === 'class' && isAdmin && (
                    <>
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text text-blue-500">
                                    Semester
                                </span>
                            </label>
                            <select
                                className="select select-bordered w-full bg-base-100"
                                value={props.selectedSemesterId}
                                onChange={(e) =>
                                    props.setSelectedSemesterId(e.target.value)
                                }
                                disabled={props.loading}
                            >
                                {props.semesters.map((s) => (
                                    <option
                                        key={s.semester_id}
                                        value={s.semester_id}
                                    >
                                        {s.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text text-blue-500">
                                    Class
                                </span>
                            </label>
                            <select
                                className="select select-bordered w-full bg-base-100"
                                value={props.selectedClassId}
                                onChange={(e) =>
                                    props.setSelectedClassId(e.target.value)
                                }
                                disabled={
                                    props.loading || !props.selectedSemesterId
                                }
                            >
                                {props.classes.map((c) => (
                                    <option
                                        key={c.class_transaction_id}
                                        value={c.class_transaction_id}
                                    >
                                        {c.class_code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Contest Filter (content changes based on scope) */}
                <div className="form-control flex-1">
                    <label className="label">
                        <span className="label-text text-blue-500">
                            Contest
                        </span>
                    </label>
                    <select
                        className="select select-bordered w-full bg-base-100"
                        value={props.selectedContestId || ''}
                        onChange={(e) =>
                            props.setSelectedContestId(e.target.value)
                        }
                        disabled={props.loading}
                    >
                        <option value="" disabled>
                            Select a contest
                        </option>
                        {props.scope === 'class'
                            ? props.classContests.map((c) => (
                                  <option
                                      key={c.contest_id}
                                      value={c.contest_id}
                                  >
                                      {c.contest?.name}
                                  </option>
                              ))
                            : props.globalContests.map((c) => (
                                  <option key={c.id} value={c.id}>
                                      {c.name}
                                  </option>
                              ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardFilters;
