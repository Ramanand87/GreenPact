import { NextRequest, NextResponse } from "next/server";
import { filterCropsByDistance } from "@/lib/gemini/filterCrops";

export async function POST(req) {
  try {
    const { origin, crops, maxDistance  } = await req.json();

    if (!origin || !crops || crops.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await filterCropsByDistance(origin, crops, maxDistance);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Filter crops error:", err);
    
    // If any error occurs, return all crops as fallback
    const { crops } = await req.json().catch(() => ({ crops: [] }));
    return NextResponse.json(
      { 
        matched: crops, 
        fallback: true, 
        message: "Service temporarily unavailable, showing all crops",
        error: err.message 
      },
      { status: 200 }
    );
  }
}