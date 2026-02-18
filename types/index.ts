export interface SpaceMissionDataType {
    id: number,
    Company: string,
    Location: string,
    Date: string, /*(YYYY-MM-DD format)*/
    Time: string, /*(HH:MM:SS format)*/
    Rocket: string,
    Mission: string,
    RocketStatus: "Retired" | "Active",
    Price: string | null, 
    MissionStatus: "Success" | "Failure" | "Partial Failure" | "Prelaunch Failure"
}

export interface CountTypes {       
    Failure: number;     
    Success: number;  
    "Partial Failure": number;
}