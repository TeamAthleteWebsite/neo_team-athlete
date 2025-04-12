import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const sessionCookie = getSessionCookie(request, {
      cookieName: "session_token",
      cookiePrefix: "better-auth",
    });

    console.log(sessionCookie);

    const isAuthenticated = !!sessionCookie;
    const isOnboardingCompleted = request.cookies.has("onboarding_completed");
    const isOnboardingPath = request.nextUrl.pathname.startsWith("/onboarding");
    const isAuthPath = request.nextUrl.pathname.startsWith("/auth");

    // Protection des routes d'authentification
    if (isAuthenticated && isAuthPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protection des routes nécessitant une authentification
    if (!isAuthenticated && !isAuthPath) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Redirection vers l'onboarding si nécessaire
    if (isAuthenticated && !isOnboardingCompleted && !isOnboardingPath) {
      return NextResponse.redirect(new URL("/onboarding/gender", request.url));
    }

    // Protection des routes d'onboarding une fois complété
    if (isAuthenticated && isOnboardingCompleted && isOnboardingPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // En cas d'erreur, rediriger vers la page de connexion
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json|icon-192x192.png|icon-256x256.png|icon-384x384.png|icon-512x512.png).*)",
  ],
};
