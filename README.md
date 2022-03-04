# OpenIDConnectStrategy

A strategy to use and implement OpenIDConnect, slightly extending the [OAuth2 Strategy](https://github.com/sergiodxa/remix-auth-oauth2).

This strategy heavily leans on the OAuth2 strategy and it's recommended that you understand how that strategy works first.

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ✅          |

## How to use

### Extending it

You can use this strategy as a base class for another strategy using OpenIDConnect.

Here's an example of implementing this for [Keycloak](https://www.keycloak.org/).

```ts
import { OIDCExtraParams, OIDCProfile, OpenIDConnectStrategy } from 'remix-auth-oidc';
import { getUser } from 'your-auth-module';

type KeycloakUserInfo = {
  sub: string,
  email: string,
  preferred_username?: string,
  name?: string,
  given_name?: string,
  family_name?: string,
  picture?: string
}

export type KeycloakUser = {
  id: string
  name?: string
  email: string
  accessToken: string
  refreshToken: string
}

export class KeycloakStrategy extends OpenIDConnectStrategy<KeycloakUser, OIDCProfile, OIDCExtraParams> {
  name = 'keycloak';

  constructor() {
    super(
      {
        authorizationURL: `${process.env.KEYCLOAK_TRUST_ISSUER!}/protocol/openid-connect/auth`,
        tokenURL: `${process.env.KEYCLOAK_TRUST_ISSUER!}/protocol/openid-connect/token`,
        clientID: process.env.KEYCLOAK_CLIENT_ID!,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
        callbackURL: process.env.CALLBACK_URL!,
      },
      async (user) => {
        // here you can use the params above to get the user and return it
        // what you do inside this and how you find the user is up to you
        return await getUser(
          accessToken,
          refreshToken,
          extraParams,
          profile,
          context
        );
      }
    )
  }

  protected async userProfile(accessToken: string, params: OIDCExtraParams): Promise<OIDCProfile> {
    const response = await fetch(
      `${process.env.KEYCLOAK_TRUST_ISSUER!}/protocol/openid-connect/userinfo`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      }
    );
    if (!response.ok) {
      try {
        let body = await response.text();
        throw new Response(body, { status: 401 });
      } catch (error) {
        throw new Response((error as Error).message, { status: 401 });
      }
    }
    const data: KeycloakUserInfo = await response.json();
    return {
      provider: 'keycloak',
      id: data.sub,
      emails: [{ value: data.email }],
      displayName: data.name,
      name: {
        familyName: data.family_name,
        givenName: data.given_name,
      },
    }
  }
}
```
