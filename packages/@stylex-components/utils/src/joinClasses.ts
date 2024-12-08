export function joinClasses(...className: any): string {
    let newClassName = className as unknown as string || '';
    const argLength = arguments.length;

    if (argLength > 1) {
        for (let index = 1; index < argLength; index++) {
            const nextClass = arguments[index];
            if (nextClass) {
                newClassName = (newClassName ? newClassName + ' ' : '') + nextClass;
            }
        }
    }
    return newClassName;
}