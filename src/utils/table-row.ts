import {OperationResType} from "../types/operation-res.type";

export class TableRow {
    public static create(number: number, row: OperationResType): HTMLElement {
        const tr: HTMLElement = document.createElement('tr');
        const thNumber: HTMLElement = document.createElement('th');
        const tdType: HTMLElement = document.createElement('td');
        const tdCategory: HTMLElement = document.createElement('td');
        const tdAmount: HTMLElement = document.createElement('td');
        const tdDate: HTMLElement = document.createElement('td');
        const tdComment: HTMLElement = document.createElement('td');
        const tdButtons: HTMLElement = document.createElement('td');
        const butTrash: HTMLElement = document.createElement('button');
        const imgTrash: HTMLElement =document.createElement('img');
        const butPen: HTMLElement = document.createElement('button');
        const imgPen: HTMLElement =document.createElement('img');

        tr.setAttribute('id', row.id.toString());
        thNumber.setAttribute('scope', 'row');
        thNumber.classList.add('number-operation');
        thNumber.innerText = number.toString();
        if (row.type === 'income') {
            tdType.classList.add('text-success');
            tdType.innerText = 'доход';
        }
        if (row.type === 'expense') {
            tdType.classList.add('text-danger');
            tdType.innerText = 'расход';
        }
        if (row.category){
            tdCategory.innerText = row.category;
        }
        tdAmount.innerText = row.amount + '$';
        tdDate.innerText = row.date;
        tdComment.innerText = row.comment;

        butTrash.classList.add('btn', 'delete', 'p-0', 'me-2');
        imgTrash.setAttribute('src', '../static/images/trash-icon.svg');
        butPen.classList.add('btn', 'edit', 'p-0');
        imgPen.setAttribute('src', '../static/images/pen-icon.svg');

        butTrash.appendChild(imgTrash);
        butPen.appendChild(imgPen);
        tdButtons.appendChild(butTrash);
        tdButtons.appendChild(butPen);
        tr.appendChild(thNumber);
        tr.appendChild(tdType);
        tr.appendChild(tdCategory);
        tr.appendChild(tdAmount);
        tr.appendChild(tdDate);
        tr.appendChild(tdComment);
        tr.appendChild(tdButtons);
        return tr;
    }
}