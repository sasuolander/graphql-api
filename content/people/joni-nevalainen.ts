import { Contact } from "../../server/schema/Contact";
import { ContactType } from "../../server/schema/types";

const person: Contact = {
  name: "Joni Nevalainen",
  about: "Joni Nevalainen works on the app.",
  image: {
    url: "people/joni.jpg",
  },
  social: {
    homepage: "",
    twitter: "joninevalainen",
    github: "joni-",
    linkedin: "nevalainenjoni",
  },
  location: {
    country: {
      name: "Finland",
      code: "FI",
    },
  },
  keywords: [],
  type: [ContactType.ORGANIZER],
};

export default person;
