"use client";

import { useCallback, useMemo, useState } from "react"; 
import { useQueryClient } from "@tanstack/react-query"; 
import { useMissionsQuery } from "@/lib/missions-hooks";

interface Filters {
  company: string;
  startDate: string;
  endDate: string;
  status: string;
}
 
export const useMissions = () => { 
  const queryClient = useQueryClient();
  const { 
    data, 
    isLoading, 
    error, 
    isFetching
  } = useMissionsQuery();
 
  const [filters, setFilters] = useState<Filters>({
    company: "All",
    startDate: "",
    endDate: "",
    status: "All",
  });

  const allMissions = useMemo(() => data?.missions ?? [], [data?.missions]);
 
  const filteredMissions = useMemo(() => {
    return allMissions.filter((m) => {
      const companyMatch = filters.company === "All" || m.Company === filters.company;
      const statusMatch = filters.status === "All" || m.MissionStatus === filters.status;
      
      let dateMatch = true;
      if (filters.startDate) {
        dateMatch = dateMatch && m.Date >= filters.startDate;
      }
      if (filters.endDate) {
        dateMatch = dateMatch && m.Date <= filters.endDate;
      }

      return companyMatch && statusMatch && dateMatch;
    });
  }, [allMissions, filters]);
 
  const metrics = useMemo(() => {
    if (filteredMissions.length === 0) {
      return {
        statusCounts: { 
          "Success": 0, 
          "Failure": 0, 
          "Partial Failure": 0,
          "Prelaunch Failure": 0
        },
        successRate: 0,
        totalMissions: 0,
        mostUsedRocket: "N/A",
      };
    }

    const counts = { 
      "Success": 0, 
      "Failure": 0, 
      "Partial Failure": 0,
      "Prelaunch Failure": 0 
    };
    const rocketCounts: {
      [key: string]: number;
    } = {};
    
    filteredMissions.forEach((m) => {
      if (m.MissionStatus in counts) {
        counts[m.MissionStatus]++;
      }
      rocketCounts[m.Rocket] = (rocketCounts[m.Rocket] || 0) + 1;
    });

    const mostUsedRocket = Object.entries(rocketCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "n/a";

    const succesRate = parseFloat(((counts["Success"] / filteredMissions.length) * 100).toFixed(2));

    return {
      statusCounts: counts,
      successRate: succesRate,
      totalMissions: filteredMissions.length,
      mostUsedRocket,
    };
  }, [filteredMissions]);
 
  const chartMetrics = useMemo(() => {
    if (filteredMissions.length === 0) {
      return {
        chartDataOverTime: [{ Year: 0, SuccessRate: 0 }],
        missionsByCompanies: [{ company: "", count: 0 }],
        launchesBySites: [{ site: "", count: 0 }],
      };
    }
     
    const yearlyMetrics: { [key: string]: { success: number; total: number } } = {};
    filteredMissions.forEach((m) => {
      const year = parseInt(m.Date.split("-")[0]);
      if (!yearlyMetrics[year]) yearlyMetrics[year] = { success: 0, total: 0 };
      
      yearlyMetrics[year].total++;
      if (m["MissionStatus"] === "Success") yearlyMetrics[year].success++;
    });

    const chartDataOverTime = Object.entries(yearlyMetrics).map(([year, stats]) => ({
      Year: parseInt(year),
      SuccessRate: parseFloat(((stats.success / stats.total) * 100).toFixed(2)),
    })).sort((a, b) => a.Year - b.Year);

    const countsCompanies: { [key: string]: number } = {};

    filteredMissions.forEach((m) => {
      countsCompanies[m.Company] = (countsCompanies[m.Company] || 0) + 1;
    });

    const missionsByCompanies = Object.entries(countsCompanies).map(([company, count]) => ({ company, count })).sort((a, b) => b.count - a.count).slice(0, 10);

    const countsLaunchSites: { [key: string]: number } = {};

    filteredMissions.forEach((m) => { 
      const site = m["Location"].split(",")[0].trim();
      countsLaunchSites[site] = (countsLaunchSites[site] ?? 0) + 1;
    });

    const launchesBySites = Object.entries(countsLaunchSites).map(([site, count]) => ({ site, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      chartDataOverTime,
      missionsByCompanies,
      launchesBySites,
    };

  }, [filteredMissions]);
 
  const filterOptions = useMemo(() => {
    const companyNames = allMissions.map((m) => m.Company);
    const companies = new Set(companyNames);

    return {
      companies: ["All", ...((companies.values().toArray()).sort())],
      statuses: ["All", "Success", "Failure", "Partial Failure", "Prelaunch Failure"]
    };
  }, [allMissions]);

  const resetFilters = useCallback(() => {
    setFilters({ company: "All", startDate: "", endDate: "", status: "All" });
  }, []);

  const refetchMissions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["missions"] });
  }, [queryClient]);

  return { 
    data: {
      missions: filteredMissions,
      ...metrics,
      sucessTimeData: chartMetrics.chartDataOverTime,
      missionsCompanyData: chartMetrics.missionsByCompanies, 
      locationLaunchesData: chartMetrics.launchesBySites, 
    },
    filters,
    filterOptions,
    loading: isLoading,
    isFetching,
    error: (error as Error)?.message || "",
    setFilters,
    resetFilters,
    refetchMissions, 
  };
};
