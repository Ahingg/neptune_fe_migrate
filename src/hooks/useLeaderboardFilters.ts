import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { isAdminAtom } from '../store/auth';
import { useClasses } from './useClasses';
import useClassContests from './useClassContests';
import { useCourse } from './useCourse';
import { useSemesters } from './useSemester';
import { useGlobalContests } from './useGlobalContest';

export const useLeaderboardFilters = () => {
    const isAdmin = useAtomValue(isAdminAtom);

    const [scope, setScope] = useState<'class' | 'global'>(
        isAdmin ? 'class' : 'global'
    );
    const [selectedSemesterId, setSelectedSemesterId] = useState<
        string | undefined
    >();
    const [selectedClassId, setSelectedClassId] = useState<
        string | undefined
    >();
    const [selectedContestId, setSelectedContestId] = useState<
        string | undefined
    >();

    const { courseId: defaultCourseId, courseOptions } = useCourse();
    const [selectedCourseId, setSelectedCourseId] =
        useState<string>(defaultCourseId);

    const {
        semesters,
        currentSemester,
        loading: semestersLoading,
    } = useSemesters();
    const { classes, loading: classesLoading } = useClasses(
        selectedCourseId
    );
    const { contests: classContests, loading: classContestsLoading } =
        useClassContests(selectedClassId);
    const { contests: globalContests, loading: globalContestsLoading } =
        useGlobalContests();

    // Effect to set default semester to the current one
    useEffect(() => {
        if (currentSemester && !selectedSemesterId) {
            setSelectedSemesterId(currentSemester.semester_id);
        }
    }, [currentSemester, selectedSemesterId]);

    // Effect to set default class
    useEffect(() => {
        if (classes.length > 0) {
            if (
                !classes.find((c) => c.class_transaction_id === selectedClassId)
            ) {
                setSelectedClassId(classes[0].class_transaction_id);
            }
        } else {
            setSelectedClassId(undefined);
        }
    }, [classes, selectedClassId]);

    // Effect to set default contest
    useEffect(() => {
        let defaultContest: string | undefined = undefined;
        if (scope === 'class' && classContests.length > 0) {
            defaultContest = classContests[0].contest_id;
        } else if (scope === 'global' && globalContests.length > 0) {
            defaultContest = globalContests[0].id;
        }
        setSelectedContestId(defaultContest);
    }, [scope, classContests, globalContests]);

    return {
        scope,
        setScope,
        selectedSemesterId,
        setSelectedSemesterId,
        selectedClassId,
        setSelectedClassId,
        selectedContestId,
        setSelectedContestId,
        selectedCourseId,
        setSelectedCourseId,

        semesters,
        classes,
        classContests,
        globalContests,
        courseOptions,

        loading:
            semestersLoading ||
            classesLoading ||
            classContestsLoading ||
            globalContestsLoading,
    };
};
