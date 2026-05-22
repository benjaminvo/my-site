export type LifePhoto = {
  src: string;
  title: string;
  date: string;
  thumbhash: string;
  gridClass: string;
};

const smallGridClass = "sm:col-span-4 lg:col-span-3 xl:col-span-4";
const heroGridClass = "sm:col-span-8 lg:col-span-6 lg:row-span-2 xl:col-span-8 xl:row-span-2";

export const lifePhotos: LifePhoto[] = [
  {
    src: "/img/life/1.png",
    title: "Growing tomatoes",
    date: "April 26",
    thumbhash: "F+gFDYDBglRvmahceXZZaz+GJRhg",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/2.png",
    title: "Planting a tree",
    date: "April 26",
    thumbhash: "3AgGHYK000hgSqqWgedIe4uAd/iH",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/5.png",
    title: "Ves and Eik, Sweden",
    date: "March 26",
    thumbhash: "YQgKFoStdoeMhYhfePiXaHZFJ4BxBWg=",
    gridClass: heroGridClass,
  },
  {
    src: "/img/life/4.png",
    title: "Tromsø, Norway",
    date: "March 26",
    thumbhash: "4vcFDYB2iJcMpYhEd/l3W2qgtwaL",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/3.png",
    title: "Tromsø, Norway",
    date: "March 26",
    thumbhash: "YecJDYK5aGivZXhLmseIZpWAhgR3",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/6.png",
    title: "Breakfast",
    date: "March 26",
    thumbhash: "IPgFLYRwd0gXhqoyd2lKY6+39Eo6",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/7.png",
    title: "Breakfast",
    date: "March 26",
    thumbhash: "nBgKFYKKhZiAZ4eGh1eIl3NfIvlF",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/8.png",
    title: "Home",
    date: "March 26",
    thumbhash: "G/gFHYSlqZoIi5eNRrZYqWrQ9EQ8",
    gridClass: smallGridClass,
  },
  {
    src: "/img/life/9.png",
    title: "Office",
    date: "Feb 26",
    thumbhash: "XRgKFYI6dlVviGdph0iIhnWAWQeI",
    gridClass: smallGridClass,
  },
];
