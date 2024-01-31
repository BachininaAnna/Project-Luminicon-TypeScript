import {Pies} from "../utils/pies";
import {Buttons} from "../utils/buttons";
import {Balance} from "../services/balance";
import {CategoryRequests} from "../services/category-requests";
import {DefaultResponseType} from "../types/default-response.type";
import {OperationResType} from "../types/operation-res.type";
import {CategoryResType} from "../types/category-res.type";

export class Main {
    readonly navbarElem: HTMLElement | null;

    constructor() {
        this.navbarElem = document.getElementById('navbar-main');
        if (this.navbarElem) {
            this.navbarElem.classList.add('active');
        }
        Balance.getValue();
        Buttons.buttonsPeriodControl('main');
    }

    public static async fillPies(result: DefaultResponseType | OperationResType[]): Promise<void> {
        const incomeCategory: CategoryResType[] = await CategoryRequests.getCategories('income');
        const expenseCategory: CategoryResType[] = await CategoryRequests.getCategories('expense');

        const incomePer = this.getArrPercentage(result, incomeCategory);
        const expensePer = this.getArrPercentage(result, expenseCategory);

        const incomesElem: HTMLElement | null = document.getElementById('pie-incomes');
        const expenseElem: HTMLElement | null = document.getElementById('pie-expense');

        const incomeArr: string[] = incomeCategory.map((item:CategoryResType) => item.title);
        const expenseArr: string[] = expenseCategory.map((item:CategoryResType) => item.title);

        if(!incomesElem || !expenseElem){
            return
        }
        new Pies(incomesElem, incomePer, incomeArr, 'Доходы');
        new Pies(expenseElem, expensePer, expenseArr, 'Расходы');
    }

    private static getArrPercentage(result: DefaultResponseType | OperationResType[], categories: CategoryResType[]): number[] {
        let arrPercentage: number[] = [];

        if (!categories){return []}

        categories.forEach((name:CategoryResType) => {
            let amount: number = 0;
            (result as OperationResType[]).filter((item: OperationResType) => {
                if (name.title === item.category) {
                    amount += item.amount;
                }
            });
            arrPercentage.push(amount);
        })
        return arrPercentage;
    }
}
