import {OAuth2Profile, OAuth2Strategy} from 'remix-auth-oauth2';

export type OIDCProfile = OAuth2Profile
export type OIDCExtraParams = Record<string, unknown> & {
  // eslint-disable-next-line camelcase
  id_token: string,
}

export class OpenIDConnectStrategy<
User, Profile extends OIDCProfile, ExtraParams extends OIDCExtraParams
> extends OAuth2Strategy<User, Profile, ExtraParams> {
	protected authorizationParams(params: URLSearchParams): URLSearchParams {
		params.set('scope', 'profile email openid');
		return params;
	}
}
