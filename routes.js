const routes = require("next-routes")();

routes
  .add("/cases/newcase", "/cases/newcase")
  .add("/cases/:address", "/cases/details")
  .add("/cases/:address/spendrequests", "/cases/spendrequests/index")
  .add("/cases/:address/spendrequests/newrequest", "/cases/spendrequests/newrequest");

module.exports = routes;
