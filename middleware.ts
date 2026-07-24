import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set in Railway: ALOVIA_SHIELD_SECRET=<your secret>
// Only requests carrying the matching x-alovia-shield-token header pass.
// The Alovia Shield proxy injects this header, so direct-to-origin traffic
// (bypassing Shield) gets 403. Real visitors reach the site through Shield.
const SHIELD_SECRET = process.env.ALOVIA_SHIELD_SECRET;

export function middleware(req: NextRequest) {
  if (req.headers.get("x-alovia-shield-token") !== SHIELD_SECRET) {
    return new NextResponse("Access denied", { status: 403 });
  }
  return NextResponse.next();
}

// Skip Next internals/static so builds and assets aren't blocked.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
