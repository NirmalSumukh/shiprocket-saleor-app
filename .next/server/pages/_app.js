/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/lib/create-graphq-client.ts":
/*!*****************************************!*\
  !*** ./src/lib/create-graphq-client.ts ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClient: () => (/* binding */ createClient)\n/* harmony export */ });\n/* harmony import */ var _urql_exchange_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @urql/exchange-auth */ \"@urql/exchange-auth\");\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! urql */ \"urql\");\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(urql__WEBPACK_IMPORTED_MODULE_1__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_urql_exchange_auth__WEBPACK_IMPORTED_MODULE_0__]);\n_urql_exchange_auth__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst createClient = (url, getAuth)=>(0,urql__WEBPACK_IMPORTED_MODULE_1__.createClient)({\n        url,\n        exchanges: [\n            urql__WEBPACK_IMPORTED_MODULE_1__.dedupExchange,\n            urql__WEBPACK_IMPORTED_MODULE_1__.cacheExchange,\n            (0,_urql_exchange_auth__WEBPACK_IMPORTED_MODULE_0__.authExchange)({\n                addAuthToOperation: ({ authState, operation })=>{\n                    if (!authState || !authState?.token) {\n                        return operation;\n                    }\n                    const fetchOptions = typeof operation.context.fetchOptions === \"function\" ? operation.context.fetchOptions() : operation.context.fetchOptions || {};\n                    return {\n                        ...operation,\n                        context: {\n                            ...operation.context,\n                            fetchOptions: {\n                                ...fetchOptions,\n                                headers: {\n                                    ...fetchOptions.headers,\n                                    \"Authorization-Bearer\": authState.token\n                                }\n                            }\n                        }\n                    };\n                },\n                getAuth\n            }),\n            urql__WEBPACK_IMPORTED_MODULE_1__.fetchExchange\n        ]\n    });\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2NyZWF0ZS1ncmFwaHEtY2xpZW50LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBK0Q7QUFNakQ7QUFNUCxNQUFNRSxlQUFlLENBQUNJLEtBQWFDLFVBQ3hDSixrREFBZ0JBLENBQUM7UUFDZkc7UUFDQUUsV0FBVztZQUNUSiwrQ0FBYUE7WUFDYkgsK0NBQWFBO1lBQ2JELGlFQUFZQSxDQUFhO2dCQUN2QlMsb0JBQW9CLENBQUMsRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7b0JBQzNDLElBQUksQ0FBQ0QsYUFBYSxDQUFDQSxXQUFXRSxPQUFPO3dCQUNuQyxPQUFPRDtvQkFDVDtvQkFFQSxNQUFNRSxlQUNKLE9BQU9GLFVBQVVHLE9BQU8sQ0FBQ0QsWUFBWSxLQUFLLGFBQ3RDRixVQUFVRyxPQUFPLENBQUNELFlBQVksS0FDOUJGLFVBQVVHLE9BQU8sQ0FBQ0QsWUFBWSxJQUFJLENBQUM7b0JBRXpDLE9BQU87d0JBQ0wsR0FBR0YsU0FBUzt3QkFDWkcsU0FBUzs0QkFDUCxHQUFHSCxVQUFVRyxPQUFPOzRCQUNwQkQsY0FBYztnQ0FDWixHQUFHQSxZQUFZO2dDQUNmRSxTQUFTO29DQUNQLEdBQUdGLGFBQWFFLE9BQU87b0NBQ3ZCLHdCQUF3QkwsVUFBVUUsS0FBSztnQ0FDekM7NEJBQ0Y7d0JBQ0Y7b0JBQ0Y7Z0JBQ0Y7Z0JBQ0FMO1lBQ0Y7WUFDQUYsK0NBQWFBO1NBQ2Q7SUFDSCxHQUFHIiwic291cmNlcyI6WyJDOlxccHl0aG9ucHJvamVjdHNcXEUtQ29tbWVyY2VcXEFwcHNcXHNhbGVvci1hcHAtdGVtcGxhdGVcXHNyY1xcbGliXFxjcmVhdGUtZ3JhcGhxLWNsaWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRoQ29uZmlnLCBhdXRoRXhjaGFuZ2UgfSBmcm9tIFwiQHVycWwvZXhjaGFuZ2UtYXV0aFwiO1xyXG5pbXBvcnQge1xyXG4gIGNhY2hlRXhjaGFuZ2UsXHJcbiAgY3JlYXRlQ2xpZW50IGFzIHVycWxDcmVhdGVDbGllbnQsXHJcbiAgZGVkdXBFeGNoYW5nZSxcclxuICBmZXRjaEV4Y2hhbmdlLFxyXG59IGZyb20gXCJ1cnFsXCI7XHJcblxyXG5pbnRlcmZhY2UgSUF1dGhTdGF0ZSB7XHJcbiAgdG9rZW46IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNsaWVudCA9ICh1cmw6IHN0cmluZywgZ2V0QXV0aDogQXV0aENvbmZpZzxJQXV0aFN0YXRlPltcImdldEF1dGhcIl0pID0+XHJcbiAgdXJxbENyZWF0ZUNsaWVudCh7XHJcbiAgICB1cmwsXHJcbiAgICBleGNoYW5nZXM6IFtcclxuICAgICAgZGVkdXBFeGNoYW5nZSxcclxuICAgICAgY2FjaGVFeGNoYW5nZSxcclxuICAgICAgYXV0aEV4Y2hhbmdlPElBdXRoU3RhdGU+KHtcclxuICAgICAgICBhZGRBdXRoVG9PcGVyYXRpb246ICh7IGF1dGhTdGF0ZSwgb3BlcmF0aW9uIH0pID0+IHtcclxuICAgICAgICAgIGlmICghYXV0aFN0YXRlIHx8ICFhdXRoU3RhdGU/LnRva2VuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVyYXRpb247XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID1cclxuICAgICAgICAgICAgdHlwZW9mIG9wZXJhdGlvbi5jb250ZXh0LmZldGNoT3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgICAgICAgPyBvcGVyYXRpb24uY29udGV4dC5mZXRjaE9wdGlvbnMoKVxyXG4gICAgICAgICAgICAgIDogb3BlcmF0aW9uLmNvbnRleHQuZmV0Y2hPcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLm9wZXJhdGlvbixcclxuICAgICAgICAgICAgY29udGV4dDoge1xyXG4gICAgICAgICAgICAgIC4uLm9wZXJhdGlvbi5jb250ZXh0LFxyXG4gICAgICAgICAgICAgIGZldGNoT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgLi4uZmV0Y2hPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAuLi5mZXRjaE9wdGlvbnMuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uLUJlYXJlclwiOiBhdXRoU3RhdGUudG9rZW4sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0QXV0aCxcclxuICAgICAgfSksXHJcbiAgICAgIGZldGNoRXhjaGFuZ2UsXHJcbiAgICBdLFxyXG4gIH0pO1xyXG4iXSwibmFtZXMiOlsiYXV0aEV4Y2hhbmdlIiwiY2FjaGVFeGNoYW5nZSIsImNyZWF0ZUNsaWVudCIsInVycWxDcmVhdGVDbGllbnQiLCJkZWR1cEV4Y2hhbmdlIiwiZmV0Y2hFeGNoYW5nZSIsInVybCIsImdldEF1dGgiLCJleGNoYW5nZXMiLCJhZGRBdXRoVG9PcGVyYXRpb24iLCJhdXRoU3RhdGUiLCJvcGVyYXRpb24iLCJ0b2tlbiIsImZldGNoT3B0aW9ucyIsImNvbnRleHQiLCJoZWFkZXJzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/lib/create-graphq-client.ts\n");

