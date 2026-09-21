import type { IFounderBook } from "@/types";

export const FOUNDER_BOOK: IFounderBook = {
  label: "Founders Talk",
  edition: "OPENCORE GROUP",
  established: "EST. IN TORONTO",
  title: ["Founders", "Talk."],
  scrollHint: "SCROLL TO UNFOLD",
  logo: {
    url: "/founder-book/logo.webp",
    alt: "OCG logo",
    width: 246,
    height: 246,
    sizes: "82px",
  },
  skyline: {
    url: "/founder-book/toronto-sketch.webp",
    alt: "Hand-drawn Toronto skyline",
    width: 1280,
    height: 750,
    sizes: "(max-width: 700px) 100vw, 580px",
  },
  spreadLabel: "Inside the founder book",
  heading: "Founder Talk",
  paragraphs: [
    "A lot has changed over the past few years. Today, anyone can use AI to create a website, an app, or even a brand identity in a matter of hours. We use these tools every day, but we’ve learned that the real challenge was never writing code — it was knowing what to build.",
    "The best products come from understanding customers, operations, bottlenecks, and the details that make a business work. A company doesn’t always need another website, more features, or more software. It needs the right systems, experiences, and ideas to remove friction and support meaningful growth.",
    "That’s why OpenCore is a small team by design. No layers of account managers, endless meetings, or disconnected departments. We work as part of your team, asking questions, challenging assumptions, and taking ownership of the outcome. Our job isn’t simply to deliver a website or product. It’s to help you build the company you’re trying to become.",
  ],
  author: {
    name: "Austin Page",
    role: "Co-Founder, OpenCore Group",
    portrait: {
      url: "/avatars/austin-page-lg.webp",
      alt: "Austin Page, Co-Founder of OpenCore Group",
      width: 688,
      height: 860,
      sizes: "82px",
    },
  },
  collage: {
    label: "OpenCore scrapbook",
    note: "make it yours. drag a joke.",
    annotation: "this is us fr",
    photo: {
      kind: "eggsPhoto",
      label: "Easter eggs image. Drag to move, or use arrow keys.",
      img: {
        url: "/founder-book/easter-eggs.webp",
        alt: "Pastel speckled Easter eggs",
        width: 480,
        height: 603,
        sizes: "(max-width: 700px) 25vw, 140px",
      },
    },
    eggs: [
      {
        kind: "eggAi",
        label: "Hidden AI note. Drag to move, or use arrow keys.",
        tag: "HUMAN CHECK ✓",
        lines: ["Still powered by coffee."],
      },
      {
        kind: "eggBugs",
        label: "Hidden bug note. Drag to move, or use arrow keys.",
        tag: "SECRET FOUND",
        lines: ["It’s a feature.", "Probably."],
      },
      {
        kind: "eggFry",
        label: "Hidden Fry note. Drag to move, or use arrow keys.",
        tag: "PSST…",
        lines: ["You found the", "human layer."],
      },
    ],
    scraps: [
      {
        kind: "ai",
        label: "AI joke. Drag to move, or use arrow keys.",
        img: {
          url: "/founder-book/ai.webp",
          alt: "Toy Story meme: AI! AI everywhere.",
          width: 600,
          height: 327,
          sizes: "(max-width: 700px) 70vw, (max-width: 1000px) 40vw, 390px",
        },
      },
      {
        kind: "bugs",
        label: "Spider-Man joke. Drag to move, or use arrow keys.",
        img: {
          url: "/founder-book/bugs.webp",
          alt: "Spider-Man meme: spiders are the only web developers happy to find bugs.",
          width: 516,
          height: 387,
          sizes: "(max-width: 700px) 50vw, (max-width: 1000px) 30vw, 290px",
        },
      },
      {
        kind: "fry",
        label: "Fry joke. Drag to move, or use arrow keys.",
        img: {
          url: "/founder-book/fry.webp",
          alt: "Fry giving a skeptical look",
          width: 473,
          height: 327,
          sizes: "(max-width: 700px) 45vw, (max-width: 1000px) 27vw, 250px",
        },
      },
    ],
    stamp: {
      url: "/graphics/ontario-badge.webp",
      alt: "Vintage Ontario Canada postage stamp",
      width: 430,
      height: 335,
      sizes: "(max-width: 700px) 30vw, 180px",
    },
  },
};
