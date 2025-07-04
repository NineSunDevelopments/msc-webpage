import {DateTime} from "luxon";

export function isDateString(dateString: string): boolean {
    const dateRegExp = /(\d{4}-\d{2}-\d{2})T?(\d{2}:\d{2}:\d{2}.\d{3})?\+?(\d{2}:\d{2})?/;
    const dateRegExp2 = /(\d{4}-\d{2}-\d{2})T?(\d{2}:\d{2}:\d{2}.\d{3})?Z/;

    return dateRegExp.test(dateString) || dateRegExp2.test(dateString);
}

export function parseDateString(dateString: string): DateTime {
    return DateTime.fromISO(dateString);
}

export function parseObjectForDate<T>(obj: any): T | DateTime {
    if (obj === undefined || obj === null)
        return obj;

    if (typeof obj === "string" && isDateString(obj)) {
        const date = parseDateString(obj);
        if (date.isValid)
            return date.toLocal();
    }

    if (DateTime.isDateTime(obj) && obj.isValid)
        return obj;

    if (typeof obj === "object") {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            obj[key] = parseObjectForDate(obj[key]);
        })
    }

    return obj;
}