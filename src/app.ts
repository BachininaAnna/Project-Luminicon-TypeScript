import {Router} from "./router";

export class App {
    private router: Router;
    constructor(){
        this.router = new Router();
        window.addEventListener('DOMContentLoaded',this.handleRouteChanging.bind(this));
        window.addEventListener('popstate',this.handleRouteChanging.bind(this));
    }
    private handleRouteChanging(){
        this.router.openRoute();
    }
}

(new App());