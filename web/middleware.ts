// export { auth as middleware } from "@/auth"

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_MAINTENANCE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api");
  const isMaintenancePage = pathname.startsWith("/maintenance");

  if (IS_PRODUCTION && IS_MAINTENANCE && !isApiRoute && !isMaintenancePage) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    return NextResponse.redirect(maintenanceUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
