import { App } from "./App.js";

$.getJSON("/db/db.json", (data) => {
  let app = new App(data);
  app.start();
});
