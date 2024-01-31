import {CategoryRequests} from "../services/category-requests";
import {Operations} from "../services/operations";
import {Buttons} from "./buttons";
import {Category} from "../components/category";

export class Popup {
    public static show(category: string, id: string): void {
        const modal: HTMLElement | null = document.getElementById('modal');
        const buttonConfirm: HTMLElement | null = document.getElementById('modal-confirm');
        const buttonCancel: HTMLElement | null = document.getElementById('modal-cancel');

        if(!modal || !buttonConfirm || !buttonCancel){
            return
        }

        modal.classList.add('d-block');

        buttonCancel.addEventListener('click', function () {
            modal.classList.remove('d-block');
        })
        buttonConfirm.addEventListener('click', function () {
            if (category === 'income' || category === 'expense'){
                CategoryRequests.deleteCategory(category, id);
                Category.deleteOperationsFromBoth();
            }
            if (category === 'both') {
                const period: string | null = localStorage.getItem('period');
                const interval: string = Buttons.getInterval();
                Operations.deleteCategory(id);

                if(period){
                    Operations.getAll('both',period, interval);
                }

            }
            modal.classList.remove('d-block');
        })
    }
}
