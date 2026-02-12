import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

type RequireUserResult =
  | { userId: string; response: NextResponse }
  | { userId: null; response: NextResponse };

export async function requireUser(): Promise<RequireUserResult> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      userId: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { userId, response: NextResponse.next() };
}
