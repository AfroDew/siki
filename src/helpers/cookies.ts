function getCookies(keys: string[], request: Request) {
    
}


/** Delete a cookie from the response  */
export function deleteCookie(response: Response, names: string[]) {
    for (const name of names) {
        // Set the cookie with an expiration date in the past
        const pastDate = new Date(0); // A date in the past
        response.headers.set("Set-Cookie", `${name}=; Expires=${pastDate.toUTCString()}; Path=/`);
    }
    return response
}


/** Function to delete a cookie from the response  */
export function deleteCookie(response: Response, names: string[]) {
    for (const name of names) {
        // Set the cookie with an expiration date in the past
        const pastDate = new Date(0); // A date in the past
        response.headers.set("Set-Cookie", `${name}=; Expires=${pastDate.toUTCString()}; Path=/`);
    }
    return response
}


interface Cookie {
    name: string;
    value: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
}