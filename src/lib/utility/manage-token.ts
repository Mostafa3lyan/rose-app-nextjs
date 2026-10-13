//^^==> to get token to use in mutation in server actions

import { decode, encode, JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from '@/lib/auth/session-cookie';

export async function getToken() {
  const tokenCookie = cookies().get(SESSION_COOKIE_NAME)?.value;

  try {
    const jwt = await decode({
      token: tokenCookie,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return jwt;
  } catch (error) {
    console.error("Error decoding token", error);

    return null;
  }
}

// =====================================================================================================================
//^^==>set Token Manually
export async function setToken(token: JWT) {
  const encodedToken = await encode({
    token,
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: 60 * 60 * 24 * 7,
  });

  cookies().set(SESSION_COOKIE_NAME, encodedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
}
