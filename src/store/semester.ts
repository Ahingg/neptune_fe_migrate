import { atom } from 'jotai';
import type { Semester } from '../types/semester';

interface SemestersCache {
    all: Semester[];
    current: Semester | null;
}

// This atom will hold a global cache for semester data.
export const semestersCacheAtom = atom<SemestersCache>({
    all: [],
    current: null,
});
