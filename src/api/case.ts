import axiosClient from "./axiosClient";

import type { Case, Testcase } from "../types/case";

export const getCases = async (): Promise<Case[]> => {
  const res = await axiosClient.get("/api/cases");
  console.log(res.data) 
  return res.data;
};

export const createCase = async (data: FormData): Promise<Case> => {
  const res = await axiosClient.post("/admin/cases", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateCase = async (
  caseId: string,
  data: Partial<Case>
): Promise<Case> => {
  const res = await axiosClient.put(`/admin/cases/${caseId}`, data);
  return res.data;
};

export const deleteCase = async (caseId: string): Promise<void> => {
  await axiosClient.delete(`/admin/cases/${caseId}`);
};

export const uploadTestCases = async (
  caseId: string,
  data: FormData
): Promise<any> => {
  const res = await axiosClient.post(
    `/admin/cases/${caseId}/test-cases`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

export const getTestCases = async (caseId: string): Promise<Testcase[]> => {
  const res = await axiosClient.get(`/admin/cases/${caseId}/test-cases`);
  return res.data;
};
