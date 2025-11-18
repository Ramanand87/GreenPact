import { NextRequest, NextResponse } from "next/server";
import { filterDemandsByDistance } from "@/lib/gemini/filterDemands";

export async function POST(req) {
  try {
    const { origin, demands, maxDistance  } = await req.json();

    if (!origin || !demands || demands.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await filterDemandsByDistance(origin, demands, maxDistance);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Filter demands error:", err);
    
    // If any error occurs, return all demands as fallback
    const { demands } = await req.json().catch(() => ({ demands: [] }));
    return NextResponse.json(
      { 
        matched: demands, 
        fallback: true, 
        message: "Service temporarily unavailable, showing all demands",
        error: err.message 
      },
      { status: 200 }
    );
  }
}