/***/ }),

/***/ "./src/lib/no-ssr-wrapper.tsx":
/*!************************************!*\
  !*** ./src/lib/no-ssr-wrapper.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NoSSRWrapper: () => (/* binding */ NoSSRWrapper)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dynamic */ \"./node_modules/.pnpm/next@15.1.7_@babel+core@7.2_e69d135ea28a4d90edc8afcecc79943c/node_modules/next/dynamic.js\");\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst Wrapper = (props)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), {\n        children: props.children\n    }, void 0, false, {\n        fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\lib\\\\no-ssr-wrapper.tsx\",\n        lineNumber: 4,\n        columnNumber: 51\n    }, undefined);\n/**\r\n * Saleor App can be rendered only as a Saleor Dashboard iframe.\r\n * All content is rendered after Dashboard exchanges auth with the app.\r\n * Hence, there is no reason to render app server side.\r\n *\r\n * This component forces app to work in SPA-mode. It simplifies browser-only code and reduces need\r\n * of using dynamic() calls\r\n *\r\n * You can use this wrapper selectively for some pages or remove it completely.\r\n * It doesn't affect Saleor communication, but may cause problems with some client-only code.\r\n */ const NoSSRWrapper = next_dynamic__WEBPACK_IMPORTED_MODULE_1___default()(()=>Promise.resolve(Wrapper), {\n    ssr: false\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL25vLXNzci13cmFwcGVyLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFtQztBQUNjO0FBRWpELE1BQU1FLFVBQVUsQ0FBQ0Msc0JBQWlDLDhEQUFDRix1REFBYztrQkFBRUUsTUFBTUUsUUFBUTs7Ozs7O0FBRWpGOzs7Ozs7Ozs7O0NBVUMsR0FDTSxNQUFNQyxlQUFlTixtREFBT0EsQ0FBQyxJQUFNTyxRQUFRQyxPQUFPLENBQUNOLFVBQVU7SUFDbEVPLEtBQUs7QUFDUCxHQUFHIiwic291cmNlcyI6WyJDOlxccHl0aG9ucHJvamVjdHNcXEUtQ29tbWVyY2VcXEFwcHNcXHNhbGVvci1hcHAtdGVtcGxhdGVcXHNyY1xcbGliXFxuby1zc3Itd3JhcHBlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGR5bmFtaWMgZnJvbSBcIm5leHQvZHluYW1pY1wiO1xyXG5pbXBvcnQgUmVhY3QsIHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IFdyYXBwZXIgPSAocHJvcHM6IFByb3BzV2l0aENoaWxkcmVuPHt9PikgPT4gPFJlYWN0LkZyYWdtZW50Pntwcm9wcy5jaGlsZHJlbn08L1JlYWN0LkZyYWdtZW50PjtcclxuXHJcbi8qKlxyXG4gKiBTYWxlb3IgQXBwIGNhbiBiZSByZW5kZXJlZCBvbmx5IGFzIGEgU2FsZW9yIERhc2hib2FyZCBpZnJhbWUuXHJcbiAqIEFsbCBjb250ZW50IGlzIHJlbmRlcmVkIGFmdGVyIERhc2hib2FyZCBleGNoYW5nZXMgYXV0aCB3aXRoIHRoZSBhcHAuXHJcbiAqIEhlbmNlLCB0aGVyZSBpcyBubyByZWFzb24gdG8gcmVuZGVyIGFwcCBzZXJ2ZXIgc2lkZS5cclxuICpcclxuICogVGhpcyBjb21wb25lbnQgZm9yY2VzIGFwcCB0byB3b3JrIGluIFNQQS1tb2RlLiBJdCBzaW1wbGlmaWVzIGJyb3dzZXItb25seSBjb2RlIGFuZCByZWR1Y2VzIG5lZWRcclxuICogb2YgdXNpbmcgZHluYW1pYygpIGNhbGxzXHJcbiAqXHJcbiAqIFlvdSBjYW4gdXNlIHRoaXMgd3JhcHBlciBzZWxlY3RpdmVseSBmb3Igc29tZSBwYWdlcyBvciByZW1vdmUgaXQgY29tcGxldGVseS5cclxuICogSXQgZG9lc24ndCBhZmZlY3QgU2FsZW9yIGNvbW11bmljYXRpb24sIGJ1dCBtYXkgY2F1c2UgcHJvYmxlbXMgd2l0aCBzb21lIGNsaWVudC1vbmx5IGNvZGUuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgTm9TU1JXcmFwcGVyID0gZHluYW1pYygoKSA9PiBQcm9taXNlLnJlc29sdmUoV3JhcHBlciksIHtcclxuICBzc3I6IGZhbHNlLFxyXG59KTtcclxuIl0sIm5hbWVzIjpbImR5bmFtaWMiLCJSZWFjdCIsIldyYXBwZXIiLCJwcm9wcyIsIkZyYWdtZW50IiwiY2hpbGRyZW4iLCJOb1NTUldyYXBwZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNzciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/lib/no-ssr-wrapper.tsx\n");

