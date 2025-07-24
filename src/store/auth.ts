// src/store/auth.ts
import { atom } from "jotai";
import type { User } from "../types/auth";

// Atom to store the current authenticated user's data
export const userAtom = atom<User | null>(null); // Now directly uses the User interface

// Derived atom to check if user is authenticated
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

// Derived atom to check if user has Admin role
export const isAdminAtom = atom((get) => get(userAtom)?.role === "Admin");

// Derived atom to check if user has Student role
export const isStudentAtom = atom((get) => get(userAtom)?.role === "Student");
export const isLecturerAtom = atom((get) => get(userAtom)?.role === "Lecturer");
export const isAssistantAtom = atom(
  (get) => get(userAtom)?.role === "Assistant"
);
