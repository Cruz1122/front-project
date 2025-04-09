import { ENV } from "../utils";
const {BASE_PATH, BASE_API, API_ROUTES} = ENV

export class Auth {
     async signIn(data) {
        const response = await fetch(`${ENV.BASE_API}${API_ROUTES.SIGNIN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        console.log("response", response);
        
        return response;
    }

    async verifyCode(data) {
        const response = await fetch(`${ENV.BASE_API}${API_ROUTES.VERIFY_CODE}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        console.log("response", response);
        
        return response;
    }
}

export const auth = new Auth()