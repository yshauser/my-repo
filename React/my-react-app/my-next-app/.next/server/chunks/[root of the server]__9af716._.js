module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/pages-api.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/fs/promises [external] (fs/promises, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("fs/promises", () => require("fs/promises"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("path", () => require("path"));

module.exports = mod;
}}),
"[project]/pages/api/saveToJsonFile.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_import__("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_import__("[externals]/path [external] (path, cjs)");
;
;
async function handler(req, res) {
    console.log('in save tasks');
    const { filename, data, type } = req.body;
    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({
            error: 'Invalid or missing fileName'
        });
    }
    if (!data || typeof data !== 'object') {
        return res.status(400).json({
            error: 'Invalid or missing data'
        });
    }
    const DATA_FILE_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'public', 'db', `${filename}.json`);
    console.log('Processing request: ', {
        filename,
        type,
        data
    });
    // Ensure the directory exists
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].mkdir(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(DATA_FILE_PATH), {
        recursive: true
    });
    // Read existing data if the file exists
    let existingData = [];
    try {
        const fileContent = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(DATA_FILE_PATH, 'utf8');
        existingData = JSON.parse(fileContent);
    // console.log ('Existing Data', {existingData});
    } catch (readError) {
        if (readError.code !== 'ENOENT') {
            console.error('Error reading file:', readError);
            return res.status(500).json({
                error: 'Failed to read existing data'
            });
        }
        // File does not exist; will create a new one
        console.log('File does not exist. Initializing new data file.');
        existingData = [];
    }
    console.log('Existing Data after try', {
        existingData
    });
    if (req.method === 'GET') {
        try {
            res.status(200).json(existingData);
        } catch (error) {
            console.error('Error reading existing data:', error);
            res.status(200).json([]); // Return empty array if file doesn't exist
        }
    } else if (req.method === 'POST') {
        try {
            console.log('save tasks POST');
            if (type === 'suspension') {
                console.log('med data suspension');
                // Ensure `medicines` and `suspension` are initialized
                if (!existingData.medicines) {
                    existingData.medicines = {
                        suspension: [],
                        caplets: [],
                        granules: []
                    };
                } else if (!Array.isArray(existingData.medicines.suspension)) {
                    existingData.medicines.suspension = [];
                }
                const updatedEntry = req.body.data;
                const existingIndex = existingData.medicines.suspension.findIndex((entry)=>entry.id === updatedEntry.id);
                if (existingIndex !== -1) {
                    // Overwrite the existing entry
                    console.log('index suspension', {
                        existingIndex,
                        updatedEntry
                    });
                    existingData.medicines.suspension[existingIndex] = updatedEntry;
                } else {
                    existingData.medicines.suspension.push(data);
                }
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
                res.status(200).json({
                    success: true
                });
            } else if (type === 'caplets') {
                console.log('med data caplets');
                if (!existingData.medicines) {
                    existingData.medicines = {
                        suspension: [],
                        caplets: [],
                        granules: []
                    };
                } else if (!Array.isArray(existingData.medicines.caplets)) {
                    existingData.medicines.caplets = [];
                }
                const updatedEntry = req.body.data;
                const existingIndex = existingData.medicines.caplets.findIndex((entry)=>entry.id === updatedEntry.id);
                if (existingIndex !== -1) {
                    // Overwrite the existing entry
                    console.log('index caplets', {
                        existingIndex,
                        updatedEntry
                    });
                    existingData.medicines.caplets[existingIndex] = updatedEntry;
                } else {
                    existingData.medicines.caplets.push(data);
                }
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
                res.status(200).json({
                    success: true
                });
            } else if (type === 'granules') {
                console.log('med data granules');
                if (!existingData.medicines) {
                    existingData.medicines = {
                        suspension: [],
                        caplets: [],
                        granules: []
                    };
                } else if (!Array.isArray(existingData.medicines.granules)) {
                    existingData.medicines.granules = [];
                }
                const updatedEntry = req.body.data;
                const existingIndex = existingData.medicines.granules.findIndex((entry)=>entry.id === updatedEntry.id);
                if (existingIndex !== -1) {
                    // Overwrite the existing entry
                    console.log('index granules', {
                        existingIndex,
                        updatedEntry
                    });
                    existingData.medicines.granules[existingIndex] = updatedEntry;
                } else {
                    existingData.medicines.granules.push(data);
                }
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
                res.status(200).json({
                    success: true
                });
            } else {
                console.log('type not suspension, caplets not granules', {
                    data
                });
                const updatedEntry = req.body.data;
                const existingIndex = existingData.findIndex((entry)=>entry.id === updatedEntry.id);
                if (existingIndex !== -1) {
                    existingData[existingIndex] = updatedEntry;
                    console.log('Overwrite the existing entry', {
                        existingIndex,
                        updatedEntry
                    });
                } else {
                    console.log('Else POST');
                    if (type === 'kids-order' || type === 'scheduled') {
                        // empty the existing data so the kids-list will replace the exisiting data
                        // existingData = [];
                        console.log('kids-order/scheduled - no need for []');
                        existingData = updatedEntry;
                    } else if (type === 'log') {
                        existingData = updatedEntry.flat();
                    } else {
                        // Add as a new entry
                        console.log('existingIndex', {
                            existingIndex,
                            updatedEntry
                        });
                        existingData.push(updatedEntry);
                    }
                }
                // existingData.push(data);
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
                res.status(200).json({
                    success: true
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({
                error: 'Failed to save data'
            });
        }
    } else if (req.method === 'DELETE') {
        // assume that the entry is removed in the app, so the data is already updated
        console.log('DELETE action updated data: ', data);
        if (type === 'suspension') {
            console.log('med data suspension');
            if (!existingData.medicines) {
                existingData.medicines = {
                    suspension: [],
                    caplets: [],
                    granules: []
                };
            }
            if (!Array.isArray(existingData.medicines.suspension)) {
                existingData.medicines.suspension = [];
            }
            existingData.medicines.suspension = data; // Assign directly instead of push
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
            res.status(200).json({
                success: true
            });
        } else if (type === 'caplets') {
            console.log('med data caplets');
            if (!existingData.medicines) {
                existingData.medicines = {
                    suspension: [],
                    caplets: [],
                    granules: []
                };
            }
            existingData.medicines.caplets = data; // Fix: Assign directly
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
            res.status(200).json({
                success: true
            });
        } else if (type === 'granules') {
            console.log('med data granules');
            if (!existingData.medicines) {
                existingData.medicines = {
                    suspension: [],
                    caplets: [],
                    granules: []
                };
            }
            existingData.medicines.granules = data; // Fix: Assign directly
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
            res.status(200).json({
                success: true
            });
        } else {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
            res.status(200).json({
                success: true
            });
        }
    } else {
        res.setHeader('Allow', [
            'GET',
            'POST',
            'DELETE'
        ]);
        res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
}
}}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        module.exports = __turbopack_require__("[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)");
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_esm__({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/saveToJsonFile.ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$saveToJsonFile$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/pages/api/saveToJsonFile.ts [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$saveToJsonFile$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$saveToJsonFile$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/saveToJsonFile",
        pathname: "/api/saveToJsonFile",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$saveToJsonFile$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__9af716._.js.map