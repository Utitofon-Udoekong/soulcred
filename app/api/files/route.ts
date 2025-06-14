import { NextResponse, type NextRequest } from "next/server";
import { pinataService } from "@/app/lib/services/pinata";

export async function POST(request: NextRequest) {
  try {
    // Initialize Pinata service
    await pinataService.initialize();

    // Get file from form data
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload file to IPFS
    const ipfsUri = await pinataService.uploadFile(file);
    const url = pinataService.getHttpUrl(ipfsUri);
    console.log('url', url);
    return NextResponse.json({ 
      url,
      ipfsUri,
      success: true 
    }, { status: 200 });
  } catch (e) {
    console.error("Error uploading file:", e);
    return NextResponse.json(
      { 
        error: "Failed to upload file",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 