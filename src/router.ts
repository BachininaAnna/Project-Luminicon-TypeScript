import {Form} from "./components/form";
import {Main} from "./components/main";
import {Category} from "./components/category";
import {Navbar} from "./utils/navbar";
import {Auth} from "./services/auth";
import config from "../config/config";
import {RouteType} from "./types/route-type";

export class Router {

    private routes: RouteType[];

    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                modal: '',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                modal: '',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                h1: 'Доходы',
                create: '#/create-income',
                template: 'templates/category.html',
                modal: 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.',
                load: () => {
                    new Category('income');
                }
            },
            {
                route: '#/create-income',
                title: 'Доходы',
                h1: 'Создание категории доходов',
                template: 'templates/create-category.html',
                load: () => {
                    new Category('create-income');
                }
            },
            {
                route: '#/edit-income',
                title: 'Доходы',
                h1: 'Редактирование категории доходов',
                template: 'templates/edit-category.html',
                load: () => {
                    new Category('edit-income');
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                h1: 'Расходы',
                create: '#/create-expense',
                template: 'templates/category.html',
                modal: 'Вы действительно хотите удалить категорию?',
                load: () => {
                    new Category('expense');
                }
            },
            {
                route: '#/create-expense',
                title: 'Расходы',
                h1: 'Создание категории расходов',
                template: 'templates/create-category.html',
                load: () => {
                    new Category('create-expense');
                }
            },
            {
                route: '#/edit-expense',
                title: 'Расходы',
                h1: 'Редактирование категории расходов',
                template: 'templates/edit-category.html',
                load: () => {
                    new Category('edit-expense');
                }
            },
            {
                route: '#/both',
                title: 'Доходы и Расходы',
                template: 'templates/both.html',
                modal: 'Вы действительно хотите удалить операцию?',
                load: () => {
                    new Category('both');
                }
            },
            {
                route: '#/create-both',
                title: 'Доходы и Расходы',
                template: 'templates/create-both.html',
                load: () => {
                    new Category('create-both');
                }
            },
            {
                route: '#/edit-both',
                title: 'Доходы и Расходы',
                template: 'templates/edit-both.html',
                load: () => {
                    new Category('edit-both');
                }
            }
        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash;
        if (urlRoute === '#/logout') {
            localStorage.clear();
            await Auth.logOut();
            window.location.hash = config.defaultPage;
            return;
        }

        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === window.location.hash;
        })
        if (!newRoute) {
            window.location.href = config.defaultPage;
            return;
        }


        const contentElem: HTMLElement | null = document.getElementById('content');
        if (contentElem) {
            contentElem.innerHTML = await fetch(newRoute.template).then(response => response.text());
        }

        const titleElem: HTMLElement | null = document.getElementById('title');
        if (titleElem) {
            titleElem.innerText = newRoute.title;
        }

        if (newRoute.h1) {
            const h1: HTMLElement | null = document.getElementById('h1');
            if (h1) {
                h1.innerText = newRoute.h1;
            }
        }

        if (newRoute.modal) {
            const modalText: HTMLElement | null = document.getElementById('modal-text');
            if (modalText) {
                modalText.innerText = newRoute.modal;
            }
        }

        if (newRoute.create) {
            const aCreateCategory: HTMLElement | null = document.getElementById('a-create-category');
            if (aCreateCategory) {
                aCreateCategory.setAttribute('href', newRoute.create);
            }
        }

        const navbar: HTMLElement | null = document.getElementById('navbar');
        if (navbar) {
            if (newRoute.route === '#/signup' || newRoute.route === '#/login') {
                navbar.classList.add('d-none');
            } else {
                navbar.classList.remove('d-none');
                Navbar.linkActive(newRoute.title);
                Navbar.setUserName();
            }
            newRoute.load();
        }
    }
}
