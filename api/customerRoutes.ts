import { API_KEY } from "./../utils/organizationConstants";
import { Express, RequestHandler } from "express";
import crypto from "crypto";

import {
  signInHandler,
  register,
  requireAuth,
  setAuthCookie,
} from "./customerAuth";
import dashTrackApi from "./dashTrackApi";

export default (app: Express, useBodyParser: RequestHandler) => {
  app.post(
    "/api/customer/registration",
    useBodyParser,
    async (req, res, next) => {
      const { email, name, phone, password } = req.body;

      const passwordToUse = password
        ? password
        : crypto.randomBytes(20).toString("hex");
      const nameToUse = name ? name : "Guest User";
      const phoneToUse = phone ? phone : undefined;

      if (!email) {
        res.status(400).send();
        return;
      }

      try {
        const { cookie, customer }: any = await register({
          customer: {
            email,
            name: nameToUse,
            phone: phoneToUse,
            password: passwordToUse,
            password_confirmation: passwordToUse,
          },
          platform: "web",
        });

        console.log("Customer response for registration", customer);

        setAuthCookie(res, cookie);
        res.send({
          success: true,
          message: "Customer account created",
          customer: customer,
        });
      } catch (err) {
        console.log("Error in /api/customer/registration rout", err);

        if (err && err?.response && err.response?.status == 422) {
          const message =
            err.response.data.message ||
            "Something went wrong, please try again.";
          const errors = err.response.data.errors || [];

          return res.status(422).send({
            message: message,
            errors: errors,
          });
        } else {
          next(err);
        }
      }
    }
  );

  app.post("/api/customer/signin", useBodyParser, signInHandler);

  app.delete(
    "/api/customer/logout",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/logout", req.body);

        const cookie = req.headers.cookie;

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/customer_sessions/_`;

        const result = await dashTrackApi.delete(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/customer/logout result", result);

        res.clearCookie("_dashtrack_session");
        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/customer/paymentMethod/new",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/paymentMethod/new req.body", req.body);

        const { credit_card_number, expiration_date, card_code } =
          req.body.payment_method;

        if (!credit_card_number || !expiration_date || !card_code) {
          res.send({
            success: false,
            message: "All fields are required",
          });
          return;
        }

        const cookie = req.headers.cookie;
        console.log("Cookie for new payment method");

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/payment_methods`;

        const result = await dashTrackApi.post(ENDPOINT, req.body, {
          headers: { cookie },
        });

        console.log("/api/customer/paymentMethod/new result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.patch(
    "/api/customer/paymentMethod/setDefault",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log(
          "/api/customer/paymentMethod/setDefault req.body",
          req.body
        );

        const cookie = req.headers.cookie;

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/payment_methods/${req.body.payment_method_id}`;

        const result = await dashTrackApi.patch(
          ENDPOINT,
          {},
          {
            headers: { cookie },
          }
        );

        console.log("/api/customer/paymentMethod/setDefault result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.patch(
    "/api/customer/paymentMethod/delete",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/paymentMethod/delete req.body", req.body);

        const cookie = req.headers.cookie;

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/payment_methods/${req.body.payment_method_id}`;

        const result = await dashTrackApi.delete(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/customer/paymentMethod/setDefault result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/sale/new",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/sale/new req.body", req.body);

        const { location_id, menu_items, order_type, payment_method_id } =
          req.body.sale;

        if (!location_id || !menu_items || !order_type || !payment_method_id) {
          res.send({
            success: false,
            message: "All fields are required",
          });
          return;
        }

        const cookie = req.headers.cookie;
        console.log("Cookie for new sale");

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/sales`;

        const result = await dashTrackApi.post(ENDPOINT, req.body, {
          headers: { cookie },
        });

        console.log("/api/sale/new result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/customer/sales",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/sales called");

        const cookie = req.headers.cookie;
        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/sales`;

        const result = await dashTrackApi.get(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/customer/sales called result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/customer/sale/:saleId",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/sale called");

        const cookie = req.headers.cookie;
        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/sales/${req.params.saleId}`;

        const result = await dashTrackApi.get(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/customer/sale called result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/sale/:saleId/clone",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/sale/:saleId/clone");

        const cookie = req.headers.cookie;
        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/sales/${req.params.saleId}/clone`;

        const result = await dashTrackApi.get(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/sale/:saleId/clone called result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.patch(
    "/api/customer/:customerId/address/:addressId",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/address update req.body", req.body);

        const { address_one, city, state, postal_code } =
          req.body.customer_address;

        if (!address_one || !city || !state || !postal_code) {
          res.send({
            success: false,
            message: "Fields are missing",
          });
          return;
        }

        const cookie = req.headers.cookie;
        console.log("Cookie for new address");

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const { customerId, addressId } = req.params;

        const ENDPOINT = `web_ordering/customers/${customerId}/customer_addresses/${addressId}`;

        const result = await dashTrackApi.patch(ENDPOINT, req.body, {
          headers: { cookie },
        });

        console.log("/api/customer/address update result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.delete(
    "/api/customer/:customerId/address/:addressId",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/:customerId/address/:addressId", req.params);

        const cookie = req.headers.cookie;

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const { customerId, addressId } = req.params;

        const ENDPOINT = `web_ordering/customers/${customerId}/customer_addresses/${addressId}`;

        const result = await dashTrackApi.delete(ENDPOINT, {
          headers: { cookie },
        });

        console.log(
          "/api/customer/:customerId/address/:addressId result",
          result
        );

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/api/customer/address/new",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer/address/new req.body", req.body);

        const { address_one, city, state, postal_code } =
          req.body.customer_address;

        if (!address_one || !city || !state || !postal_code) {
          res.send({
            success: false,
            message: "Fields are missing",
          });
          return;
        }

        const cookie = req.headers.cookie;
        console.log("Cookie for new address");

        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/customer_addresses`;

        const result = await dashTrackApi.post(ENDPOINT, req.body, {
          headers: { cookie },
        });

        console.log("/api/customer/address/new result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/api/customer",
    useBodyParser,
    requireAuth,
    async function (req, res, next) {
      try {
        console.log("/api/customer called");

        const cookie = req.headers.cookie;
        if (!cookie || !cookie.includes("_dashtrack_session")) {
          this.fail(401);
          return;
        }

        const ENDPOINT = `web_ordering/organizations/${API_KEY}/customer_sessions/_`;

        const result = await dashTrackApi.get(ENDPOINT, {
          headers: { cookie },
        });

        console.log("/api/customer called result", result);

        res.send(result.data);
      } catch (err) {
        next(err);
      }
    }
  );
};
