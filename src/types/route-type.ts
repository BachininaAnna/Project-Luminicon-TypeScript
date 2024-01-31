export type RouteType = {
    route: string,
    title: string,
    template: string,
    load(): void,
    modal?: string,
    h1?: string,
    create?: string
}