import {CustomHttp} from "./custom-http";
import config from "../../config/config";
import {Category} from "../components/category";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryResType} from "../types/category-res.type";

export class CategoryRequests {
    public static async getCategories(category: string, type: string | null = null): Promise<CategoryResType[]> {
        try {
            const result: DefaultResponseType | CategoryResType[] = await CustomHttp.request(config.host + '/categories/' + category, 'GET');

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            if (type === 'cards') {
                Category.fillCards((result as CategoryResType[]), category);
            }
            if (type === 'select') {
                Category.fillSelect(result as CategoryResType[]);
            }
            return (result as CategoryResType[]);

        } catch (error) {
            console.log(error);
            return []
        }
    }

    public static async createCategory(category: string, name: string): Promise<void> {
        try {
            const result: DefaultResponseType | CategoryResType = await CustomHttp.request(config.host + '/categories/' + category, 'POST', {
                title: name
            })

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async getElement(category: string, id: string): Promise<void> {
        try {
            const result: DefaultResponseType | CategoryResType = await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'GET');

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            Category.fillEditCategory((result as CategoryResType), category);

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async editCategory(category: string, name: string, id: string): Promise<void> {
        try {
            const result: DefaultResponseType | CategoryResType = await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'PUT', {
                title: name
            });

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            window.location.href = '#/' + category;

        } catch (error) {
            console.log(error);
            return
        }
    }

    public static async deleteCategory(category: string, id: string): Promise<void> {
        try {
            const result: DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'DELETE');

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }
            window.location.href = '#/' + category;

        } catch (error) {
            console.log(error);
            return
        }
    }
}