import {CustomHttp} from "./custom-http";
import config from "../../config/config";
import {Category} from "../components/category";
import {Main} from "../components/main";
import {DefaultResponseType} from "../types/default-response.type";
import {OperationResType} from "../types/operation-res.type";

export class Operations {
    public static async getAll(page: string, period: string, interval: string = ''): Promise<OperationResType[]> {
        try {
            const result: DefaultResponseType | OperationResType[] = await CustomHttp.request(config.host + '/operations?period=' + period + interval, 'GET');

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            if (page === 'main') {
                Main.fillPies(result as OperationResType[]);
            }
            if (page === 'both') {
                Category.fillTable(result as OperationResType[]);
            }
            return (result as OperationResType[]);

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public static async create(type: string, amount: string, date: string, comment: string, id: string): Promise<void> {
        try {
            const result: DefaultResponseType | OperationResType = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: type,
                amount: parseInt(amount),
                date: date,
                comment: comment,
                category_id: parseInt(id)
            })

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            window.location.href = '#/both';

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async getElement(id: string): Promise<void> {
        try {
            const result: DefaultResponseType | OperationResType = await CustomHttp.request(config.host + '/operations/' + id, 'GET');
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            Category.fillEditOperation(result as OperationResType);

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async editCategory(type: string, amount: string, date: string, comment: string, id: number | string): Promise<void> {
        try {
            const result: DefaultResponseType | OperationResType = await CustomHttp.request(config.host + '/operations/' + id, 'PUT', {
                type: type,
                amount: amount,
                date: date,
                comment: comment,
                category_id: id
            });
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            window.location.href = '#/both';

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async deleteCategory(id:number | string): Promise<void> {
        try {
            const result: DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
        } catch (error) {
            console.log(error);
            return
        }
    }
}