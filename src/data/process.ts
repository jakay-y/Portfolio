export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
  deliverable: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    duration: "3–5 days",
    description:
      "A working session to understand the business, the users, and what actually needs to be true for this to succeed — before any screen gets drawn.",
    deliverable: "Project brief",
  },
  {
    title: "Research & define",
    duration: "1 week",
    description:
      "Competitive scan, user research where it's useful, and a clear map of the problem so the design has something real to answer.",
    deliverable: "Sitemap and user flows",
  },
  {
    title: "Design",
    duration: "2–3 weeks",
    description:
      "Wireframes into high-fidelity UI, iterated in the open with regular check-ins so nothing arrives as a surprise.",
    deliverable: "Figma file and prototype",
  },
  {
    title: "Build",
    duration: "3–5 weeks",
    description:
      "I build it myself — frontend, backend, integrations — so what ships matches what was designed, pixel for pixel.",
    deliverable: "Staging link",
  },
  {
    title: "Launch & support",
    duration: "Ongoing",
    description:
      "Deployed, tested, and handed off with everything documented, plus a window of support once it's live.",
    deliverable: "Live product and handover notes",
  },
];
