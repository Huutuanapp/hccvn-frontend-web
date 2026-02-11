# AuthenticationApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getCurrentUserApiAuthMeGet**](AuthenticationApi.md#getcurrentuserapiauthmeget) | **GET** /api/auth/me | Get Current User |
| [**getJwksApiAuthWellKnownJwksJsonGet**](AuthenticationApi.md#getjwksapiauthwellknownjwksjsonget) | **GET** /api/auth/.well-known/jwks.json | Get Jwks |
| [**healthApiAuthHealthGet**](AuthenticationApi.md#healthapiauthhealthget) | **GET** /api/auth/health | Health |
| [**loginApiAuthLoginPost**](AuthenticationApi.md#loginapiauthloginpost) | **POST** /api/auth/login | Login |
| [**refreshTokenApiAuthRefreshPost**](AuthenticationApi.md#refreshtokenapiauthrefreshpost) | **POST** /api/auth/refresh | Refresh Token |
| [**registerApiAuthRegisterPost**](AuthenticationApi.md#registerapiauthregisterpost) | **POST** /api/auth/register | Register |



## getCurrentUserApiAuthMeGet

> any getCurrentUserApiAuthMeGet()

Get Current User

Get current user profile (requires auth)  GET /api/auth/me Headers: Authorization: Bearer &lt;token&gt; Response: {\&quot;id\&quot;: \&quot;...\&quot;, \&quot;email\&quot;: \&quot;...\&quot;, \&quot;full_name\&quot;: \&quot;...\&quot;, \&quot;roles\&quot;: [...]}

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { GetCurrentUserApiAuthMeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.getCurrentUserApiAuthMeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getJwksApiAuthWellKnownJwksJsonGet

> any getJwksApiAuthWellKnownJwksJsonGet()

Get Jwks

Get JSON Web Key Set for JWT verification  GET /api/auth/.well-known/jwks.json Response: {\&quot;keys\&quot;: [{...}]}

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { GetJwksApiAuthWellKnownJwksJsonGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.getJwksApiAuthWellKnownJwksJsonGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## healthApiAuthHealthGet

> any healthApiAuthHealthGet()

Health

Auth proxy health check (no forwarding)

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { HealthApiAuthHealthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.healthApiAuthHealthGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## loginApiAuthLoginPost

> any loginApiAuthLoginPost()

Login

User login  POST /api/auth/login Body: {\&quot;email\&quot;: \&quot;user@example.com\&quot;, \&quot;password\&quot;: \&quot;password\&quot;} Response: {\&quot;access_token\&quot;: \&quot;...\&quot;, \&quot;token_type\&quot;: \&quot;bearer\&quot;, \&quot;expires_in\&quot;: 3600}

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { LoginApiAuthLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.loginApiAuthLoginPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## refreshTokenApiAuthRefreshPost

> any refreshTokenApiAuthRefreshPost()

Refresh Token

Refresh access token  POST /api/auth/refresh Body: {\&quot;refresh_token\&quot;: \&quot;...\&quot;} Response: {\&quot;access_token\&quot;: \&quot;...\&quot;, \&quot;token_type\&quot;: \&quot;bearer\&quot;}

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { RefreshTokenApiAuthRefreshPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.refreshTokenApiAuthRefreshPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerApiAuthRegisterPost

> any registerApiAuthRegisterPost()

Register

User registration  POST /api/auth/register Body: {\&quot;email\&quot;: \&quot;...\&quot;, \&quot;password\&quot;: \&quot;...\&quot;, \&quot;full_name\&quot;: \&quot;...\&quot;} Response: {\&quot;user\&quot;: {...}, \&quot;access_token\&quot;: \&quot;...\&quot;}

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { RegisterApiAuthRegisterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  try {
    const data = await api.registerApiAuthRegisterPost();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

