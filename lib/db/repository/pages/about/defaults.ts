import { randomUUID } from "crypto";
import { aboutCta, aboutIntro } from "./utils";

export const defaultAboutPageData = (
  legacy?: Partial<Pick<AboutPageContent, "aboutUs" | "mission" | "vision">>
): Omit<AboutPageContent, "id" | "createdAt" | "updatedAt"> => {
  const mission =
    legacy?.mission ||
    "Support women, young people, and families with practical programs that bring care closer to everyday life.";
  const vision =
    legacy?.vision ||
    "A community where people have the support, confidence, and opportunity to keep moving forward.";
  const aboutUs =
    legacy?.aboutUs ||
    "Zita Onyeka Foundation works with underserved families through education support, relief outreach, skills development, and community care. The work starts by listening, then responding with support people can actually use.";

  return {
    aboutUs,
    mission,
    vision,
    hero: {
      intro: aboutIntro(
        "About Us",
        "We are built close to the people we serve.",
        ""
      ),
      image: "",
      mission,
      vision,
      calloutTitle: "Care becomes useful when it is organized.",
      calloutText:
        "Our team and volunteers help turn goodwill into practical action.",
    },
    story: {
      intro: aboutIntro(
        "Who we are",
        "We turn concern into organized help.",
        aboutUs
      ),
      body: aboutUs,
      image: "",
      captionTitle: "Get to know us",
      captionText:
        "A group photo with some of the team members and volunteers during a community outreach event.",
      trustPoints: [
        {
          id: randomUUID(),
          point: "Education support",
          published: true,
          order: 0,
        },
        {
          id: randomUUID(),
          point: "Relief outreach",
          published: true,
          order: 1,
        },
        {
          id: randomUUID(),
          point: "Women empowerment",
          published: true,
          order: 2,
        },
        {
          id: randomUUID(),
          point: "Youth development",
          published: true,
          order: 3,
        },
      ],
    },
    team: {
      intro: aboutIntro(
        "Meet the team",
        "The people behind the work.",
        "A small team helps plan programs, coordinate outreach, and keep support moving toward the people who need it."
      ),
    },
    foundersMessage: {
      intro: aboutIntro("Founder's message", "A note from the founder.", ""),
      founder: {
        name: "Zita Onyeka",
        role: "Founder & Executive Lead",
        image: "",
        quote:
          "We started this foundation because care should not feel far away from the people who need it most.",
        body: "Every outreach begins with listening. We pay attention to what families are carrying, what children need to keep learning, and what women and young people need to move with more confidence.\n\nMy hope is that every person who meets this work feels seen, respected, and supported in a practical way. The goal is not noise. The goal is useful help, delivered with dignity and followed through with care.",
      },
      ctas: [aboutCta("Reach out", "/contact")],
    },
    cta: {
      intro: aboutIntro(
        "Work with us",
        "Want to support the work or partner on an outreach?",
        "Send a message. We will talk through what is needed and where your support can be useful."
      ),
      backgroundImage: "",
      ctas: [
        aboutCta("Contact us", "/contact", 0, "primary"),
        aboutCta("Donate", "/donate", 1, "secondary"),
      ],
    },
  };
};
