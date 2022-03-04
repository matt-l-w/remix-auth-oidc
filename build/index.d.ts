import { OAuth2Profile, OAuth2Strategy } from 'remix-auth-oauth2';
export declare type OIDCProfile = OAuth2Profile;
export declare type OIDCExtraParams = Record<string, unknown> & {
    id_token: string;
};
export declare class OpenIDConnectStrategy<User, Profile extends OIDCProfile, ExtraParams extends OIDCExtraParams> extends OAuth2Strategy<User, Profile, ExtraParams> {
    protected authorizationParams(params: URLSearchParams): URLSearchParams;
}
