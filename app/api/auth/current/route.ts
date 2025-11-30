import { NextResponse } from "next/server";
import serverAuth from "@/lib/serverAuth";
import { handleApiError } from "@/lib/errorHandler";

export async function GET() {
  try {
    const { currentUser } = await serverAuth();
    return NextResponse.json(currentUser);
  } catch (error) {
    return handleApiError(error, "Unauthorized", 400);
  }
}
