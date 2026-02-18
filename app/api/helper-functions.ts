import path from "path";
import fs from "fs";
import Papa from "papaparse";
import type { SpaceMissionDataType } from "@/types"; 
     
const dataLoader = () => {
  try {
    const filePath = path.join(process.cwd(), "data", "space_missions.csv");
     
    const fileContent = fs.readFileSync(filePath, "utf8");
 
    let { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    }) as {data: SpaceMissionDataType[]};

    data = data.map((m, index) => {
      return {
        ...m,
        id: index
      };
    });

    return data;
  } catch (error) {
    throw new Error("Could not parse or load data.");
  }
};

const getMissionCountByCompany = (companyName: string): number => {
  if(!companyName) {
    throw new Error("Company name is required");
  }
  const missions = dataLoader();

  const companyMissions = missions.filter((m) => m.Company === companyName);

  if(companyMissions.length === 0) {
    throw new Error("No missions found for the given company name");
  }

  return companyMissions.length;
};

const getSuccessRate = (companyName?: string): number => {
  const missions = dataLoader();
  if(!companyName) {
    throw new Error("Company name is required");
  }
  const companyMissions = missions.filter((m) => m.Company === companyName);
  if (companyMissions.length === 0) {
    return 0;
  }
  const successCount = companyMissions.filter((m) => m.MissionStatus === "Success").length;

  return parseFloat(((successCount / companyMissions.length) * 100).toFixed(2));
};

const getMissionsByDateRange = (startDate: string, endDate: string): string[] => {
  if(!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  const missions = dataLoader();
  
  const start = new Date(startDate);
  const end = new Date(endDate);

  if(isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date");
  }

  if(start.getTime() > end.getTime()) {
    throw new Error("Start date must be before end date");
  }

  return missions
    .filter((m) => {
      const date = new Date(m.Date);
      return date >= start && date <= end;
    })
    .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
    .map((m) => m.Mission);
};
 
const getTopCompaniesByMissionCount = (n: number): (string | number)[][] => {
  if(n <= 0) {
    throw new Error("Number of companies must be greater than 0");
  }
  const missions = dataLoader();
  const counts: { [key: string]: number } = {};
  missions.forEach((m) => {
    counts[m.Company] = (counts[m.Company] || 0) + 1;
  });

  // this is the closest to tuple, could also use an object but this gives the closest thing
  return Object.entries(counts)
    .map(([companyName, missionCount]) => ({ companyName, missionCount }))
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .sort((a, b) => b.missionCount - a.missionCount)
    .slice(0, n)
    .map((m) => [m.companyName, m.missionCount]);
};

const getMissionStatusCount = (): {Success: number; Failure: number; "Partial Failure": number;} => {
  const missions = dataLoader();

  const stats = {
    Success: 0,
    Failure: 0,
    "Partial Failure": 0,
    "Prelaunch Failure": 0,
  };

  missions.forEach((m) => {
    if (m.MissionStatus === "Success") stats.Success++;
    else if (m.MissionStatus === "Failure") stats.Failure++;
    else if (m.MissionStatus === "Partial Failure") stats["Partial Failure"]++;
    else if (m.MissionStatus === "Prelaunch Failure") stats["Prelaunch Failure"]++;
  });

  return stats;
};

const getMissionsByYear = (year: number): number => {
  if(!year || year < 0) {
    throw new Error("Year must be a positive number");
  }
  const missions = dataLoader();
  return missions.filter((m) => new Date(m.Date).getFullYear() === year).length;
};

const getMostUsedRocket = (): string => {
  const missions = dataLoader();
  const counts: { [key: string]: number } = {};
  missions.forEach((m) => {
    counts[m.Rocket] = (counts[m.Rocket] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => {
      return a[0].localeCompare(b[0]);
    })
    .sort((a, b) => {
      return b[1] - a[1];
    });

  return sorted.length > 0 ? sorted[0][0] : "";
};

const getAverageMissionsPerYear = (
  startYear: number,
  endYear: number
): number => {
  if(!startYear || !endYear || startYear < 0 || endYear < 0 || startYear > endYear) {
    throw new Error("Dates/Date Range not valid.");
  }

  const missions = dataLoader();
  const years = endYear - startYear + 1;
  if (years <= 0) return 0;

  const count = missions.filter((m) => {
    const y = new Date(m.Date).getFullYear();
    return (y >= startYear && y <= endYear);
  }).length;

  return parseFloat((count / years).toFixed(2));
};
 
export { 
  getAverageMissionsPerYear,
  getMissionCountByCompany,
  getMissionStatusCount,
  getMissionsByDateRange,
  getMissionsByYear, 
  getMostUsedRocket,
  getSuccessRate, 
  getTopCompaniesByMissionCount,
  dataLoader
};