// Customize this file with your own podcast picks.
//
// To find a podcast's RSS feed URL:
//   - Search "[Podcast Name] RSS feed"
//   - Look in the podcast app's episode sharing options
//   - Use https://podcastindex.org to search by name
//
// To find an episode's audioUrl:
//   - Fetch the RSS feed (or use a browser extension like RSS Feed Reader)
//   - Look for the <enclosure url="..."> field on the episode
//   - The URL ends in .mp3 or .m4a

export interface CuratedEpisode {
  guid: string
  title: string
  description: string
  audioUrl: string
  duration: string
  publishDate: string
  note: string
}

export interface Podcast {
  slug: string
  name: string
  feedUrl: string
  websiteUrl: string
  description: string
  recommendedEpisodes: CuratedEpisode[]
}

export const podcasts: Podcast[] = [
  {
    slug: "acquired",
    name: "Acquired",
    feedUrl: "https://feeds.transistor.fm/acq2",
    websiteUrl: "https://www.acquired.fm",
    description:
      "Ben Gilbert and David Rosenthal tell the full stories and strategies behind the world's greatest companies — from founding to today. Exceptionally well researched.",
    recommendedEpisodes: [
      {
        guid: "acquired-nvidia-2023",
        title: "NVIDIA: The GPU Company (1993-2023)",
        description:
          "The story of how Jensen Huang turned a graphics chip startup into the backbone of modern AI — and how nearly going bankrupt in 1996 shaped every decision since.",
        audioUrl: "",
        duration: "3:02:14",
        publishDate: "2023-09-19",
        note: "Best intro to the show. A masterclass in how a single technical bet, held with conviction for 30 years, changes the world.",
      },
      {
        guid: "acquired-steve-jobs-2023",
        title: "Steve Jobs",
        description:
          "A comprehensive look at Steve Jobs — NeXT, Pixar, returning to Apple, and the products that followed. More nuanced than the hagiography.",
        audioUrl: "",
        duration: "2:21:47",
        publishDate: "2023-06-06",
        note: "Reframes the Apple story in a way I hadn't heard before. The Pixar chapter alone is worth the listen.",
      },
    ],
  },
  {
    slug: "lennys-podcast",
    name: "Lenny's Podcast",
    feedUrl: "https://api.substack.com/feed/podcast/10845.rss",
    websiteUrl: "https://www.lennyspodcast.com",
    description:
      "Lenny Rachitsky interviews the best product managers and operators in tech. Practical, honest, and consistently excellent signal-to-noise ratio.",
    recommendedEpisodes: [
      {
        guid: "lenny-shreyas-doshi",
        title: "The essence of product sense | Shreyas Doshi (ex-Stripe, Twitter, Google, Yahoo)",
        description:
          "Shreyas Doshi on what separates good PMs from great ones, why most product teams operate at the wrong level, and how to develop genuine product sense.",
        audioUrl: "",
        duration: "1:24:31",
        publishDate: "2023-01-08",
        note: "The clearest articulation I've heard of what product intuition actually is. Changed how I think about prioritization.",
      },
      {
        guid: "lenny-gibson-biddle",
        title: "What is product strategy? | Gibson Biddle (ex-Netflix, Chegg)",
        description:
          "Gibson Biddle's DHM model — Delight customers, Hard to copy, Margin-enhancing — applied to how Netflix built its product strategy in the early streaming era.",
        audioUrl: "",
        duration: "1:11:08",
        publishDate: "2022-05-22",
        note: "The Netflix strategy framing is something I've referenced in countless product reviews since.",
      },
    ],
  },
  {
    slug: "lex-fridman",
    name: "Lex Fridman Podcast",
    feedUrl: "https://lexfridman.com/feed/podcast/",
    websiteUrl: "https://lexfridman.com/podcast",
    description:
      "Long-form conversations with scientists, engineers, philosophers and artists. At its best, it produces a kind of deep thinking that's hard to find anywhere else.",
    recommendedEpisodes: [
      {
        guid: "lex-donald-knuth-2019",
        title: "Donald Knuth: Algorithms, Complexity, Life, and The Art of Computer Programming",
        description:
          "A conversation with the author of The Art of Computer Programming. Knuth on his life's work, the nature of algorithms, and why he stopped using email in 1990.",
        audioUrl: "",
        duration: "1:52:13",
        publishDate: "2019-04-05",
        note: "Talking to one of the great minds of computing. The joy he has for his work is infectious.",
      },
    ],
  },
]
