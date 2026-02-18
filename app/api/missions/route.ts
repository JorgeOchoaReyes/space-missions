import { NextResponse } from "next/server";

import { dataLoader } from "../helper-functions"; 

export async function GET() {
  try { 
    const missions = dataLoader();
 
    return NextResponse.json({
      missions
    });
  } catch (error) {
    console.error("Failed to load CSV:", error);
    return NextResponse.json({ error: "Failed to load mission data" }, { status: 500 });
  }
}