import type { SpaceMissionDataType } from "@/types";

export interface MissionsDataResponse {
    missions: SpaceMissionDataType[]
    statusCounts: {Success: number; Failure: number; "Partial Failure": number;}
    successRate: number
    totalMissions: number
    mostUsedRocket: string
}

export const missionsService = {
  getMissions: async (): Promise<MissionsDataResponse> => {
    const response = await fetch("/api/missions");
    if (!response.ok) { 
      throw new Error("Failed to fetch missions");
    }
    const result = await response.json();
    return result;
  },
};
