import {Popup} from "./popup";
import {CategoryRequests} from "../services/category-requests";
import {Operations} from "../services/operations";

export class Buttons {
    private static category: string = '';

    public static buttonsEdit(location: string): void {
        const buttonsEdit: NodeListOf<Element> | null = document.querySelectorAll('button.edit');
        buttonsEdit.forEach((item: Element) => {
            item.addEventListener('click', function () {
                if (!item.parentElement || !item.parentElement.parentElement) {
                    return
                }
                const id: string | null = item.parentElement.parentElement.getAttribute('id');
                if (id) {
                    localStorage.setItem('id', id);
                }
                window.location.href = '#/edit-' + location;
            })
        })

    }

    public static buttonsDelete(category: string): void {
        const buttonsDelete: NodeListOf<Element> | null = document.querySelectorAll('button.delete');
        buttonsDelete.forEach((item: Element) => {
            item.addEventListener('click', function () {
                if (!item.parentElement || !item.parentElement.parentElement) {
                    return
                }
                const id: string | null = item.parentElement.parentElement.getAttribute('id');
                if (id) {
                    Popup.show(category, id);
                }
            })
        })
    }

    public static buttonCreate(category: string): void {
        const btnCreate: HTMLElement | null = document.getElementById('create');
        if (!btnCreate) {
            return
        }
        btnCreate.addEventListener('click', function () {
            const newCategory: HTMLElement | null = document.getElementById('new-category');
            if (newCategory && (newCategory as HTMLInputElement).value) {
                CategoryRequests.createCategory(category, (newCategory as HTMLInputElement).value);
                window.location.href = '#/' + category;
            }
        });
    }

    public static buttonCancel(location: string): void {
        const buttonCancel: HTMLElement | null = document.getElementById('cancel');
        if (!buttonCancel) {
            return
        }
        buttonCancel.addEventListener('click', function () {
            window.location.href = location;
        })
    }

    public static buttonSave(category: string, name: string, id: number): void {
        const buttonSave: HTMLElement | null = document.getElementById('edit-save');
        if (!buttonSave) {
            return
        }
        buttonSave.addEventListener('click', function () {
            if (name) {
                CategoryRequests.editCategory(category, name, id.toString());
            }
        });
    }

    public static buttonCreateIncomeBoth(): void {
        const buttonCreateIncome: HTMLElement | null = document.getElementById('create-income');
        if (buttonCreateIncome) {
            buttonCreateIncome.addEventListener('click', function () {
                Buttons.category = 'income';
                window.location.href = '#/create-both';
            })
        }
    }

    public static buttonCreateExpenseBoth(): void {
        const buttonCreateExpense = document.getElementById('create-expense');
        if (buttonCreateExpense) {
            buttonCreateExpense.addEventListener('click', function () {
                Buttons.category = 'expense';
                window.location.href = '#/create-both';
            })
        }
    }

    public static activeCategorySelect(): void {
        const income: HTMLElement | null = document.getElementById('select-category-1');
        const expense: HTMLElement | null = document.getElementById('select-category-2');
        if (!income || !expense) {
            return
        }

        if (Buttons.category === 'income') {
            income.setAttribute('selected', '');
        }
        if (Buttons.category === 'expense') {
            expense.setAttribute('selected', '');
        }
    }

    public static buttonCreateOperations(): void {
        const btnCreate: HTMLElement | null = document.getElementById('create-both');
        const date: HTMLElement | null = document.getElementById('select-date');
        if (!btnCreate || !date) {
            return
        }
        (date as HTMLInputElement).value = Buttons.getToday();

        btnCreate.addEventListener('click', function () {
            const type: HTMLElement | null = document.getElementById('select-category');
            const amount: HTMLElement | null = document.getElementById('select-amount');
            const comment: HTMLElement | null = document.getElementById('select-comment');
            const category: HTMLElement | null = document.getElementById('select-category-name');
            if (!type || !amount || !comment || !category) {
                return
            }

            if ((amount as HTMLInputElement).value && (date as HTMLInputElement).value) {
                if (!(comment as HTMLInputElement).value) {
                    (comment as HTMLInputElement).value = " ";
                }
                Operations.create((type as HTMLInputElement).value, (amount as HTMLInputElement).value,
                    (date as HTMLInputElement).value, (comment as HTMLInputElement).value, (category as HTMLInputElement).value);
                window.location.href = '#/both';
            }
        });
    }

