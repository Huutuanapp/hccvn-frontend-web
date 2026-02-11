# ProxyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**routeRequestApiRoutePost**](ProxyApi.md#routerequestapiroutepost) | **POST** /api/route/ | Route Request |



## routeRequestApiRoutePost

> any routeRequestApiRoutePost()

Route Request

EN: Forward request body to Agent Router &#x60;/route&#x60; endpoint.  VI: Chuyển tiếp request body sang endpoint &#x60;/route&#x60; của Agent Router.

### Example

```ts
import {
  Configuration,
  ProxyApi,
} from '';
import type { RouteRequestApiRoutePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProxyApi();

  try {
    const data = await api.routeRequestApiRoutePost();
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

