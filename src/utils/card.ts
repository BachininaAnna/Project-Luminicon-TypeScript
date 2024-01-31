import {CategoryResType} from "../types/category-res.type";

export class Card {
    public static create(item: CategoryResType): HTMLElement {
        const firstWrapper: HTMLElement = document.createElement('div');
        const secondWrapper: HTMLElement = document.createElement('div');
        const thirdWrapper: HTMLElement = document.createElement('div');
        const title: HTMLElement = document.createElement('h3');
        const buttonEdit: HTMLElement = document.createElement('button');
        const buttonDelete: HTMLElement = document.createElement('button');

        firstWrapper.classList.add('pe-3', 'pb-4', 'my-card');
        firstWrapper.appendChild(secondWrapper);

        secondWrapper.classList.add('card', 'rounded-4');
        secondWrapper.setAttribute('id', item.id.toString());
        secondWrapper.appendChild(thirdWrapper);

        thirdWrapper.classList.add('card-body', 'm-1');
        thirdWrapper.appendChild(title);
        thirdWrapper.appendChild(buttonEdit);
        thirdWrapper.appendChild(buttonDelete);

        title.classList.add('text-custom-blue', 'mb-2', 'pb-1');
        title.innerText = item.title;

        buttonEdit.classList.add('btn', 'btn-primary', 'me-2', 'font-weight-500', 'font-14', 'edit');
        buttonEdit.innerText = 'Редактировать';

        buttonDelete.classList.add('btn', 'btn-danger', 'me-2', 'font-weight-500', 'font-14', 'delete');
        buttonDelete.innerText = 'Удалить';

        return firstWrapper;
    }
}