#include "nwp_addon.h"

#ifdef _WIN32
#include <Windows.h>
#else
#include <unistd.h>
#define Sleep(x) usleep((x)*1000)
#endif


/* Job handlers & complete callbacks */

static void _job_foo(napi_env env, void* data) {
  NWP_JobCtx* ctx = (NWP_JobCtx*)data;
  Sleep(3000);
}

static void _job_foo_completed(napi_env env, napi_status status, void* data) {
    // The job may have been cancelled.
   if (status == napi_cancelled) {
    // handle cancelled event
   } else if (status == napi_ok) {
       NWP_JobCtx* ctx = (NWP_JobCtx*)data;
       napi_value res_obj;
       napi_create_object(env, &res_obj);
       napi_value mode;
       napi_create_int32(env, 1, &mode);
       napi_set_named_property(env, res_obj, "mode", mode);
       napi_resolve_deferred(env, ctx->deferred, res_obj);

       // Clean up the work item associated with this run.
       napi_delete_reference(env, ctx->user_data_ref);
       napi_delete_async_work(env, ctx->work);
       if (ctx->res_destructor) { ctx->res_destructor(ctx->res); }
       ctx->deferred = NULL;
       free(ctx);
   }
}

// Create a deferred promise and an async queue work item.
static napi_value _foo_handler(napi_env env, napi_callback_info info) {
    napi_status status;
    napi_value work_name;
    napi_value promise;

    // Access to module global addon_data
    NWP_AddonData* addon_data;
    napi_get_instance_data(env, (void**)(&addon_data));

    size_t argc = 1;
    napi_value argv[1];
    // Retrieve the global addon data.
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

    napi_value user_data = argv[0];
    if (!user_data) {
        //...
    }

    NWP_JobCtx* ctx = NULL;
    ctx = malloc(sizeof(NWP_JobCtx));
    ctx->res = NULL;
    ctx->res_destructor = NULL;
    ctx->user_data_ref = NULL;
    ctx->work = NULL;
    napi_create_reference(env, user_data, 1, &ctx->user_data_ref);

    // Ensure that no work is currently in progress.
    // CHECK(addon_data->work == NULL && "Only one work item must exist at a time");

    // Create a resource string for async_hooks to describe this operation.
    napi_create_string_utf8(env, "job_foo", NAPI_AUTO_LENGTH, &work_name);

    // Create a deferred promise which we will resolve at the completion of the work.
    napi_create_promise(env, &(ctx->deferred), &promise);

    // Create an async work item, passing in the addon data, which will give the
    // worker thread access to the above-created deferred promise.
    napi_create_async_work(env, NULL, work_name, _job_foo, _job_foo_completed, ctx, &(ctx->work));

    // Queue the work item for execution.
    napi_queue_async_work(env, ctx->work);

    // This causes created `promise` to be returned to JavaScript.
    return promise;
}

// Free the per-addon-instance data.
static void _free_addon(napi_env env, void* data, void* hint) {
    NWP_AddonData* addon_data = (NWP_AddonData*)data;
//  CHECK(addon_data->work == NULL &&
//      "No work item in progress at module unload");

    // Clean up the optional data attached to the NWP_AddonData struct.
    if (addon_data->data && addon_data->data_destructor) {
        addon_data->data_destructor(addon_data->data);
    }
    free(addon_data);
}

// Shorthand macro for NAPI_MODULE with Init function passed in.
NAPI_MODULE_INIT(/*napi_env env, napi_value exports*/) {

    // Define addon-level data associated with this instance of the addon.
    NWP_AddonData* addon_data = (NWP_AddonData*)malloc(sizeof(NWP_AddonData));
    addon_data->data = NULL;

    // Make addon_data globally available throughout the lifetime of the module.
    napi_set_instance_data(env, addon_data, _free_addon, NULL);
    // Define the properties that will be set on exports.
    napi_property_descriptor foo_method = {
        "runFoo",
        NULL,
        _foo_handler,
        NULL,
        NULL,
        NULL,
        napi_default,
        NULL
    };

    napi_define_properties(env, exports, 1, &foo_method);
    // Return module exports
    return exports;
}
