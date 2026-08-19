import { Request, Response } from 'express';

export class CookieUtil {
    private static readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

    private static readonly COOKIE_OPTIONS = {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const, // or 'none' if frontend/back are different sites
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    static setRefreshToken(response: Response, token: string): void {
        response.cookie(
            this.REFRESH_TOKEN_COOKIE_NAME,
            token,
            this.COOKIE_OPTIONS
        );
    }

    static getRefreshToken(request: Request): string | undefined {
        return request.cookies?.[this.REFRESH_TOKEN_COOKIE_NAME];
    }
}