import { XMLParser } from "fast-xml-parser";

export interface FeedEpisode {
  guid: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishDate: string;
}

export interface FeedData {
  name: string;
  artwork: string;
  description: string;
  episodes: FeedEpisode[];
}

export default defineEventHandler(async (event): Promise<FeedData> => {
  const query = getQuery(event);
  const feedUrl = query.url as string;

  if (!feedUrl || !feedUrl.startsWith("http")) {
    throw createError({ statusCode: 400, statusMessage: "Missing or invalid feed URL" });
  }

  let xml: string;
  try {
    const response = await $fetch<string>(feedUrl, {
      responseType: "text",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "Mozilla/5.0 (compatible; RSS-Reader/1.0)",
      },
    });
    xml = typeof response === "string" ? response : JSON.stringify(response);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Failed to fetch podcast feed" });
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    // Strip CDATA wrappers so we get plain strings
    cdataPropName: "__cdata",
  });

  const parsed = parser.parse(xml);
  const channel = parsed?.rss?.channel;

  if (!channel) {
    throw createError({ statusCode: 502, statusMessage: "Could not parse RSS feed" });
  }

  // Channel-level artwork — podcast feeds use either <itunes:image> or <image>
  const artwork =
    channel["itunes:image"]?.["@_href"] ||
    channel["itunes:image"] ||
    channel.image?.url ||
    "";

  const rawDescription =
    channel["itunes:summary"] ||
    channel.description?.["__cdata"] ||
    channel.description ||
    "";

  // Normalise items to always be an array
  const rawItems: unknown[] = Array.isArray(channel.item)
    ? channel.item
    : channel.item
      ? [channel.item]
      : [];

  const episodes: FeedEpisode[] = rawItems.map((item: any) => {
    // guid can be a string or an object with #text
    const guid =
      typeof item.guid === "object"
        ? item.guid?.["#text"] ?? item.guid?.["__cdata"] ?? ""
        : String(item.guid ?? "");

    const title =
      item.title?.["__cdata"] ?? item["itunes:title"] ?? item.title ?? "";

    const description =
      item["itunes:summary"]?.["__cdata"] ??
      item["itunes:summary"] ??
      item.description?.["__cdata"] ??
      item.description ??
      "";

    const audioUrl = item.enclosure?.["@_url"] ?? "";
    const duration = item["itunes:duration"] ?? "";
    const publishDate = item.pubDate ?? "";

    return { guid, title, description, audioUrl, duration, publishDate };
  });

  return {
    name: channel.title?.["__cdata"] ?? channel.title ?? "",
    artwork: String(artwork),
    description: String(rawDescription),
    episodes,
  };
});
