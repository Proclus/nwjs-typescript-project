
#ifndef NW_PROJECT_ADDON_H
#define NW_PROJECT_ADDON_H

#include <stdio.h>
#include <stdlib.h>
#include <node_api.h>
#include <js_native_api.h>

typedef void (*NWP_DataDestructor)(void* data);

// module's global data
typedef struct {
  void* data;
  NWP_DataDestructor data_destructor;
} NWP_AddonData;

typedef struct {
  void* res; /* Save calculation results */
  NWP_DataDestructor res_destructor; /* If provided _done_post_runmode() will call this method to clean up this.res */
  napi_ref user_data_ref; /* user data object passed to the run mode from the js context */
  napi_async_work work; /* job reference */
  napi_deferred deferred; /* returned promise */
} NWP_JobCtx;

#define NWP_NAPI_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
        return NULL;                                              \
      }                                                           \
    }                                                             \
  } while(0)

// More common headers below...

#endif // NW_PROJECT_ADDON_H
