import { atom } from 'jotai';
import type { SubmissionHistoryItem } from '../types/submission';


export const submissionHistoryCacheAtom = atom<
    Record<string, SubmissionHistoryItem[]>
>({});
