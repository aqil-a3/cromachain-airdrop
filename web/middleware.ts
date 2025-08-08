export { auth as middleware } from "@/auth"

// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Konfigurasi
// const IS_PRODUCTION = process.env.NODE_ENV === "production";
// const IS_MAINTENANCE = true;

// // Middleware utama
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isApiRoute = pathname.startsWith("/api");
//   const isMaintenancePage = pathname.startsWith("/maintenance");

//   // Bypass semua logic kalau path /maintenance
//   if (isMaintenancePage) {
//     return NextResponse.next();
//   }

//   // Redirect ke maintenance page jika sedang maintenance
//   if (IS_PRODUCTION && IS_MAINTENANCE && !isApiRoute) {
//     const maintenanceUrl = request.nextUrl.clone();
//     maintenanceUrl.pathname = "/maintenance";
//     return NextResponse.redirect(maintenanceUrl);
//   }

//   // Lanjutkan ke middleware auth (biar session tetap hidup)
//   //   @ts-ignore
//   return auth(request);
// }

// // Middleware hanya aktif untuk path-path tertentu
// export const config = {
//   matcher: ["/((?!_next|favicon.ico).*)"],
// };
