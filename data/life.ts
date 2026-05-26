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

/** Which photo is the large left-hand hero at xl (0-based). */
export const LIFE_LEFT_HERO_INDEX = 9;

/** Standard 4:3 frame used for uniform Life zoom dimensions (matches grid tiles). */
export const LIFE_ZOOM_FRAME = { width: 792, height: 594 } as const;

const smallGridClass = "sm:col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-4";
const heroGridClass = "sm:col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-8 xl:row-span-2";

/** Small tiles between the right-hero block and the left-hero block. */
const TILES_BETWEEN_HEROES = 4;

export type LifeGridItem = LifePhoto & {
  isHero: boolean;
  gridClass: string;
  sourceIndex: number;
};

/** Visual grid: right-hero block → middle tiles → left-hero block → rest. */
export function buildLifeGridItems(
  photos: LifePhoto[],
  rightHeroIndex: number = LIFE_HERO_INDEX,
  leftHeroIndex: number = LIFE_LEFT_HERO_INDEX,
): LifeGridItem[] {
  const rightHero = photos[rightHeroIndex];
  const leftHero = leftHeroIndex !== rightHeroIndex ? photos[leftHeroIndex] : undefined;
  const heroIndices = new Set(
    [rightHeroIndex, leftHero ? leftHeroIndex : null].filter((index): index is number => index !== null),
  );

  if (!rightHero && !leftHero) {
    return photos.map((photo, sourceIndex) => ({
      ...photo,
      isHero: false,
      gridClass: smallGridClass,
      sourceIndex,
    }));
  }

  const others = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => !heroIndices.has(index));

  const items: LifeGridItem[] = [];

  const push = (photo: LifePhoto, sourceIndex: number, isHero: boolean) => {
    items.push({
      ...photo,
      isHero,
      sourceIndex,
      gridClass: isHero ? heroGridClass : smallGridClass,
    });
  };

  let cursor = 0;

  const pushOthers = (count: number) => {
    for (let i = 0; i < count && cursor < others.length; i++) {
      push(others[cursor].photo, others[cursor].index, false);
      cursor += 1;
    }
  };

  if (rightHero) {
    pushOthers(2);
    push(rightHero, rightHeroIndex, true);
    pushOthers(2);
  }

  pushOthers(TILES_BETWEEN_HEROES);

  if (leftHero) {
    push(leftHero, leftHeroIndex, true);
    pushOthers(2);
  }

  while (cursor < others.length) {
    push(others[cursor].photo, others[cursor].index, false);
    cursor += 1;
  }

  return items;
}

/** Edit this list when adding photos. Then run /sync-life-photos or `npm run sync:life`. */
const lifePhotoEntries: LifePhotoEntry[] = [
  
  {
    src: "/img/life/2605-plants.jpg",
    title: "Growing things to eat",
    date: "May 26",
  },
  {
    src: "/img/life/2605-woodworking.jpg",
    title: "Woodworking",
    date: "May 26",
  },
  {
    src: "/img/life/2605-garden.jpg",
    title: "Garden at home",
    date: "May 26",
  },
  {
    src: "/img/life/2604-tree.jpg",
    title: "Planting a tree",
    date: "Apr 26",
  },
  {
    src: "/img/life/2603-kids.jpg",
    title: "Ves and Eik, Sweden",
    date: "Mar 26",
  },
  {
    src: "/img/life/2603-road.jpg",
    title: "Tromsø, Norway",
    date: "Mar 26",
  },
  {
    src: "/img/life/2603-me.jpg",
    title: "Tromsø, Norway",
    date: "Mar 26",
  },
  {
    src: "/img/life/2603-ves.jpg",
    title: "Breakfast",
    date: "Mar 26",
  },
  {
    src: "/img/life/2603-table.jpg",
    title: "Easter",
    date: "Mar 26",
  },
  {
    src: "/img/life/2602-office.jpg",
    title: "Office",
    date: "Feb 26",
  },
  {
    src: "/img/life/2603-home.jpg",
    title: "Home",
    date: "Mar 26",
  },
  {
    src: "/img/life/2602-outside.jpg",
    title: "Out sledding",
    date: "Feb 26",
  },
  {
    src: "/img/life/2602-friends.jpg",
    title: "Camping with friends",
    date: "Feb 26",
  },
  {
    src: "/img/life/2602-driving.jpg",
    title: "Driving through snow",
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
