import styled from "@emotion/styled";
import { Color } from "csstype";
import hexToRgba from "hex-to-rgba";
import map from "lodash/map";
import * as React from "react";
import { Conference } from "../../schema/Conference";
import { Theme } from "../../schema/Theme";
import connect from "../components/connect";
import { dayToFinnishLocale } from "../date-utils";
import conferenceDaysQuery from "../queries/conferenceDaysQuery";

interface HeaderContainerProps {
  id: string;
  primaryColor: Color;
  secondaryColor: Color;
  useTwitterHeader: boolean;
  texture: string;
}

const HeaderPageContainer = styled.div`
  background-image: ${({
    primaryColor,
    secondaryColor,
    texture,
  }: HeaderContainerProps) => `linear-gradient(
      ${primaryColor},
      ${hexToRgba(secondaryColor, 0.79)}
    ),
    url("${texture}")`};
  background-size: cover;
  position: relative;
  width: ${({ useTwitterHeader }: HeaderContainerProps) =>
    useTwitterHeader ? "1500px" : "1024px"};
  height: ${({ useTwitterHeader }: HeaderContainerProps) =>
    useTwitterHeader ? "500px" : "512px"};
  overflow: hidden;
  color: white;
` as React.FC<HeaderContainerProps>;

const TwitterSafeUser = styled.div`
  position: absolute;
  bottom: 0;
  background-color: #ff00008f;
  width: 450px;
  height: 200px;
  z-index: 1;
`;
const TwitterSafeTop = styled.div`
  position: absolute;
  top: 0;
  background-color: #ff00008f;
  width: 100%;
  height: 40px;
  z-index: 1;
`;
const TwitterSafeBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 450px;
  background-color: #ff00008f;
  width: 100%;
  height: 40px;
  z-index: 1;
`;

function TwitterSafeOverlay() {
  return (
    <>
      <TwitterSafeTop />
      <TwitterSafeBottom />
      <TwitterSafeUser />
    </>
  );
}

interface PrimaryRowProps {
  useTwitterHeader: boolean;
}

const PrimaryRow = styled.div`
  display: grid;
  grid-template-columns: ${({ useTwitterHeader }: PrimaryRowProps) =>
    useTwitterHeader ? "1fr 0.2fr" : "1.4fr 0.6fr"};
` as React.FC<PrimaryRowProps>;

interface SecondaryRowProps {
  useTwitterHeader: boolean;
}

const SecondaryRow = styled.div`
  display: grid;
  padding-left: ${({ useTwitterHeader }: SecondaryRowProps) =>
    useTwitterHeader ? "30em" : "5em"};
` as React.FC<SecondaryRowProps>;

const HeaderInfoContainer = styled.div`
  text-align: right;
  padding-right: 50px;
`;

interface HeaderLogoProps {
  src: string;
  useTwitterHeader: boolean;
}

const HeaderLogo = styled.img`
  padding-left: 3em;
  padding-right: 3em;
  padding-top: 1.8em;
  width: 100%;
  height: ${({ useTwitterHeader }: HeaderLogoProps) =>
    useTwitterHeader ? "20em" : ""};
` as React.FC<HeaderLogoProps>;

const HeaderConferenceDays = styled.h1`
  padding-top: 2em;
`;

const HeaderLocation = styled.h2`
  padding-top: 1em;
`;

const HeaderSlogan = styled.h2`
  padding-top: 1em;
`;

const HeaderCoupon = styled.h3`
  padding-top: 2em;
  font-family: "Courier New", Courier, monospace;
`;

interface HeaderTemplateProps {
  conference?: Conference;
  theme: Theme;
  id: string;
  coupon?: string;
  discountPercentage?: string;
  useTwitterHeader: boolean;
  showTwitterSafeArea: boolean;
}

function HeaderTemplate({
  conference,
  theme,
  id,
  coupon,
  discountPercentage,
  useTwitterHeader,
  showTwitterSafeArea,
}: HeaderTemplateProps) {
  const { locations, schedules, slogan } = conference || {
    locations: [],
    schedules: [],
    slogan: "",
  };
  const location =
    locations && locations.length > 0 && locations[0]
      ? {
          city: locations[0].city,
          country: locations[0].country && locations[0].country.name,
        }
      : null;
  const conferenceDays = map(schedules, ({ day }) => dayToFinnishLocale(day));
  const firstDay = conferenceDays[0];
  const lastDay = conferenceDays[conferenceDays.length - 1];

  return (
    <HeaderPageContainer
      id={id}
      primaryColor={theme.colors.primary}
      secondaryColor={theme.colors.secondary}
      useTwitterHeader={useTwitterHeader}
      texture={theme.textures[0].url}
    >
      {showTwitterSafeArea && <TwitterSafeOverlay />}
      <PrimaryRow useTwitterHeader={useTwitterHeader}>
        <HeaderLogo
          src={theme.logos.white.withText.url}
          useTwitterHeader={useTwitterHeader}
        />
        <HeaderInfoContainer>
          {firstDay && lastDay && (
            <HeaderConferenceDays>
              {firstDay}-{lastDay}
            </HeaderConferenceDays>
          )}
          {location && (
            <HeaderLocation>
              {location.city}, {location.country}
            </HeaderLocation>
          )}
        </HeaderInfoContainer>
      </PrimaryRow>
      <SecondaryRow useTwitterHeader={useTwitterHeader}>
        <HeaderSlogan>{slogan}</HeaderSlogan>
        {coupon && (
          <HeaderCoupon>
            Use {coupon} for a {discountPercentage}% discount!
          </HeaderCoupon>
        )}
      </SecondaryRow>
    </HeaderPageContainer>
  );
}

const ConnectedHeaderTemplate = connect(
  "/graphql",
  conferenceDaysQuery,
  {},
  ({ conferenceId }) => ({ conferenceId })
)(HeaderTemplate);

ConnectedHeaderTemplate.filename = "header";

// TODO: Better use enums here
ConnectedHeaderTemplate.variables = [
  {
    id: "conferenceId",
    query: `query ConferenceIdQuery {  
  conferences {
    id
    name
  }
}`,
    mapToCollection({ conferences }) {
      return conferences;
    },
    mapToOption({ id, name }) {
      return {
        value: id,
        label: name,
      };
    },
  },
  {
    id: "coupon",
    validation: { type: String, default: "" },
  },
  {
    id: "discountPercentage",
    validation: { type: String, default: "" },
  },
  {
    id: "useTwitterHeader",
    validation: { type: Boolean, default: false },
  },
  {
    id: "showTwitterSafeArea",
    validation: { type: Boolean, default: false },
  },
];

export default ConnectedHeaderTemplate;
