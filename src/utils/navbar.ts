import {Auth} from "../services/auth";
import {UserInfoType} from "../types/user-info.type";

export class Navbar {
    public static linkActive(routeTitle: string): void {
        const main: HTMLElement | null = document.getElementById('navbar-main');
        const both: HTMLElement | null = document.getElementById('navbar-both');
        const incomes: HTMLElement | null = document.getElementById('navbar-incomes');
        const expense: HTMLElement | null = document.getElementById('navbar-expense');

        if (!main || !both || !incomes || !expense) {
            return
        }

        if (routeTitle === 'Главная') {
            main.classList.add('active');
        } else {
            main.classList.remove('active');
        }
        if (routeTitle === 'Доходы и Расходы') {
            both.classList.add('active');
        } else {
            both.classList.remove('active');
        }
        if (routeTitle === 'Доходы') {
            incomes.classList.add('active');
        } else {
            incomes.classList.remove('active');
        }
        if (routeTitle === 'Расходы') {
            expense.classList.add('active');
        } else {
            expense.classList.remove('active');
        }
    }

    public static setUserName(): void {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const userInfoElem: HTMLElement | null = document.getElementById('userInfo');
        if (!userInfo || !userInfoElem) {
            return
        }
        userInfoElem.innerText = `${userInfo.name} ${userInfo.lastName}`;
    }
}