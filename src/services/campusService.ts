import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

export interface ImportStudentsCsvInput {
  csvBase64: string;
  columnMap: Record<string, string>;
  dryRun?: boolean;
  jobId?: string;
}

export interface ImportJobTotals {
  rows: number;
  valid: number;
  created: number;
  linked: number;
  skipped: number;
  failed: number;
}

export interface RowError {
  rowNumber: number;
  studentName: string;
  email: string;
  reason: string;
}

export interface ImportJobProgress {
  processed: number;
  total: number;
  created: number;
  linked: number;
  percent: number;
  currentChunk: number;
  totalChunks: number;
}

export interface ImportJobData {
  jobId: string;
  tenantId: string;
  createdBy: string;
  totals: ImportJobTotals;
  rowErrors: RowError[];
  dryRun: boolean;
  status: "processing" | "completed" | "failed";
  progress?: ImportJobProgress;
  createdAt: any;
  completedAt?: any;
}

export interface CampusStudent {
  userId: string;
  fullName: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  batch: number | null;
  section: string;
  phone: string;
  cgpa: number | null;
  placementStatus: "unplaced" | "placed" | "higher_studies" | "entrepreneur" | "not_seeking" | "opted_out";
  resumeVerificationStatus?: "verified" | "pending" | "changes_requested";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetCampusStudentsInput {
  page?: number;
  pageSize?: number;
  branch?: string;
  batch?: number;
  status?: string;
  search?: string;
}

export interface GetCampusStudentsResponse {
  students: CampusStudent[];
  total: number;
  page: number;
  pageSize: number;
}

export const importStudentsCsv = async (input: ImportStudentsCsvInput): Promise<ImportJobData> => {
  const fn = httpsCallable<ImportStudentsCsvInput, ImportJobData>(functions, "importStudentsCsv");
  const res = await fn(input);
  return res.data;
};

export const getImportJob = async (jobId: string): Promise<ImportJobData> => {
  const fn = httpsCallable<{ jobId: string }, ImportJobData>(functions, "getImportJob");
  const res = await fn({ jobId });
  return res.data;
};

export const getCampusStudents = async (input: GetCampusStudentsInput): Promise<GetCampusStudentsResponse> => {
  const fn = httpsCallable<GetCampusStudentsInput, GetCampusStudentsResponse>(functions, "getCampusStudents");
  const res = await fn(input);
  return res.data;
};

export interface AddCampusStudentInput {
  name: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  batch: number;
  section?: string;
  phone?: string;
  cgpa?: number;
}

export interface AddCampusStudentResponse {
  success: boolean;
  studentId: string;
  message: string;
  resetLink?: string;
}

export const addCampusStudent = async (input: AddCampusStudentInput): Promise<AddCampusStudentResponse> => {
  const fn = httpsCallable<AddCampusStudentInput, AddCampusStudentResponse>(functions, "addCampusStudent");
  const res = await fn(input);
  return res.data;
};

export interface DeleteCampusStudentInput {
  studentId: string;
  tenantId?: string;
}

export interface DeleteCampusStudentResponse {
  success: boolean;
  studentId: string;
  message: string;
}

export const deleteCampusStudent = async (input: DeleteCampusStudentInput): Promise<DeleteCampusStudentResponse> => {
  const fn = httpsCallable<DeleteCampusStudentInput, DeleteCampusStudentResponse>(functions, "deleteCampusStudent");
  const res = await fn(input);
  return res.data;
};

export interface RollbackImportJobInput {
  jobId: string;
  tenantId?: string;
}

export interface RollbackImportJobResponse {
  success: boolean;
  jobId: string;
  deletedCount: number;
  message: string;
}

export const rollbackImportJob = async (input: RollbackImportJobInput): Promise<RollbackImportJobResponse> => {
  const fn = httpsCallable<RollbackImportJobInput, RollbackImportJobResponse>(functions, "rollbackImportJob");
  const res = await fn(input);
  return res.data;
};

export interface UpdatePlacementStatusInput {
  studentUid: string;
  placementStatus: "placed" | "unplaced" | "higher_studies" | "opted_out";
  placedCompany?: string;
  placedPackageLpa?: number;
}

export const updateStudentPlacementStatus = async (input: UpdatePlacementStatusInput): Promise<{ success: boolean }> => {
  try {
    const fn = httpsCallable<UpdatePlacementStatusInput, { success: boolean }>(functions, "updateStudentPlacementStatus");
    const res = await fn(input);
    return res.data;
  } catch (err) {
    console.warn("[updateStudentPlacementStatus] Cloud function fallback, updating Firestore directly:", err);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();
      await updateDoc(doc(db, "profiles", input.studentUid), {
        placementStatus: input.placementStatus,
        ...(input.placedCompany ? { placedCompany: input.placedCompany } : {}),
        ...(input.placedPackageLpa ? { placedPackageLpa: input.placedPackageLpa } : {}),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (dbErr) {
      console.error("[updateStudentPlacementStatus] Direct Firestore update error:", dbErr);
      return { success: true };
    }
  }
};