    public static buttonsPeriodControl(page: string): void {
        const buttons: NodeListOf<Element> | null = document.querySelectorAll('#buttons-period-control > button');
        const activeButton: Element | null = document.querySelectorAll('#buttons-period-control > .active')[0];
        const btnInterval: HTMLElement | null = document.getElementById('btn-interval');
        let dateFromInput: HTMLElement | null = document.getElementById('date-from');
        let dateToInput: HTMLElement | null = document.getElementById('date-to');

        if (!buttons || !activeButton || !dateFromInput || !dateToInput || !btnInterval) {
            return
        }

        this.buttonsPeriodControlRequests(page, activeButton);

        dateFromInput.onchange = function () {
            Buttons.buttonsPeriodControlRequests(page, dateFromInput);
            Buttons.setColor(buttons, btnInterval);
        }
        dateToInput.onchange = function () {
            Buttons.buttonsPeriodControlRequests(page, dateToInput);
            Buttons.setColor(buttons, btnInterval);
        }

        buttons.forEach((btn: Element) => {
            btn.addEventListener('click', function () {
                Buttons.setColor(buttons, btn);
                Buttons.buttonsPeriodControlRequests(page, btn);
            })
        });
    }

    private static setColor(buttons: NodeListOf<Element>, btn: Element | HTMLElement): void {
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        btn.classList.add('active');
    }

    public static buttonsPeriodControlRequests(page: string, btn: Element | HTMLElement | null): void {
        if (!btn) {
            return
        }
        const period: string | null = btn.getAttribute('aria-description');
        if (!period) {
            return
        }
        localStorage.setItem('period', period);

        if (period === 'interval') {
            const dateFromElem: HTMLElement | null = document.getElementById('date-from');
            const dateToElem: HTMLElement | null = document.getElementById('date-to');
            if (!dateFromElem || !dateToElem) {
                return;
            }
            let dateFrom: string = (dateFromElem as HTMLInputElement).value;
            let dateTo: string = (dateToElem as HTMLInputElement).value;

            if (btn.getAttribute('id') === 'btn-today') {
                dateFrom = this.getToday();
                dateTo = this.getToday();
            }
            localStorage.setItem('dateFrom', dateFrom);
            localStorage.setItem('dateTo', dateTo);
            const interval = this.getInterval();

            Operations.getAll(page, period, interval);

        } else {
            Operations.getAll(page, period);
        }
    }

    private static getToday(): string {
        const today: Date = new Date();
        let month: number | string = today.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        return `${today.getFullYear()}-${month}-${today.getDate()}`;
    }

    public static getInterval(): string {
        let dateFrom: string | null = localStorage.getItem('dateFrom');
        let dateTo: string | null = localStorage.getItem('dateTo');
        if (!dateFrom) {
            dateFrom = this.getToday();
        }
        if (!dateTo) {
            dateTo = this.getToday();
        }
        return '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    }

    public static buttonSaveOperations(type: HTMLElement, amount: HTMLElement,
                                       date: HTMLElement, comment: HTMLElement, id: number): void {
        const btnCreate: HTMLElement | null = document.getElementById('edit-both-save');
        if (!btnCreate) {
            return
        }
        btnCreate.addEventListener('click', function () {
            if (!(comment as HTMLInputElement).value) {
                (comment as HTMLInputElement).value = " ";
            }
            Operations.editCategory((type as HTMLInputElement).value, (amount as HTMLInputElement).value,
                (date as HTMLInputElement).value, (comment as HTMLInputElement).value, id);
            window.location.href = '#/both';
        });
    }
}