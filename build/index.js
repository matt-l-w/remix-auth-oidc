"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIDConnectStrategy = void 0;
const remix_auth_oauth2_1 = require("remix-auth-oauth2");
class OpenIDConnectStrategy extends remix_auth_oauth2_1.OAuth2Strategy {
    authorizationParams(params) {
        params.set('scope', 'profile email openid');
        return params;
    }
}
exports.OpenIDConnectStrategy = OpenIDConnectStrategy;
