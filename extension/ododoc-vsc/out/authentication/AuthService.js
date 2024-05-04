"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLoginUri = exports.AuthTokenService = void 0;
class AuthTokenService {
    context;
    constructor(context) {
        this.context = context;
    }
    async storeAccessToken(token, provider) {
        try {
            await this.context.secrets.store(`authToken-${provider}`, token);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async retrieveAccessToken(provider) {
        try {
            const token = await this.context.secrets.get(`authToken-${provider}`);
            return token;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
}
exports.AuthTokenService = AuthTokenService;
const handleLoginUri = async (uri) => {
    if (uri.path === "/callback") {
        const params = new URLSearchParams(uri.query);
        const token = params.get("token");
        const provider = params.get("provider");
        if (token && provider) {
            await storeAccessToken(token, provider);
        }
    }
};
exports.handleLoginUri = handleLoginUri;
//# sourceMappingURL=AuthService.js.map