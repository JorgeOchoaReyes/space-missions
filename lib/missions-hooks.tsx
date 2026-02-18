
import { useQuery } from "@tanstack/react-query";
import { missionsService } from "./missions-service";
import type { MissionsDataResponse } from "./missions-service";

export const useMissionsQuery = () => {
  return useQuery<MissionsDataResponse>({
    queryKey: ["missions"],
    queryFn: missionsService.getMissions,
  });
};
 