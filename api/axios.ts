import axios from "axios";
import path from "path";

import {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

interface ResponseContext {
  data?: any;
  requestId?: string;
}

export class ServiceError extends Error implements AxiosError {
  code?: string;
  config: AxiosRequestConfig;
  host: string;
  request?: any;
  response?: AxiosResponse;
  stack?: string;

  // https://github.com/axios/axios/blob/v0.21.1/lib/core/enhanceError.js#L21-L40
  isAxiosError = true;
  toJSON = () => ({
    message: this.message,
    name: this.name,
    stack: this.stack,
    config: this.config,
    code: this.code,
  });

  constructor(
    message: string,
    host: string,
    config: AxiosRequestConfig,
    stack?: string,
    code?: string,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message);

    // Make a distinction between errors from different APIs
    this.name = `ServiceError ${host}`;

    this.code = code;
    this.config = config;
    this.host = host;
    this.request = request;
    this.response = response;
    this.stack = stack;
  }
}

function responseInterceptor<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  return response;
}

function formatResponseContext(
  response: AxiosResponse<any> | undefined
): ResponseContext {
  if (response === undefined) {
    return {};
  } else {
    return {
      data: response.data,
      requestId: response.headers["x-request-id"],
    };
  }
}

function fullURL(config: AxiosRequestConfig): URL | undefined {
  if (config.baseURL && config.url) {
    const raw = path.posix
      .join(config.baseURL, config.url)
      .replace(":/", "://");
    return new URL(raw);
  } else if (config.url) {
    return new URL(config.url);
  } else {
    return undefined;
  }
}

function errorInterceptor(error: AxiosError): AxiosPromise<AxiosError> {
  const response = formatResponseContext(error.response);
  const url = fullURL(error.config);

  console.log("Error response in errorInterceptor", response);

  if (url) {
    const { host } = url;

    throw new ServiceError(
      error.message,
      host,
      error.config,
      error.stack,
      error.code,
      error.request,
      error.response
    );
  } else {
    throw error;
  }
}

function createInstance(configuration: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(configuration);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return instance;
}

export default createInstance;
