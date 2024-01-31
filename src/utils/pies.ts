import Chart from 'chart.js/auto';

export class Pies {
    readonly CHART_COLORS: string[];
    constructor(elem: HTMLElement, arrPercentages: number[], arrCategory: string[], title: string) {
        this.CHART_COLORS = ['#DC3545', '#FD7E14', '#24ff07', '#b90dfd', '#20C997', '#FFC107', '#B90DFDFF'];

        elem.remove();

        if (title === 'Доходы') {
            elem = this.createElem('wrapperIncomes', 'pie-incomes');
        }
        if (title === 'Расходы') {
            elem = this.createElem('wrapperExpenses', 'pie-expense');
        }

        this.config(elem, arrPercentages, arrCategory, title);
    }

    private createElem(wrapper: string, elemID: string): HTMLElement {
        const wrapperElem: HTMLElement | null = document.getElementById(wrapper);
        const elem: HTMLElement  = document.createElement('canvas');

        elem.setAttribute('id', elemID);
        elem.setAttribute('height', '467');
        elem.setAttribute('width', '437');

        if (wrapperElem){
            wrapperElem.appendChild(elem);
        }
        return elem;
    }

    public data(arrPercentages: number[], arrCategory: string[]): any {
        return {
            labels: arrCategory,
            datasets: [
                {
                    label: '$',
                    data: arrPercentages,
                    backgroundColor: Object.values(this.CHART_COLORS),
                }
            ]
        };
    }

    public config(elem: HTMLElement, arrPercentages: number[], arrCategory: string[], title: string): void {
        new Chart((elem as HTMLCanvasElement), {
            type: 'pie',
            data: this.data(arrPercentages, arrCategory),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                        color: '#052C65',
                        font: {
                            size: 28,
                            weight: 'bold',
                            family: 'Roboto'
                        },
                    },
                },
            },
        });
    }
}



