import { API_KEY } from "./../utils/organizationConstants";
import passport from "passport";
import { Request, RequestHandler, Response } from "express";
import { Strategy } from "passport-strategy";

import dashTrackApi from "./dashTrackApi";
import { IRegisterFormParams } from "@dashtrack/types";

class DashTrackCookieStrategy extends Strategy {
  authenticate(req: Request) {
    const cookie = req.headers.cookie;
    if (!cookie || !cookie.includes("_dashtrack_session")) {
      this.fail(401);
      return;
    }

    console.log("In the check login call");

    dashTrackApi
      .get(`web_ordering/organizations/${API_KEY}/customer_sessions/_`, {
        headers: { cookie },
      })
      .then(async ({ data }) => {
        console.log("Res for logged in call", data.customer);

        if (data.customer) {
          this.success({
            customer: data.customer,
          });
        } else {
          console.log("DashTrackCookieStrategy Fail ---------");

          this.fail(401);
        }
      })
      .catch((error) => {
        console.log("DashTrackCookieStrategy Error ---------", error);
        this.error(error);
      });
  }
}

export const dashTrackCookieStrategy = new DashTrackCookieStrategy();

export const signInHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send();
  } else {
    try {
      const { cookie, customer } = await signIn(email, password);

      console.log("customer for signInHandler", customer);

      setAuthCookie(res, cookie);
      res.send({
        success: true,
        message: "successfuly signed in customer",
        customer,
      });
    } catch (err) {
      res.status(401).send();
    }
  }
};

export const requireAuth = passport.authenticate("dashtrack-cookie", {
  session: false,
});

export const signIn = (email: string, password: string) =>
  dashTrackApi
    .post(`web_ordering/organizations/${API_KEY}/customer_sessions`, {
      customer: {
        email,
        password,
      },
    })
    .then(({ data, headers, status }: any) => {
      console.log("signIn res", data);
      console.log("PW sent with customer auth", password);

      const setCookie = (headers["set-cookie"] || "").toString();

      if (setCookie.includes("_dashtrack_session=")) {
        console.log("setCookie in conditional", setCookie);
        const cookie: string = setCookie.match(/_dashtrack_session=([^;]+)/)[1];
        return Promise.resolve({
          cookie,
          customer: data.customer,
        });
      } else {
        return Promise.reject();
      }
    })
    .catch((error) => {
      console.log("signIn error", error);

      return Promise.reject();
    });

export const setAuthCookie = (res: Response, cookie: string) => {
  res.cookie("_dashtrack_session", cookie, {
    encode: String,
    httpOnly: true,
    sameSite: "lax",
    // secure: true,
  });
};

export const register = (request: IRegisterFormParams) =>
  dashTrackApi
    .post(`web_ordering/organizations/${API_KEY}/customers`, request)
    .then(() => signIn(request.customer.email, request.customer.password))
    .catch((error) => console.log("Error in registration", error));

export const getCustomer = (
  req: Express.Request
): {
  customer: any;
} => {
  console.log("getCustomer", req);

  if (req.user) {
    return { customer: req.user };
  } else {
    throw new Error("Unauthorized");
  }
};
