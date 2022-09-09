import * as React from "react";
import { Route } from "react-router-dom";
import { DTDynamicPage } from "@dashtrack/web-utility";

export default [
  <Route exact key="dynamic-page" path="/*" component={DTDynamicPage} />,
];
