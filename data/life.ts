import { imageDimensions } from "./imageDimensions";

export type LifePhoto = {
  src: string;
  title: string;
  date: string;
  thumbhash: string;
};

type LifePhotoEntry = Omit<LifePhoto, "thumbhash">;

/** Which photo in `lifePhotos` is the large right-hand hero (0-based). */
export const LIFE_HERO_INDEX = 2;

/** Standard 4:3 frame used for uniform Life zoom dimensions (matches grid tiles). */
export const LIFE_ZOOM_FRAME = { width: 792, height: 594 } as const;

const smallGridClass = "sm:col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-4";
const heroGridClass = "sm:col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-8 xl:row-span-2";

export type LifeGridItem = LifePhoto & {
  isHero: boolean;
  gridClass: string;
  sourceIndex: number;
};

/** Visual grid order: two small → hero → two small → rest (hero slot stays beside rows 1–2). */
export function buildLifeGridItems(
  photos: LifePhoto[],
  heroIndex: number = LIFE_HERO_INDEX,
): LifeGridItem[] {
  const hero = photos[heroIndex];
  if (!hero) return photos.map((photo, sourceIndex) => ({
    ...photo,
    isHero: false,
    gridClass: smallGridClass,
    sourceIndex,
  }));

  const others = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => index !== heroIndex);

  const items: LifeGridItem[] = [];

  const push = (photo: LifePhoto, sourceIndex: number, isHero: boolean) => {
    items.push({
      ...photo,
      isHero,
      sourceIndex,
      gridClass: isHero ? heroGridClass : smallGridClass,
    });
  };

  if (others[0]) push(others[0].photo, others[0].index, false);
  if (others[1]) push(others[1].photo, others[1].index, false);
  push(hero, heroIndex, true);
  if (others[2]) push(others[2].photo, others[2].index, false);
  if (others[3]) push(others[3].photo, others[3].index, false);
  for (let i = 4; i < others.length; i++) {
    push(others[i].photo, others[i].index, false);
  }

  return items;
}

/** Edit this list when adding photos. Then run /sync-life-photos or `npm run sync:life`. */
const lifePhotoEntries: LifePhotoEntry[] = [
  {
    src: "/img/life/1.png",
    title: "Growing tomatoes",
    date: "April 26",
  },
  {
    src: "/img/life/2.png",
    title: "Planting a tree",
    date: "April 26",
  },
  {
    src: "/img/life/5.png",
    title: "Ves and Eik, Sweden",
    date: "March 26",
  },
  {
    src: "/img/life/4.png",
    title: "Tromsø, Norway",
    date: "March 26",
  },
  {
    src: "/img/life/3.png",
    title: "Tromsø, Norway",
    date: "March 26",
  },
  {
    src: "/img/life/6.png",
    title: "Breakfast",
    date: "March 26",
  },
  {
    src: "/img/life/7.png",
    title: "Breakfast",
    date: "March 26",
  },
  {
    src: "/img/life/8.png",
    title: "Home",
    date: "March 26",
  },
  {
    src: "/img/life/9.png",
    title: "Office",
    date: "Feb 26",
  },
];

export const lifePhotos: LifePhoto[] = lifePhotoEntries.map((photo) => ({
  ...photo,
  thumbhash: getLifeThumbhash(photo.src),
}));

function getLifeThumbhash(src: string) {
  const entry = imageDimensions[src as keyof typeof imageDimensions];
  return entry && "thumbhash" in entry ? entry.thumbhash : "";
}
