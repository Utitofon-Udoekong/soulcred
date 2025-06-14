import { NextResponse, type NextRequest } from "next/server";
import { pinataService } from "@/app/lib/services/pinata";

export async function POST(request: NextRequest) {
  try {
    // Initialize Pinata service
    await pinataService.initialize();

    // Get metadata from request body
    const metadata = await request.json();
    
    if (!metadata) {
      return NextResponse.json(
        { error: "No metadata provided" },
        { status: 400 }
      );
    }

    // Upload metadata to IPFS
    const ipfsUri = await pinataService.uploadResumeMetadata(metadata);

    return NextResponse.json({ 
      ipfsUri,
      success: true 
    }, { status: 200 });
  } catch (e) {
    console.error("Error uploading metadata:", e);
    return NextResponse.json(
      { 
        error: "Failed to upload metadata",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 