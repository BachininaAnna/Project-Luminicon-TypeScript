import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";

export class Form {
    readonly page: 'signup' | 'login';
    readonly btnEnter: HTMLElement | null;
    readonly password: HTMLElement | null;
    private fields: FormFieldType[];

    constructor(page: 'signup' | 'login') {
        this.page = page;
        this.btnEnter = document.getElementById('btnEnter');
        this.password = document.getElementById('password');
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'fullName',
                    id: 'fullName',
                    element: null,
                    regex: /^[А-Я][а-я]*\s[А-Я][а-я]*$/,
                    valid: false,
                },
            )
            this.fields.push(
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    valid: false,
                },
            )
        }

        const that: Form = this;
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this);
            }
        });
        if (this.btnEnter) {
            this.btnEnter.setAttribute('disabled', 'disabled');
            this.btnEnter.addEventListener('click', function () {
                that.processForm();
            });
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            field.valid = true;
            if (element.id === 'passwordRepeat') {
                this.validatePasswordRepeat(field, element);
            }
        }
        this.validateForm();
    }

    private validatePasswordRepeat(field: FormFieldType, element: HTMLInputElement): void{
        if (this.password && element.value === (this.password as HTMLInputElement).value) {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            field.valid = true;
        } else {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        }
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        if(this.btnEnter) {
            if (validForm) {
                this.btnEnter.removeAttribute('disabled');
            } else {
                this.btnEnter.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = (this.password as HTMLInputElement).value;

            if (this.page === 'login') {
                const rememberMe: HTMLElement | null = document.getElementById('rememberCheck');
                    if(rememberMe){
                        localStorage.setItem('rememberMe', ((rememberMe as HTMLInputElement).checked).toString());
                    }
            }
            if (this.page === 'signup') {
                localStorage.clear();
                const fullName = this.fields.find(item => item.name === 'fullName')?.element?.value;
                if(!fullName){
                    return
                }
                try {
                    const result: SignupResponseType  = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: fullName.split(' ')[0],
                        lastName: fullName.split(' ')[1],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat')?.element?.value
                    })
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        localStorage.setItem('newUserExpense', 'true');
                        localStorage.setItem('newUserIncome', 'true');
                        localStorage.setItem('rememberMe', 'false');
                    }
                } catch (error) {
                    console.log(error);
                    return
                }
            }
            try {
                const result: LoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: localStorage.getItem('rememberMe')
                })
                if (result) {
                    if (result.error || !result.tokens?.accessToken || !result.tokens.refreshToken
                        || !result.user?.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/';
                }

            } catch (error) {
                console.log(error);
                return
            }
        }
    }
}

