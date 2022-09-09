import * as React from "react";
import { Switch } from "react-router-dom";

import routes from "./routes";

export default function App() {
  return <Switch>{routes}</Switch>;
}
