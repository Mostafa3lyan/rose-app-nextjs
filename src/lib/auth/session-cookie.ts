export const SESSION_COOKIE_NAME = `${
  process.env.NODE_ENV === 'production' ? '__Secure-' : ''
}next-auth.session-token`;

export function isSessionCookieName(name: string): boolean {
  return (
    name === SESSION_COOKIE_NAME ||
    (name.startsWith(`${SESSION_COOKIE_NAME}.`) &&
      /^\d+$/.test(name.slice(SESSION_COOKIE_NAME.length + 1)))
  );
}
