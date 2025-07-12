import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  {
    path: "/login",
    quandoAutenticado: "redirecionar",
  },
] as const;

const roleProtectedRoutes = [
  {
    path: "/admin/usuarios",
    role: "SUPER_ADMIN",
  },
] as const;

const REDIRECIONE_QUANDO_NAO_AUTENTICADO = "/login";
const REDIRECIONE_NAO_AUTORIZADO = "/nao-autorizado";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = publicRoutes.find((route) => route.path === pathname); // Verifica se a rota é pública
  const protectedRoute = roleProtectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  ); // Verifica se a rota é protegida por função
  const authToken = request.cookies.get("refreshToken");

  if (!authToken && publicRoute) {
    //quando não autenticado e rota pública
    // Se a rota pública não permitir acesso quando autenticado, redireciona
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    //quando não autenticado e rota privada
    // Se a rota não for pública, redireciona para a página de login
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECIONE_QUANDO_NAO_AUTENTICADO;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.quandoAutenticado === "redirecionar"
  ) {
    //quando autenticado e rota pública
    // Se a rota pública permitir acesso quando autenticado, redireciona
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    //quando autenticado e rota privada
    // Se a rota não for pública, permite o acesso

    //Verificar se o jwt não esta expirado, se sim, remove o cookie e redireciona para a página de login
    const currentTime = Math.floor(Date.now() / 1000);
    const token = authToken.value;

    try {
      const decodedToken = jwtDecode(token) as { exp: number; role?: string };

      if (decodedToken.exp < currentTime) {
        // Token expirado — criar nova resposta com cookie expirado e redirecionamento
        const response = NextResponse.redirect(
          new URL(REDIRECIONE_QUANDO_NAO_AUTENTICADO, request.url)
        );

        // Deleta o cookie no navegador (expira imediatamente)
        response.cookies.set("refreshToken", "", {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: new Date(0),
        });

        return response;
      }

      if (protectedRoute && decodedToken.role !== protectedRoute.role) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECIONE_NAO_AUTORIZADO;
        return NextResponse.redirect(redirectUrl);
      }
    } catch (e) {
      // Token malformado — também redireciona e limpa cookie
      const response = NextResponse.redirect(
        new URL(REDIRECIONE_QUANDO_NAO_AUTENTICADO, request.url)
      );
      response.cookies.set("refreshToken", "", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(0),
      });
      return response;
    }

    // Token válido
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
