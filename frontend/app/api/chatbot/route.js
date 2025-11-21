import { NextResponse } from "next/server";
import { startChat } from "@/services/geminiService";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Get or create chat instance
    const chat = startChat();

    // Send message using the same format as filter-crops
    const result = await chat.sendMessage({
      message: message
    });
    
    const responseText = result.text?.trim();

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    return NextResponse.json(
      { 
        message: responseText,
        success: true 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Chatbot API error:", err);
    
    return NextResponse.json(
      { 
        message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        success: false,
        error: err.message 
      },
      { status: 200 } // Return 200 to allow graceful error handling on frontend
    );
  }
}
