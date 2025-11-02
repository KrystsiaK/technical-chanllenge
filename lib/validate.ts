type FormData = Record<string, any>;

export type Rule<T extends FormData> = {
    field: keyof T;
    message: string;
    check: (values: T) => boolean;
}

export type ErrorMap<T extends FormData> = {
    [K in keyof T]?: string[];
}


export const validate = <T extends FormData>(values: T, rules: Rule<T>[]): ErrorMap<T> | null => {
    const errors = rules.reduce<ErrorMap<T>>((acc, r) => {
        if (r.check(values)) acc[r.field] = [...(acc[r.field] ?? []), r.message];
        return acc;
    }, {});

    return Object.keys(errors).length ? errors : null;
}

export const createValidator = <T extends FormData>(rules: Rule<T>[]) =>
    (values: T) => validate(values, rules);
