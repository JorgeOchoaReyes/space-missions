"use client";

import { AppSidebar } from "@/components/app-sidebar"; 
import { LocationLaunchesChart } from "@/components/charts/location-launches";
import { CompanyMissionsChart } from "@/components/charts/missions-company";
import { SuccessRateChart } from "@/components/charts/success-time";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";  
import { useMissions } from "@/hooks/use-missions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Page() {  
  const { data, loading, filters, setFilters, filterOptions, resetFilters } = useMissions();
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    > 
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col"> 
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex flex-wrap items-center gap-4 px-4 lg:px-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Start Date</span>
                    <Input 
                      type="date"
                      value={filters.startDate} 
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-[150px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">End Date</span>
                    <Input 
                      type="date"
                      value={filters.endDate} 
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-[150px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Company</span>
                    <Select 
                      value={filters.company} 
                      onValueChange={(v) => setFilters(prev => ({ ...prev, company: v }))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.companies.map((company) => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={filters.status} 
                        onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.statuses.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={resetFilters}
                        className="h-9 px-3"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                <SectionCards metrics={{
                  statusCounts: data?.statusCounts ?? {
                    Failure: 0,
                    Success: 0,
                    "Partial Failure": 0
                  },
                  successRate: data?.successRate ?? 0, 
                  totalMissions: data?.totalMissions ?? 0,
                  mostUsedRocket: data?.mostUsedRocket ?? ""
                }} />

                <div className="flex flex-col px-4 gap-6 lg:px-6">

                  <div className="flex flex-col gap-6 lg:flex-row"> 
                    <Card className="flex-1">
                      <CardHeader>Top 10 Companies by Missions</CardHeader>
                      <CardContent>
                        <CompanyMissionsChart data={data?.missionsCompanyData ?? []} />
                      </CardContent>
                    </Card>

                    <Card className="flex-1">
                      <CardHeader>Launches by Site</CardHeader>
                      <CardContent>
                        <LocationLaunchesChart data={data?.locationLaunchesData ?? []} />
                      </CardContent>
                    </Card>
                  </div> 

                  <DataTable data={data?.missions  ?? []} />  

                  <Card>
                    <CardHeader>Success Rate over the Years</CardHeader>
                    <CardContent>
                      <SuccessRateChart data={data?.sucessTimeData ?? []} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

