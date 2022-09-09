import * as React from "react";
import ReactDOM from "react-dom";
import { DTPlatformProvider, IDTPlatformContext } from "@dashtrack/web-utility";

import "./style/main.scss";

import App from "./components/App";

import mapStyles from "../utils/mapStyles";
import {
  API_KEY,
  CAMPAIGN_STORAGE_NAME,
  CART_STORAGE_NAME,
  LOCAL_STORAGE_PREFIX,
  WEBSITE_ID,
} from "../utils/organizationConstants";

import { SiteLoader } from "./components/helpers/SiteLoader";

function main() {
  const platformConfig: IDTPlatformContext = {
    layoutConfig: {},
    apiKey: API_KEY,
    localStoragePrefix: LOCAL_STORAGE_PREFIX,
    campaignStorageName: CAMPAIGN_STORAGE_NAME,
    cartStorageName: CART_STORAGE_NAME,
    websiteId: WEBSITE_ID,
    mapStyles,
    loaderComponent: <SiteLoader />,
  };

  ReactDOM.render(
    <DTPlatformProvider {...platformConfig}>
      <App />
    </DTPlatformProvider>,
    document.querySelector(".app-wrapper")
  );
}

document.addEventListener("DOMContentLoaded", main);
