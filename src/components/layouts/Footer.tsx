import * as React from "react";
import {
  DataStoreContext,
  DTHours,
  DTIcon,
  DTScreenContext,
  DTSocialIcon,
  DTWebForm,
} from "@dashtrack/web-utility";
import { HIDE_FOOTER_PATHS } from "../../../utils/organizationConstants";

import { Link } from "react-router-dom";
import { capitalizeWord, snakeToPretty } from "@dashtrack/text-utility";

export default function Footer() {
  const { screenType } = React.useContext(DTScreenContext);
  const { siteLogos, socialPlatforms, concept, singleLocation } =
    React.useContext(DataStoreContext);

  const pathArray = window.location.pathname.split("/");
  const currentPath = pathArray[1];

  if (HIDE_FOOTER_PATHS.includes(currentPath)) {
    return null;
  }

  const hoursEl = (
    <div className="footer-container__content__locations">
      <div className="footer-container__content__location">
        <div className="name">Hours</div>

        <DTHours hours={singleLocation?.hours} />
      </div>
    </div>
  );

  const locationEl = (
    <div className="footer-container__content__locations">
      {singleLocation && (
        <div className="footer-container__content__location">
          <div className="name">Location</div>
          <div className="address">{singleLocation.address_one}</div>
          <div className="address">{`${singleLocation.city}, ${singleLocation.state} ${singleLocation.postal_code}`}</div>

          <Link className="directions-link" to="/contact">
            <DTIcon name="email" />
            <div>Send a message</div>
          </Link>

          <a
            className="directions-link"
            target="_blank"
            href={`tel:${singleLocation.phone}`}
          >
            <DTIcon name="smartphone" />
            <div>{singleLocation.formatted_phone}</div>
            <div className="external-link">
              <DTIcon name="arrowExternalLink" />
            </div>
          </a>

          <a
            className="directions-link"
            target="_blank"
            href={singleLocation.google_maps_link}
          >
            <DTIcon name="mapPin" />
            <div>Directions</div>

            <div className="external-link">
              <DTIcon name="arrowExternalLink" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
  const logo = (
    <div className="footer-container__content--newsletter">
      <div className="logo-container">
        <div className="image-wrapper">
          <img
            style={{ width: "200", height: "100px", marginBottom: "1rem" }}
            src={siteLogos?.primary}
          />
        </div>
        <div className="name" style={{ color: "gray" }}>
          {
            "Arizona Wilderness Brewing Company was created to celebrate hand crafted,artisanal beers that are inspired by the beautiful and diverse state of Arizona. Many of our ideas and values are influenced by our time spent in nature."
          }
        </div>
      </div>
    </div>
  );

  const socialEl = (
    <div className="footer-container__content__locations">
      <div className="footer-container__content__location">
        <div className="name">Follow Us</div>
        {socialPlatforms?.map((platform) => (
          <a
            className="directions-link"
            onClick={() => window.open(platform.social_link, "_blank")}
            key={platform.id}
          >
            <DTSocialIcon socialPlatform={platform} />

            <div>{capitalizeWord(snakeToPretty(platform.platform_name))}</div>

            <div className="external-link">
              <DTIcon name="arrowExternalLink" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  const newsletterEl = (
    <div className="footer-container__content--newsletter">
      <DTWebForm
        webFormId="b47753fc-50f8-4eec-9bac-55433009fdf5"
        layout="STANDARD"
      />
    </div>
  );

  const content = () => {
    if (screenType === "DESKTOP" || screenType === "MOBILE") {
      return (
        <>
          {logo}
          {newsletterEl}
          {hoursEl}
          {locationEl}
          {socialEl}
        </>
      );
    } else if (screenType === "TABLET") {
      return (
        <>
          {locationEl}
          {socialEl}
          {hoursEl}
          {newsletterEl}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div
      className="footer-container"
      style={
        screenType === "DESKTOP"
          ? {
              // backgroundImage: `url(${require("../../../static/assets/images/logos/footer-bg.png")})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="footer-container__content">
        <div className="footer-container__content__top">{content()}</div>

        <div className="footer-container__content__attribution">
          <div>
            &#169; Copyright {new Date().getFullYear()} {concept?.name} | All
            rights reserved
          </div>

          <a
            href="https://dashtrack.com"
            target="_blank"
            className="attribution-link"
          >
            Restaurant Website by
            <img
              src={require("../../../static/assets/images/logos/dashtrack-logo.png")}
              style={{ height: "21px" }}
              alt="DashTrack"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
