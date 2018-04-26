webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/ReconnectingWebSocket.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// MIT License:
//
// Copyright (c) 2010-2012, Joe Walnes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * This behaves like a WebSocket in every way, except if it fails to connect,
 * or it gets disconnected, it will repeatedly poll until it succesfully connects
 * again.
 *
 * It is API compatible, so when you have:
 *   ws = new WebSocket('ws://....');
 * you can replace with:
 *   ws = new ReconnectingWebSocket('ws://....');
 *
 * The event stream will typically look like:
 *  onconnecting
 *  onopen
 *  onmessage
 *  onmessage
 *  onclose // lost connection
 *  onconnecting
 *  onopen  // sometime later...
 *  onmessage
 *  onmessage
 *  etc...
 *
 * It is API compatible with the standard WebSocket API.
 *
 * Latest version: https://github.com/joewalnes/reconnecting-websocket/
 * - Joe Walnes
 *
 * Latest TypeScript version: https://github.com/daviddoran/typescript-reconnecting-websocket/
 * - David Doran
 */
class ReconnectingWebSocket {
    constructor(url, protocols = []) {
        // These can be altered by calling code
        this.debug = false;
        // Time to wait before attempting reconnect (after close)
        this.reconnectInterval = 1000;
        // Time to wait for WebSocket to open (before aborting and retrying)
        this.timeoutInterval = 2000;
        // Whether WebSocket was forced to close by this client
        this.forcedClose = false;
        // Whether WebSocket opening timed out
        this.timedOut = false;
        // List of WebSocket sub-protocols
        this.protocols = [];
        // Set up the default 'noop' event handlers
        this.onopen = function (event) { };
        this.onclose = function (event) { };
        this.onconnecting = function () { };
        this.onmessage = function (event) { };
        this.onerror = function (event) { };
        this.url = url;
        this.protocols = protocols;
        this.readyState = WebSocket.CONNECTING;
        this.connect(false);
    }
    connect(reconnectAttempt) {
        this.ws = new WebSocket(this.url, this.protocols);
        this.onconnecting();
        this.log('ReconnectingWebSocket', 'attempt-connect', this.url);
        const localWs = this.ws;
        const timeout = setTimeout(() => {
            this.log('ReconnectingWebSocket', 'connection-timeout', this.url);
            this.timedOut = true;
            localWs.close();
            this.timedOut = false;
        }, this.timeoutInterval);
        this.ws.onopen = (event) => {
            clearTimeout(timeout);
            this.log('ReconnectingWebSocket', 'onopen', this.url);
            this.readyState = WebSocket.OPEN;
            reconnectAttempt = false;
            this.onopen(event);
        };
        this.ws.onclose = (event) => {
            clearTimeout(timeout);
            this.ws = null;
            if (this.forcedClose) {
                this.readyState = WebSocket.CLOSED;
                this.onclose(event);
            }
            else {
                this.readyState = WebSocket.CONNECTING;
                this.onconnecting();
                if (!reconnectAttempt && !this.timedOut) {
                    this.log('ReconnectingWebSocket', 'onclose', this.url);
                    this.onclose(event);
                }
                setTimeout(() => {
                    this.connect(true);
                }, this.reconnectInterval);
            }
        };
        this.ws.onmessage = (event) => {
            this.log('ReconnectingWebSocket', 'onmessage', this.url, event.data);
            this.onmessage(event);
        };
        this.ws.onerror = (event) => {
            this.log('ReconnectingWebSocket', 'onerror', this.url, event);
            this.onerror(event);
        };
    }
    send(data) {
        if (this.ws) {
            this.log('ReconnectingWebSocket', 'send', this.url, data);
            return this.ws.send(data);
        }
        else {
            throw new Error('INVALID_STATE_ERR : Pausing to reconnect websocket');
        }
    }
    /**
     * Returns boolean, whether websocket was FORCEFULLY closed.
     */
    close() {
        if (this.ws) {
            this.forcedClose = true;
            this.ws.close();
            return true;
        }
        return false;
    }
    /**
     * Additional public API method to refresh the connection if still open (close, re-open).
     * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
     *
     * Returns boolean, whether websocket was closed.
     */
    refresh() {
        if (this.ws) {
            this.ws.close();
            return true;
        }
        return false;
    }
    log(...args) {
        if (this.debug || ReconnectingWebSocket.debugAll) {
            console.debug.apply(console, args);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ReconnectingWebSocket;

/**
 * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
 */
ReconnectingWebSocket.debugAll = false;


/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div style=\"text-align:center\">\n  <h1>\n    Welcome to {{ title }}!\n  </h1>\n</div>\n\n<h2>YOU MAY HAVE WON SOMETHING.  SELECT BELOW</h2>\n\n<table>\n  <thead>\n    <tr>\n      <th>Python</th>\n      <th>PHP</th>\n      <th>Ruby</th>\n      <th>Postgres</th>\n      <th>Kafka</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>{{ pythonButtonOptions.total }}</td>\n      <td>{{ rubyButtonOptions.total }}</td>\n      <td>{{ phpButtonOptions.total }}</td>\n      <td>{{ postgresButtonOptions.total }}</td>\n      <td>{{ kafkaButtonOptions.total }}</td>\n    </tr>\n    <tr *ngIf=\"!successful_request\">\n      <td><app-sticker-button (SuccessfulRequest)=\"requestMade()\" [Button]=\"pythonButtonOptions\"></app-sticker-button></td>\n      <td><app-sticker-button (SuccessfulRequest)=\"requestMade()\" [Button]=\"rubyButtonOptions\"></app-sticker-button></td>\n      <td><app-sticker-button (SuccessfulRequest)=\"requestMade()\" [Button]=\"phpButtonOptions\"></app-sticker-button></td>\n      <td><app-sticker-button (SuccessfulRequest)=\"requestMade()\" [Button]=\"postgresButtonOptions\"></app-sticker-button></td>\n      <td><app-sticker-button (SuccessfulRequest)=\"requestMade()\" [Button]=\"kafkaButtonOptions\"></app-sticker-button></td>\n    </tr>\n    <tr *ngIf=\"successful_request\">\n      <td colspan=\"5\">Thanks! Your order has been processed</td>\n    </tr>\n  </tbody>\n</table>\n\n\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dataservice_service__ = __webpack_require__("./src/app/dataservice.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AppComponent = class AppComponent {
    constructor(dataService) {
        this.dataService = dataService;
        this.successful_request = false;
        this.title = 'SwagGrab';
        this.s_shirts = 1;
        this.m_shirts = 1;
        this.l_shirts = 1;
        this.xl_shirts = 1;
        this.pythonButtonOptions = { button_id: 'python', total: 0 };
        this.rubyButtonOptions = { button_id: 'ruby', total: 0 };
        this.phpButtonOptions = { button_id: 'php', total: 0 };
        this.postgresButtonOptions = { button_id: 'postgres', total: 0 };
        this.kafkaButtonOptions = { button_id: 'kafka', total: 0 };
    }
    ngOnInit() {
        const that = this;
        this.dataService.init().then(res => {
            console.log(res);
            for (const k of Object.keys(res)) {
                that[k + 'ButtonOptions'] = { 'button_id': k, 'total': res[k] > 0 ? res[k] : 0 };
            }
        });
        const x = this.dataService.listen();
        this.sub = x.subscribe(subscription => {
            const button_id = JSON.parse(subscription.data).button_id;
            const total = JSON.parse(subscription.data).total;
            that[button_id + 'ButtonOptions'] = { 'button_id': button_id, 'total': total };
        });
    }
    ngOnDestroy() {
    }
    requestMade() {
        this.successful_request = true;
    }
};
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("./src/app/app.component.html"),
        styles: [__webpack_require__("./src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__dataservice_service__["a" /* DataService */]])
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm2015/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sticker_button_sticker_button_component__ = __webpack_require__("./src/app/sticker-button/sticker-button.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dataservice_service__ = __webpack_require__("./src/app/dataservice.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm2015/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["E" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_3__sticker_button_sticker_button_component__["a" /* StickerButtonComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClientModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_4__dataservice_service__["a" /* DataService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/dataservice.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm2015/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm2015/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ReconnectingWebSocket__ = __webpack_require__("./src/app/ReconnectingWebSocket.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let DataService = class DataService {
    constructor(http) {
        this.http = http;
    }
    start() {
        if (this.observing == null) {
            this.observing = this.listen();
        }
        return this.observing;
    }
    init() {
        return this.http.get('http://localhost:5000/init').toPromise();
    }
    request(data) {
        const prom = this.http.post('http://localhost:5000/submit_request', data).toPromise();
        return prom.then((res) => {
            return res;
        });
    }
    listen() {
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["a" /* Observable */]((observer) => {
            this.socket = new __WEBPACK_IMPORTED_MODULE_3__ReconnectingWebSocket__["a" /* ReconnectingWebSocket */]('ws://localhost:5000/receive');
            this.socket.onopen = function (event) {
                // Listen for messages
                this.onmessage = function (socket_event) {
                    observer.next(socket_event);
                    // console.log('Client received a message', socket_event);
                };
                // Listen for socket closes
                this.onclose = function (socket_event) {
                    console.log('Client notified socket has closed', socket_event);
                    observer.complete();
                };
            };
        });
    }
};
DataService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
], DataService);



/***/ }),

/***/ "./src/app/sticker-button/sticker-button.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/sticker-button/sticker-button.component.html":
/***/ (function(module, exports) {

module.exports = "<button (click)=\"onClickStickerButton();\" *ngIf=\"Button.total > 0\">\n Want!\n</button>\n<p *ngIf=\"Button.total <= 0\">\n Sold Out!\n</p>\n"

/***/ }),

/***/ "./src/app/sticker-button/sticker-button.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StickerButtonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dataservice_service__ = __webpack_require__("./src/app/dataservice.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let StickerButtonComponent = class StickerButtonComponent {
    constructor(dataService) {
        this.dataService = dataService;
        this.SuccessfulRequest = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* EventEmitter */]();
    }
    ngOnInit() {
    }
    onClickStickerButton() {
        console.log(this.Button);
        this.dataService.request(this.Button).then((res) => {
            console.log(res);
            if (!res.success) {
                console.log('Failure to subscribe');
            }
            else {
                this.SuccessfulRequest.emit(true);
            }
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Input */])(),
    __metadata("design:type", Object)
], StickerButtonComponent.prototype, "Button", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* Output */])(),
    __metadata("design:type", Object)
], StickerButtonComponent.prototype, "SuccessfulRequest", void 0);
StickerButtonComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'app-sticker-button',
        template: __webpack_require__("./src/app/sticker-button/sticker-button.component.html"),
        styles: [__webpack_require__("./src/app/sticker-button/sticker-button.component.css")]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__dataservice_service__["a" /* DataService */]])
], StickerButtonComponent);



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const environment = {
    production: false
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;



/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm2015/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm2015/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(err => console.log(err));


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map