/***/ }),

/***/ "./src/lib/theme-synchronizer.tsx":
/*!****************************************!*\
  !*** ./src/lib/theme-synchronizer.tsx ***!
  \****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeSynchronizer: () => (/* binding */ ThemeSynchronizer)\n/* harmony export */ });\n/* harmony import */ var _saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @saleor/app-sdk/app-bridge */ \"@saleor/app-sdk/app-bridge\");\n/* harmony import */ var _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @saleor/macaw-ui */ \"@saleor/macaw-ui\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_0__, _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_1__]);\n([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_0__, _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nfunction ThemeSynchronizer() {\n    const { appBridgeState } = (0,_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_0__.useAppBridge)();\n    const { setTheme } = (0,_saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_1__.useTheme)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"ThemeSynchronizer.useEffect\": ()=>{\n            if (!setTheme || !appBridgeState?.theme) {\n                return;\n            }\n            if (appBridgeState.theme === \"light\") {\n                setTheme(\"defaultLight\");\n            }\n            if (appBridgeState.theme === \"dark\") {\n                setTheme(\"defaultDark\");\n            }\n        }\n    }[\"ThemeSynchronizer.useEffect\"], [\n        appBridgeState?.theme,\n        setTheme\n    ]);\n    return null;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL3RoZW1lLXN5bmNocm9uaXplci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBMEQ7QUFDZDtBQUNWO0FBRTNCLFNBQVNHO0lBQ2QsTUFBTSxFQUFFQyxjQUFjLEVBQUUsR0FBR0osd0VBQVlBO0lBQ3ZDLE1BQU0sRUFBRUssUUFBUSxFQUFFLEdBQUdKLDBEQUFRQTtJQUU3QkMsZ0RBQVNBO3VDQUFDO1lBQ1IsSUFBSSxDQUFDRyxZQUFZLENBQUNELGdCQUFnQkUsT0FBTztnQkFDdkM7WUFDRjtZQUVBLElBQUlGLGVBQWVFLEtBQUssS0FBSyxTQUFTO2dCQUNwQ0QsU0FBUztZQUNYO1lBRUEsSUFBSUQsZUFBZUUsS0FBSyxLQUFLLFFBQVE7Z0JBQ25DRCxTQUFTO1lBQ1g7UUFDRjtzQ0FBRztRQUFDRCxnQkFBZ0JFO1FBQU9EO0tBQVM7SUFFcEMsT0FBTztBQUNUIiwic291cmNlcyI6WyJDOlxccHl0aG9ucHJvamVjdHNcXEUtQ29tbWVyY2VcXEFwcHNcXHNhbGVvci1hcHAtdGVtcGxhdGVcXHNyY1xcbGliXFx0aGVtZS1zeW5jaHJvbml6ZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUFwcEJyaWRnZSB9IGZyb20gXCJAc2FsZW9yL2FwcC1zZGsvYXBwLWJyaWRnZVwiO1xyXG5pbXBvcnQgeyB1c2VUaGVtZSB9IGZyb20gXCJAc2FsZW9yL21hY2F3LXVpXCI7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lU3luY2hyb25pemVyKCkge1xyXG4gIGNvbnN0IHsgYXBwQnJpZGdlU3RhdGUgfSA9IHVzZUFwcEJyaWRnZSgpO1xyXG4gIGNvbnN0IHsgc2V0VGhlbWUgfSA9IHVzZVRoZW1lKCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIXNldFRoZW1lIHx8ICFhcHBCcmlkZ2VTdGF0ZT8udGhlbWUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcHBCcmlkZ2VTdGF0ZS50aGVtZSA9PT0gXCJsaWdodFwiKSB7XHJcbiAgICAgIHNldFRoZW1lKFwiZGVmYXVsdExpZ2h0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcHBCcmlkZ2VTdGF0ZS50aGVtZSA9PT0gXCJkYXJrXCIpIHtcclxuICAgICAgc2V0VGhlbWUoXCJkZWZhdWx0RGFya1wiKTtcclxuICAgIH1cclxuICB9LCBbYXBwQnJpZGdlU3RhdGU/LnRoZW1lLCBzZXRUaGVtZV0pO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG4iXSwibmFtZXMiOlsidXNlQXBwQnJpZGdlIiwidXNlVGhlbWUiLCJ1c2VFZmZlY3QiLCJUaGVtZVN5bmNocm9uaXplciIsImFwcEJyaWRnZVN0YXRlIiwic2V0VGhlbWUiLCJ0aGVtZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/lib/theme-synchronizer.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _saleor_macaw_ui_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @saleor/macaw-ui/style */ \"./node_modules/.pnpm/@saleor+macaw-ui@1.3.1_@typ_40e9553d12c4bb7fdc973d5f4887585d/node_modules/@saleor/macaw-ui/dist/style.css\");\n/* harmony import */ var _saleor_macaw_ui_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_saleor_macaw_ui_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @saleor/app-sdk/app-bridge */ \"@saleor/app-sdk/app-bridge\");\n/* harmony import */ var _saleor_app_sdk_app_bridge_next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @saleor/app-sdk/app-bridge/next */ \"@saleor/app-sdk/app-bridge/next\");\n/* harmony import */ var _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @saleor/macaw-ui */ \"@saleor/macaw-ui\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _lib_no_ssr_wrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/lib/no-ssr-wrapper */ \"./src/lib/no-ssr-wrapper.tsx\");\n/* harmony import */ var _lib_theme_synchronizer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/lib/theme-synchronizer */ \"./src/lib/theme-synchronizer.tsx\");\n/* harmony import */ var _providers_GraphQLProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/providers/GraphQLProvider */ \"./src/providers/GraphQLProvider.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_3__, _saleor_app_sdk_app_bridge_next__WEBPACK_IMPORTED_MODULE_4__, _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_5__, _lib_theme_synchronizer__WEBPACK_IMPORTED_MODULE_8__, _providers_GraphQLProvider__WEBPACK_IMPORTED_MODULE_9__]);\n([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_3__, _saleor_app_sdk_app_bridge_next__WEBPACK_IMPORTED_MODULE_4__, _saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_5__, _lib_theme_synchronizer__WEBPACK_IMPORTED_MODULE_8__, _providers_GraphQLProvider__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n\n/**\r\n * Ensure instance is a singleton.\r\n * TODO: This is React 18 issue, consider hiding this workaround inside app-sdk\r\n */ const appBridgeInstance =  false ? 0 : undefined;\nfunction NextApp({ Component, pageProps }) {\n    /**\r\n   * Configure JSS (used by MacawUI) for SSR. If Macaw is not used, can be removed.\r\n   */ (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)({\n        \"NextApp.useEffect\": ()=>{\n            const jssStyles = document.querySelector(\"#jss-server-side\");\n            if (jssStyles) {\n                jssStyles?.parentElement?.removeChild(jssStyles);\n            }\n        }\n    }[\"NextApp.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_no_ssr_wrapper__WEBPACK_IMPORTED_MODULE_7__.NoSSRWrapper, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_3__.AppBridgeProvider, {\n            appBridgeInstance: appBridgeInstance,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_providers_GraphQLProvider__WEBPACK_IMPORTED_MODULE_9__.GraphQLProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_saleor_macaw_ui__WEBPACK_IMPORTED_MODULE_5__.ThemeProvider, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_theme_synchronizer__WEBPACK_IMPORTED_MODULE_8__.ThemeSynchronizer, {}, void 0, false, {\n                            fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n                            lineNumber: 36,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_saleor_app_sdk_app_bridge_next__WEBPACK_IMPORTED_MODULE_4__.RoutePropagator, {}, void 0, false, {\n                            fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n                            lineNumber: 37,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                            ...pageProps\n                        }, void 0, false, {\n                            fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n                            lineNumber: 38,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n                    lineNumber: 35,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n                lineNumber: 34,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 33,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NextApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFnQztBQUNEO0FBRTJDO0FBQ1I7QUFDakI7QUFFZjtBQUVrQjtBQUNTO0FBQ0M7QUFFOUQ7OztDQUdDLEdBQ0QsTUFBTVEsb0JBQW9CLE1BQTZCLEdBQUcsQ0FBZVIsR0FBR1M7QUFFNUUsU0FBU0MsUUFBUSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUNqRDs7R0FFQyxHQUNEUixnREFBU0E7NkJBQUM7WUFDUixNQUFNUyxZQUFZQyxTQUFTQyxhQUFhLENBQUM7WUFDekMsSUFBSUYsV0FBVztnQkFDYkEsV0FBV0csZUFBZUMsWUFBWUo7WUFDeEM7UUFDRjs0QkFBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUNSLDZEQUFZQTtrQkFDWCw0RUFBQ0oseUVBQWlCQTtZQUFDTyxtQkFBbUJBO3NCQUNwQyw0RUFBQ0QsdUVBQWVBOzBCQUNkLDRFQUFDSiwyREFBYUE7O3NDQUNaLDhEQUFDRyxzRUFBaUJBOzs7OztzQ0FDbEIsOERBQUNKLDRFQUFlQTs7Ozs7c0NBQ2hCLDhEQUFDUzs0QkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNcEM7QUFFQSxpRUFBZUYsT0FBT0EsRUFBQyIsInNvdXJjZXMiOlsiQzpcXHB5dGhvbnByb2plY3RzXFxFLUNvbW1lcmNlXFxBcHBzXFxzYWxlb3ItYXBwLXRlbXBsYXRlXFxzcmNcXHBhZ2VzXFxfYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJAc2FsZW9yL21hY2F3LXVpL3N0eWxlXCI7XHJcbmltcG9ydCBcIi4uL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xyXG5cclxuaW1wb3J0IHsgQXBwQnJpZGdlLCBBcHBCcmlkZ2VQcm92aWRlciB9IGZyb20gXCJAc2FsZW9yL2FwcC1zZGsvYXBwLWJyaWRnZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3BhZ2F0b3IgfSBmcm9tIFwiQHNhbGVvci9hcHAtc2RrL2FwcC1icmlkZ2UvbmV4dFwiO1xyXG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSBcIkBzYWxlb3IvbWFjYXctdWlcIjtcclxuaW1wb3J0IHsgQXBwUHJvcHMgfSBmcm9tIFwibmV4dC9hcHBcIjtcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5pbXBvcnQgeyBOb1NTUldyYXBwZXIgfSBmcm9tIFwiQC9saWIvbm8tc3NyLXdyYXBwZXJcIjtcclxuaW1wb3J0IHsgVGhlbWVTeW5jaHJvbml6ZXIgfSBmcm9tIFwiQC9saWIvdGhlbWUtc3luY2hyb25pemVyXCI7XHJcbmltcG9ydCB7IEdyYXBoUUxQcm92aWRlciB9IGZyb20gXCJAL3Byb3ZpZGVycy9HcmFwaFFMUHJvdmlkZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBFbnN1cmUgaW5zdGFuY2UgaXMgYSBzaW5nbGV0b24uXHJcbiAqIFRPRE86IFRoaXMgaXMgUmVhY3QgMTggaXNzdWUsIGNvbnNpZGVyIGhpZGluZyB0aGlzIHdvcmthcm91bmQgaW5zaWRlIGFwcC1zZGtcclxuICovXHJcbmNvbnN0IGFwcEJyaWRnZUluc3RhbmNlID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IG5ldyBBcHBCcmlkZ2UoKSA6IHVuZGVmaW5lZDtcclxuXHJcbmZ1bmN0aW9uIE5leHRBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIC8qKlxyXG4gICAqIENvbmZpZ3VyZSBKU1MgKHVzZWQgYnkgTWFjYXdVSSkgZm9yIFNTUi4gSWYgTWFjYXcgaXMgbm90IHVzZWQsIGNhbiBiZSByZW1vdmVkLlxyXG4gICAqL1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBqc3NTdHlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pzcy1zZXJ2ZXItc2lkZVwiKTtcclxuICAgIGlmIChqc3NTdHlsZXMpIHtcclxuICAgICAganNzU3R5bGVzPy5wYXJlbnRFbGVtZW50Py5yZW1vdmVDaGlsZChqc3NTdHlsZXMpO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxOb1NTUldyYXBwZXI+XHJcbiAgICAgIDxBcHBCcmlkZ2VQcm92aWRlciBhcHBCcmlkZ2VJbnN0YW5jZT17YXBwQnJpZGdlSW5zdGFuY2V9PlxyXG4gICAgICAgIDxHcmFwaFFMUHJvdmlkZXI+XHJcbiAgICAgICAgICA8VGhlbWVQcm92aWRlcj5cclxuICAgICAgICAgICAgPFRoZW1lU3luY2hyb25pemVyIC8+XHJcbiAgICAgICAgICAgIDxSb3V0ZVByb3BhZ2F0b3IgLz5cclxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICAgICAgPC9UaGVtZVByb3ZpZGVyPlxyXG4gICAgICAgIDwvR3JhcGhRTFByb3ZpZGVyPlxyXG4gICAgICA8L0FwcEJyaWRnZVByb3ZpZGVyPlxyXG4gICAgPC9Ob1NTUldyYXBwZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmV4dEFwcDtcclxuIl0sIm5hbWVzIjpbIkFwcEJyaWRnZSIsIkFwcEJyaWRnZVByb3ZpZGVyIiwiUm91dGVQcm9wYWdhdG9yIiwiVGhlbWVQcm92aWRlciIsInVzZUVmZmVjdCIsIk5vU1NSV3JhcHBlciIsIlRoZW1lU3luY2hyb25pemVyIiwiR3JhcGhRTFByb3ZpZGVyIiwiYXBwQnJpZGdlSW5zdGFuY2UiLCJ1bmRlZmluZWQiLCJOZXh0QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwianNzU3R5bGVzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/providers/GraphQLProvider.tsx":
