import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const sponsor: Contact = {
  name: "WebExpo",
  about: "The web event of the year",
  image: {
    url: "sponsors/webexpo.png",
  },
  social: {
    homepage: "https://www.webexpo.net/",
    facebook: "WebExpo",
    twitter: "webexpo",
    medium: "webexpo",
  },
  location: {
    country: {
      name: "Czech Republic",
      code: "CZ",
    },
    city: "Prague",
  },
  type: [ContactType.SPONSOR],
};

export default sponsor;
