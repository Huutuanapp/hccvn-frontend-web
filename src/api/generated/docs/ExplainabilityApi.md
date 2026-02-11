# ExplainabilityApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**explainTraceApiExplainTraceIdGet**](ExplainabilityApi.md#explaintraceapiexplaintraceidget) | **GET** /api/explain/{trace_id} | Explain Trace |



## explainTraceApiExplainTraceIdGet

> any explainTraceApiExplainTraceIdGet(traceId)

Explain Trace

EN: Explain decision flow by trace_id. VI: Giải trình luồng quyết định theo trace_id.

### Example

```ts
import {
  Configuration,
  ExplainabilityApi,
} from '';
import type { ExplainTraceApiExplainTraceIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ExplainabilityApi();

  const body = {
    // string
    traceId: traceId_example,
  } satisfies ExplainTraceApiExplainTraceIdGetRequest;

  try {
    const data = await api.explainTraceApiExplainTraceIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **traceId** | `string` |  | [Defaults to `undefined`] |

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
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

