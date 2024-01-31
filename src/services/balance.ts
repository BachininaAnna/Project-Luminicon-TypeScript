import {CustomHttp} from "./custom-http";
import config from "../../config/config";
import {BalanceType} from "../types/balance.type";

export class Balance {
    public static async getValue(): Promise<void> {
        try {
            const result: BalanceType = await CustomHttp.request(config.host + '/balance', 'GET');
            if (result.balance === undefined) {
                throw new Error(result.toString())
            }
            const balance: HTMLElement | null = document.getElementById('balanceValue');
            if (balance) {
                balance.innerText = result.balance + '$';
            }
        } catch (error) {
            console.log(error);
            return
        }
    }
}