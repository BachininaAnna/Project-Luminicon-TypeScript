export type DefaultResponseType = {
    error: boolean,
    message: string,
    validation?: {
        key: any,
        message: string
    }
}