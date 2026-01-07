import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const authenticated = Boolean(token);
  const status = authenticated ? 200 : 401;

  return NextResponse.json(
    {
      authenticated,
    },
    { status },
  );
}
