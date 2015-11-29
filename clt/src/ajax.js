import * as Q from 'q';

export const methods = {
    DELETE: 'DELETE',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT'
};

export const paramsModes = {
    DEFAULT: 0,
    QUERY: 1,
    BODY: 2
}

class Response {
    constructor(status) {
        this.status = status;
    }
}

class JsonResponse extends Response {
    constructor(status, data) {
        super(status);
        this.data = data;
    }
}

export function request(url, _options, params) {
    let options = null;
    if ((typeof _options) === 'string') {
        options = { method: _options };
    } else {
        options = _options;
    }

    let deferred = Q.defer();
    const paramsMode = getParamsMode(options);

    let ajaxRequest = new XMLHttpRequest();
    const requestUrl = (paramsMode === paramsModes.BODY) ? url : withQueryParams(url, params);

    ajaxRequest.open(options.method, requestUrl);
    if (options.requestContentType) {
        ajaxRequest.setRequestHeader('Content-Type', options.requestContentType);
    }

    if (options.requestAccept) {
        ajaxRequest.setRequestHeader('Accept', options.requestAccept);
    }

    if (options.responseType) {
        ajaxRequest.responseType = options.responseType;
    }

    ajaxRequest.addEventListener('error', ev => {
        deferred.reject(new Error('Ajax Error'));
    });

    ajaxRequest.addEventListener('load', () => {
        if (!options.acceptNon2xxStatuses && !is2xxStatus(ajaxRequest.status)) {
            deferred.reject(new Error(`HTTP response status ${ajaxRequest.status} ${ajaxRequest.statusText}`));
            return;
        }

        switch (ajaxRequest.responseType) {
            case 'json':
                deferred.resolve(new JsonResponse(ajaxRequest.status, ajaxRequest.response));
                return;
            default:
                deferred.reject(new Error(`Unsupported response type: "${ajaxRequest.responseType}"`));
                return;
        }
    });

    // todo: request content
    ajaxRequest.send();

    return deferred.promise;
}

export function getJSON(url, params) {
    return request(
        url,
        {
            method: methods.GET,
            requestAccept: 'text/json',
            responseType: 'json'
        },
        params
    );
}

function getParamsMode(options) {
    switch (options.method) {
        case methods.GET:
            switch (options.paramsMode) {
                case undefined:
                case null:
                case paramsModes.DEFAULT:
                case paramsModes.QUERY:
                    return paramsModes.QUERY;
                case paramsModes.BODY:
                    throw new Error('Request parameters in body are not supported in GET requests.');
                default:
                    throw new Error(`Unsupported paramsMode: ${options.paramsMode}`);
            }
        case methods.POST:
            switch (options.paramsMode) {
                case undefined:
                case null:
                case paramsModes.DEFAULT:
                case paramsModes.BODY:
                    return paramsModes.BODY;
                case paramsModes.QUERY:
                    return paramsModes.QUERY;
                default:
                    throw new Error(`Unsupported paramsMode: ${options.paramsMode}`);
            }
        default:
            throw new Error(`Unsupported HTTP request method: ${options.method}`);
    }
}

/**
 * Constructs an URL with the specified query parameters
 * @param url The base URL of the request, with path but without any query parameters.
 * @param params A dictionary of key-value pairs, representing the query parameters.
 */
function withQueryParams(url, params) {
    if (!params || Object.keys(params).length === 0) {
        return url;
    } else {
        return `${url}?${concatParams(params)}`;
    }
}

/**
 * Concatenates parameters for GET / POST requests, e.g.
 * { a: '123', b: 'test' } to 'a=123&b=test'
 * @param params
 */
function concatParams(params) {
    return Object.keys(params).map(p => `${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`).join('&');
}

function is2xxStatus(statusCode) {
    return statusCode >= 200 && statusCode < 300;
}
