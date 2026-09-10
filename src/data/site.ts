// ============================================================
// WEBSITE CONTENT
// This is the main file Brandon should edit.
// You normally do NOT need to change React or CSS files.
// ============================================================

export const site = {
  owner: {
    name: "Brandon Phan",
    portfolioName: "Brandon Phan's Portfolio",

    // Easiest option: put a file at public/images/profile/profile.jpg.
    // Until then, the site falls back to the current profile image in the GitHub repo.
    profileImage: "/images/profile/profile.jpg",
    profileImageFallback:
      "https://raw.githubusercontent.com/Brizzy2470/Brizzy2470.github.io/refs/heads/main/src/images/profile.jpg",
  },

  hero: {
    titleTop: "MAKE",
    titleAccent: "SOMETHING",
    titleBottom: "LOUD.",
    intro: "My Creative Work!",
    buttonText: "ENTER THE ARCHIVE",
    sticker: {
      text: ["SELECT", "YOUR", "PATH"],
      number: "NO. 00",
    },
    footerText: "SCROLL TO INVESTIGATE",
    year: "2026",
  },

  navigation: [
    { index: "01", label: "WORK", section: "work" },
    { index: "02", label: "ABOUT", section: "about" },
    { index: "03", label: "CONTACT", section: "contact" },
  ],

  work: {
    number: "01",
    kicker: "CASE FILES ///",
    heading: "WORK",
    noteTop: "SELECT A FILE",
    noteBottom: "TO INVESTIGATE",
    hoverNote: "INVESTIGATE",
    openButton: "OPEN CASE",
    imagePlaceholder: "PROJECT IMAGE",
  },

  about: {
    number: "02",
    kicker: "PROFILE DATA ///",
    title: "ABOUT",
    statusLabel: "STATUS",
    statusValue: "ACTIVE",
    portraitLabel: "PORTRAIT",
    portraitSubLabel: "/ CHARACTER ART /",
    portraitImage: "/images/profile/about.jpg",
    playerTag: "PLAYER 00",
    identityLabel: "IDENTITY ///",
    headingTop: "CREATIVE",
    headingBottom: "PROFILE",
    bio: "Hello! I'm Brandon Phan, a multidisciplinary creative passionate about exploring new ideas and pushing the boundaries of art and design. I enjoy creating work that is both visually striking and conceptually engaging.",
    specialties: [
      "PHOTOSHOP",
      "VIDEOTOGRAPHY",
      "GRAPHIC DESIGN",
      "SOCIAL MEDIA",
    ],
    stats: [
      { label: "CREATIVE DIRECTION", value: 92 },
      { label: "DEVELOPMENT", value: 86 },
      { label: "DESIGN", value: 88 },
      { label: "EXPERIMENTATION", value: 95 },
    ],
    footerLabel: "PROFILE // 02",
    footerMessage: "KEEP MAKING WEIRD THINGS.",
  },

  contact: {
    number: "03",
    kicker: "FINAL TRANSMISSION ///",
    titleTop: "GET IN",
    titleBottom: "TOUCH.",
    statusLabel: "CHANNEL",
    statusValue: "OPEN",
    messageLabel: "MESSAGE ///",
    intro: "LET'S TALK!",
    subtext: "Use this space for a short final invitation to reach out.",
    email: "brandon.phan2470@gmail.com",
    buttonText: "SEND A MESSAGE",
    links: [
      {
        label: "EMAIL",
        value: "brandon.phan2470@gmail.com",
        href: "mailto:brandon.phan2470@gmail.com",
      },
      {
        label: "PHONE",
        value: "+1 (614) 943-5080",
        href: "tel:+16149435080",
      },
      {
        label: "LINKEDIN",
        value: "IN/BRANDONMINHPHAN",
        href: "https://www.linkedin.com/in/brandonminhphan",
      },
      {
        label: "INSTAGRAM",
        value: "@brizzy._p",
        href: "https://instagram.com/brizzy._p",
      },
    ],
    finalLabel: "END OF FILE ///",
    finalMessageTop: "LET'S MAKE",
    finalMessageBottom: "SOMETHING LOUD.",
    footerLabel: "03 / CONTACT",
  },
} as const;
