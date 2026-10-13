import { authOption } from '@/auth';
import { isSessionCookieName } from '@/lib/auth/session-cookie';
import NextAuth from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const nextAuthHandler = NextAuth(authOption);

type RouteContext = {
  params: {
    nextauth: string[];
  };
};

function getSetCookieHeaders(headers: Headers): string[] {
  const headersWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (headersWithGetSetCookie.getSetCookie) {
    return headersWithGetSetCookie.getSetCookie();
  }

  const setCookieHeader = headers.get('set-cookie');
  return setCookieHeader
    ? setCookieHeader.split(/,(?=\s*[^;,=\s]+=)/)
    : [];
}

function makeSessionCookieTemporary(response: Response): Response {
  const setCookies = getSetCookieHeaders(response.headers);
  let changed = false;
  const updatedCookies = setCookies.map((setCookie) => {
    const separatorIndex = setCookie.indexOf('=');
    if (separatorIndex < 0) return setCookie;

    const name = setCookie.slice(0, separatorIndex).trim();
    const value = setCookie.slice(separatorIndex + 1).split(';', 1)[0].trim();

    if (!isSessionCookieName(name) || !value) return setCookie;

    changed = true;
    return setCookie
      .split(';')
      .filter(
        (attribute, index) =>
          index === 0 || !/^\s*(expires|max-age)=/i.test(attribute),
      )
      .join(';');
  });

  if (!changed) return response;

  const headers = new Headers(response.headers);
  headers.delete('set-cookie');
  updatedCookies.forEach((setCookie) => headers.append('set-cookie', setCookie));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handler(request: NextRequest, context: RouteContext) {
  let rememberMe = false;
  const [action, provider] = context.params.nextauth;

  if (
    request.method === 'POST' &&
    action === 'callback' &&
    provider === 'credentials'
  ) {
    const body = await request.clone().formData();
    rememberMe = body.get('rememberMe') === 'true';
  } else {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    rememberMe = token?.rememberMe === true;
  }

  const response = await nextAuthHandler(request, context);
  return rememberMe ? response : makeSessionCookieTemporary(response);
}

export { handler as GET, handler as POST };