/*!*******************************************!*\
  !*** ./src/providers/GraphQLProvider.tsx ***!
  \*******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GraphQLProvider: () => (/* binding */ GraphQLProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @saleor/app-sdk/app-bridge */ \"@saleor/app-sdk/app-bridge\");\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! urql */ \"urql\");\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(urql__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_create_graphq_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/create-graphq-client */ \"./src/lib/create-graphq-client.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_1__, _lib_create_graphq_client__WEBPACK_IMPORTED_MODULE_3__]);\n([_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_1__, _lib_create_graphq_client__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\nfunction GraphQLProvider(props) {\n    const { appBridgeState } = (0,_saleor_app_sdk_app_bridge__WEBPACK_IMPORTED_MODULE_1__.useAppBridge)();\n    const url = appBridgeState?.saleorApiUrl;\n    if (!url) {\n        console.warn(\"Install the app in the Dashboard to be able to query Saleor API.\");\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            children: props.children\n        }, void 0, false, {\n            fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\providers\\\\GraphQLProvider.tsx\",\n            lineNumber: 13,\n            columnNumber: 12\n        }, this);\n    }\n    const client = (0,_lib_create_graphq_client__WEBPACK_IMPORTED_MODULE_3__.createClient)(url, async ()=>Promise.resolve({\n            token: appBridgeState?.token\n        }));\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(urql__WEBPACK_IMPORTED_MODULE_2__.Provider, {\n        value: client,\n        ...props\n    }, void 0, false, {\n        fileName: \"C:\\\\pythonprojects\\\\E-Commerce\\\\Apps\\\\saleor-app-template\\\\src\\\\providers\\\\GraphQLProvider.tsx\",\n        lineNumber: 18,\n        columnNumber: 10\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJvdmlkZXJzL0dyYXBoUUxQcm92aWRlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBMEQ7QUFFMUI7QUFFMEI7QUFFbkQsU0FBU0csZ0JBQWdCQyxLQUE0QjtJQUMxRCxNQUFNLEVBQUVDLGNBQWMsRUFBRSxHQUFHTCx3RUFBWUE7SUFDdkMsTUFBTU0sTUFBTUQsZ0JBQWdCRTtJQUU1QixJQUFJLENBQUNELEtBQUs7UUFDUkUsUUFBUUMsSUFBSSxDQUFDO1FBQ2IscUJBQU8sOERBQUNDO3NCQUFLTixNQUFNTyxRQUFROzs7Ozs7SUFDN0I7SUFFQSxNQUFNQyxTQUFTVix1RUFBWUEsQ0FBQ0ksS0FBSyxVQUFZTyxRQUFRQyxPQUFPLENBQUM7WUFBRUMsT0FBT1YsZ0JBQWdCVTtRQUFPO0lBRTdGLHFCQUFPLDhEQUFDZCwwQ0FBUUE7UUFBQ2UsT0FBT0o7UUFBUyxHQUFHUixLQUFLOzs7Ozs7QUFDM0MiLCJzb3VyY2VzIjpbIkM6XFxweXRob25wcm9qZWN0c1xcRS1Db21tZXJjZVxcQXBwc1xcc2FsZW9yLWFwcC10ZW1wbGF0ZVxcc3JjXFxwcm92aWRlcnNcXEdyYXBoUUxQcm92aWRlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQXBwQnJpZGdlIH0gZnJvbSBcIkBzYWxlb3IvYXBwLXNkay9hcHAtYnJpZGdlXCI7XHJcbmltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInVycWxcIjtcclxuXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9jcmVhdGUtZ3JhcGhxLWNsaWVudFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEdyYXBoUUxQcm92aWRlcihwcm9wczogUHJvcHNXaXRoQ2hpbGRyZW48e30+KSB7XHJcbiAgY29uc3QgeyBhcHBCcmlkZ2VTdGF0ZSB9ID0gdXNlQXBwQnJpZGdlKCk7XHJcbiAgY29uc3QgdXJsID0gYXBwQnJpZGdlU3RhdGU/LnNhbGVvckFwaVVybCE7XHJcblxyXG4gIGlmICghdXJsKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJJbnN0YWxsIHRoZSBhcHAgaW4gdGhlIERhc2hib2FyZCB0byBiZSBhYmxlIHRvIHF1ZXJ5IFNhbGVvciBBUEkuXCIpO1xyXG4gICAgcmV0dXJuIDxkaXY+e3Byb3BzLmNoaWxkcmVufTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsaWVudCA9IGNyZWF0ZUNsaWVudCh1cmwsIGFzeW5jICgpID0+IFByb21pc2UucmVzb2x2ZSh7IHRva2VuOiBhcHBCcmlkZ2VTdGF0ZT8udG9rZW4hIH0pKTtcclxuXHJcbiAgcmV0dXJuIDxQcm92aWRlciB2YWx1ZT17Y2xpZW50fSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VBcHBCcmlkZ2UiLCJQcm92aWRlciIsImNyZWF0ZUNsaWVudCIsIkdyYXBoUUxQcm92aWRlciIsInByb3BzIiwiYXBwQnJpZGdlU3RhdGUiLCJ1cmwiLCJzYWxlb3JBcGlVcmwiLCJjb25zb2xlIiwid2FybiIsImRpdiIsImNoaWxkcmVuIiwiY2xpZW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0b2tlbiIsInZhbHVlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/providers/GraphQLProvider.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "urql":
/*!***********************!*\
  !*** external "urql" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("urql");

/***/ }),

/***/ "@saleor/app-sdk/app-bridge":
/*!*********************************************!*\
  !*** external "@saleor/app-sdk/app-bridge" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@saleor/app-sdk/app-bridge");;

/***/ }),

/***/ "@saleor/app-sdk/app-bridge/next":
/*!**************************************************!*\
  !*** external "@saleor/app-sdk/app-bridge/next" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@saleor/app-sdk/app-bridge/next");;

/***/ }),

/***/ "@saleor/macaw-ui":
/*!***********************************!*\
  !*** external "@saleor/macaw-ui" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("@saleor/macaw-ui");;

/***/ }),

/***/ "@urql/exchange-auth":
/*!**************************************!*\
  !*** external "@urql/exchange-auth" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@urql/exchange-auth");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.1.7_@babel+core@7.2_e69d135ea28a4d90edc8afcecc79943c","vendor-chunks/@swc+helpers@0.5.15","vendor-chunks/@saleor+macaw-ui@1.3.1_@typ_40e9553d12c4bb7fdc973d5f4887585d"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();