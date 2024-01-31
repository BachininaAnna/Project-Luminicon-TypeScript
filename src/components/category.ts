import config from "../../config/config";
import {Card} from "../utils/card";
import {CategoryRequests} from "../services/category-requests";
import {Buttons} from "../utils/buttons";
import {TableRow} from "../utils/table-row";
import {Balance} from "../services/balance";
import {Operations} from "../services/operations";
import {CategoryResType} from "../types/category-res.type";
import {OperationResType} from "../types/operation-res.type";

export class Category {

    readonly page: string;

    constructor(page: string) {
        this.page = page;
        Balance.getValue();

        if (this.page === 'income' || this.page === 'expense') {
            this.checkNewUser();
            CategoryRequests.getCategories(this.page, 'cards');
        }

        if (this.page === 'create-income') {
            Buttons.buttonCreate('income');
            Buttons.buttonCancel('#/income');
        }

        if (this.page === 'edit-income') {
            const id: string | null = localStorage.getItem('id');
            CategoryRequests.getElement('income', (id as string));
            Buttons.buttonCancel('#/income');
        }

        if (this.page === 'create-expense') {
            Buttons.buttonCreate('expense');
            Buttons.buttonCancel('#/expense');
        }

        if (this.page === 'edit-expense') {
            const id: string | null = localStorage.getItem('id');
            CategoryRequests.getElement('expense', (id as string));
            Buttons.buttonCancel('#/expense');
        }

        if (this.page === 'both') {
            this.checkNewUser();
            Buttons.buttonCreateIncomeBoth();
            Buttons.buttonCreateExpenseBoth();
            Buttons.buttonsPeriodControl('both');
        }
        if (this.page === 'create-both') {
            Buttons.activeCategorySelect();
            this.whatCategory();
            Buttons.buttonCreateOperations();
            Buttons.buttonCancel('#/both');
        }
        if (this.page === 'edit-both') {
            const id: string | null = localStorage.getItem('id');
            Operations.getElement(id as string);
            Buttons.buttonCancel('#/both');
        }
    }

    private checkNewUser(): void {
        const newUserIncome: string | null = localStorage.getItem('newUserIncome');
        const newUserExpense: string | null = localStorage.getItem('newUserExpense');
        if (newUserIncome && (this.page === 'income' || this.page === 'both')) {
            config.defaultCategories.income.forEach((item: string) => {
                CategoryRequests.createCategory('income', item);
            });
            localStorage.removeItem('newUserIncome');
        }
        if (newUserExpense && (this.page === 'expense' || this.page === 'both')) {
            config.defaultCategories.expense.forEach((item: string) => {
                CategoryRequests.createCategory('expense', item);
            });
            localStorage.removeItem('newUserExpense');
        }
    }

    private whatCategory(): void {
        const selectCategory: HTMLElement | null = document.getElementById('select-category');

        if (!selectCategory) {
            return
        }

        if ((selectCategory as HTMLInputElement).value === 'income') {
            CategoryRequests.getCategories('income', 'select');
        }
        if ((selectCategory as HTMLInputElement).value === 'expense') {
            CategoryRequests.getCategories('expense', 'select');
        }

        selectCategory.onchange = function () {
            if ((selectCategory as HTMLInputElement).value === 'income') {
                CategoryRequests.getCategories('income', 'select');
            }
            if ((selectCategory as HTMLInputElement).value === 'expense') {
                CategoryRequests.getCategories('expense', 'select');
            }
        }
    }


    public static fillCards(result: CategoryResType[], category: string): void {
        const cardsOld: NodeListOf<Element> | null = document.querySelectorAll('.my-card');
        cardsOld.forEach((item: Element) => item.remove());

        const cards: HTMLElement | null = document.getElementById('cards');
        if (!cards) {
            return
        }
        result.forEach((item: CategoryResType) => {
            const card: HTMLElement | null = Card.create(item);
            cards.prepend(card);
        })

        Buttons.buttonsEdit(category);
        Buttons.buttonsDelete(category);
    }

    public static fillEditCategory(result: CategoryResType, category: string): void {
        const nameCategoryInput: HTMLElement | null = document.getElementById('input-edit');

        if (!nameCategoryInput) {
            return
        }

        (nameCategoryInput as HTMLInputElement).value = result.title;
        nameCategoryInput.addEventListener('change', function () {
            Buttons.buttonSave(category, (nameCategoryInput as HTMLInputElement).value, result.id);
        })
    }

    public static fillTable(result: OperationResType[]): void {
        const rowsOld: NodeListOf<Element> | null = document.querySelectorAll('tr');
        rowsOld.forEach((item: Element) => item.remove());

        const table: HTMLElement | null = document.getElementById('tbody-income-expense');
        if (!table) {
            return
        }
        result.forEach((item: OperationResType) => {
            const row: HTMLElement | null = TableRow.create(result.indexOf(item) + 1, item);
            if (row) {
                table.append(row);
            }
        })

        Buttons.buttonsEdit('both');
        Buttons.buttonsDelete('both');
        //this.deleteOperationsFromBoth();
    }

    public static fillSelect(result: CategoryResType[]): void {
        const optionsOld: NodeListOf<Element> | null = document.querySelectorAll('#select-category-name > option');
        optionsOld.forEach((item: Element) => item.remove());

        const selectCategoryName: HTMLElement | null = document.getElementById('select-category-name');
        if (!selectCategoryName) {
            return
        }

        result.forEach((item: CategoryResType) => {
            const option: HTMLElement | null = document.createElement('option');
            option.setAttribute('value', (item.id).toString());
            option.innerText = item.title;
            selectCategoryName.appendChild(option);
        })
    }

    public static fillEditOperation(result: OperationResType): void {
        const type: HTMLElement | null = document.getElementById('select-category');
        const category: HTMLElement | null = document.getElementById('select-category-name');
        const amount: HTMLElement | null = document.getElementById('select-amount');
        const date: HTMLElement | null = document.getElementById('select-date');
        const comment: HTMLElement | null = document.getElementById('select-comment');
        const id: number = result.id;

        if (!type || !category || !amount || !date || !comment || !result.category) {
            return
        }

        if (result.type === 'income') {
            (type as HTMLInputElement).value = 'доход';
        }
        if (result.type === 'expense') {
            (type as HTMLInputElement).value = 'расход';
        }

        (category as HTMLInputElement).value = result.category;
        (amount as HTMLInputElement).value = result.amount.toString();
        (date as HTMLInputElement).value = result.date;
        (comment as HTMLInputElement).value = result.comment;

        Buttons.buttonSaveOperations(type, amount, date, comment, id);
    }

    public static async deleteOperationsFromBoth(): Promise<void> {
        const result: OperationResType[] = await Operations.getAll('both', 'all');

        result.forEach((item: OperationResType) => {
            if (item.category === undefined) {
                Operations.deleteCategory(item.id);
            }
        })
    }

}