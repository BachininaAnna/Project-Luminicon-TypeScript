import config from "../../config/config";
import {DefaultResponseType} from "../types/default-response.type";
import {RefreshResType} from "../types/refresh-res.type";
import {UserInfoType} from "../types/user-info.type";

export class Auth {
    public static accessTokenKey = 'accessToken';
    public static refreshTokenKey = 'refreshToken';
    public static userInfoKey = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                    rememberMe: localStorage.getItem('rememberMe')
                })
            });

            if (response && response.status === 200) {
                const result: DefaultResponseType | RefreshResType = await response.json();
                if (result && !(result as DefaultResponseType).error) {
                    this.setTokens((result as RefreshResType).tokens.accessToken, (result as RefreshResType).tokens.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/login'
        return false;
    }

    public static async logOut(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: DefaultResponseType = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    localStorage.removeItem(this.userInfoKey);
                    return true;
                }
            }
        }
        return false;
    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: UserInfoType) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}