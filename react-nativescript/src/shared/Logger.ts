export function log(message?: any, ...optionalParams: any[]): void {
    if (!(globalThis as any).__DEV__) return;
    console.log(message, optionalParams);
}

export function warn(message?: any, ...optionalParams: any[]): void {
    if (!(globalThis as any).__DEV__) return;
    console.warn(message, optionalParams);
}

export function error(message?: any, ...optionalParams: any[]): void {
    console.error(message, optionalParams);
}
