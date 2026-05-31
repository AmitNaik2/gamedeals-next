import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidate all game pages and homepage
  revalidatePath("/", "layout");
  revalidatePath("/game/[id]", "page");
  revalidatePath("/free-games");
  
  return NextResponse.json({ 
    revalidated: true, 
    timestamp: new Date().toISOString() 
  });
}
