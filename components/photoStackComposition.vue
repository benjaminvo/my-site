<template>
  <Transition name="fade">
    <div v-show="photoPositionsLoaded" class="relative" @mouseenter.once="updatePhotoDimensions">
      <img
        v-for="(photo, index) in photos"
        :key="index"
        :src="photo.src"
        :srcset="photo.srcset"
        ref="photoElements"
        @mousedown.prevent="dragPhoto(index, $event)"
        @mouseenter="showCaption(index, $event)"
        @mouseleave="removeCaption"
        :style="{
          left: photo.position.x + 'px',
          top: photo.position.y + 'px',
          zIndex: photo.zIndex,
        }"
        class="absolute select-none border-4 border-white ease-in-out"
        :class="[
          photo.rotate,
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          animatePhotos ? 'transition-custom duration-500' : 'transition duration-150',
          isNotBehindOtherPhotos(index) ? 'scale-110 shadow-2xl' : 'scale-100 shadow',
        ]" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

const photos = useState(() => [
  {
    src: "img/lemons.jpg",
    srcset: "img/lemons@2x.jpg 2x, img/lemons@3x.jpg 3x",
    position: { x: 0, y: 0 },
    width: null,
    height: null,
    rotate: "",
    zIndex: 0,
    caption: "Beautiful lemon trees in Mallorca",
  },
  {
    src: "img/eik.jpg",
    srcset: "img/eik@2x.jpg 2x, img/eik@3x.jpg 3x",
    position: { x: 0, y: 0 },
    width: null,
    height: null,
    rotate: "",
    zIndex: 1,
    caption: "My son Eik at home",
  },
  {
    src: "img/me.jpg",
    srcset: "img/me@2x.jpg 2x, img/me@3x.jpg 3x",
    position: { x: 0, y: 0 },
    width: null,
    height: null,
    rotate: "",
    zIndex: 2,
    caption: "Me, very happy at a concert",
  },
]);
let animatePhotos = useState(() => true);
let draggedPhotoIndex = ref(null);
let photoPositionsLoaded = ref(false);
let isDragging = false;

onMounted(() => {
  if (localStorage.photos) {
    photos.value = JSON.parse(localStorage.photos);
    animatePhotos.value = false;
  }
  photoPositionsLoaded.value = true;

  // Animate photos on load
  if (animatePhotos.value) {
    setTimeout(() => {
      photos.value[2].position.x = -5;
      photos.value[2].position.y = 27;
      photos.value[2].rotate = "-rotate-2";
    }, "500");
    setTimeout(() => {
      photos.value[1].position.x = 43;
      photos.value[1].position.y = 2;
      photos.value[1].rotate = "rotate-6";
    }, "650");
    setTimeout(() => {
      photos.value[0].position.x = 12;
      photos.value[0].position.y = -25;
      photos.value[0].rotate = "rotate-1";
    }, "800");

    setTimeout(() => {
      animatePhotos.value = false;
    }, "1500");
  }
});

function showCaption(index, event) {
  if (isDragging) {
    return false;
  }

  // Create a new div element
  const caption = document.createElement("div");
  caption.setAttribute("id", "caption");
  caption.setAttribute(
    "class",
    "absolute bg-black dark:bg-slate-50 text-white dark:text-slate-900 text-sm whitespace-nowrap px-3 py-1 z-[99999] rounded-full shadow-xl",
  );

  // Add text to the div
  const captionText = document.createTextNode(photos.value[index].caption);
  caption.appendChild(captionText);

  // Add div to the DOM
  document.body.appendChild(caption);

  const onMouseMove = (e) => {
    caption.style.left = e.pageX + 16 + "px";
    caption.style.top = e.pageY - 32 + "px";
    //caption.style.zIndex = photos.value[index].zIndex;
  };
  document.addEventListener("mousemove", onMouseMove);
}

function removeCaption() {
  if (!isDragging) {
    const caption = document.getElementById("caption");
    caption.remove();
  }
}

function dragPhoto(index, event) {
  isDragging = true;
  draggedPhotoIndex.value = index;

  // Save offset to place the photo in the right position behind the cursor when moving
  const offset = {
    x: photos.value[index].position.x - event.clientX,
    y: photos.value[index].position.y - event.clientY,
  };

  // Move the photo
  function movePhoto(event) {
    event.preventDefault();

    // Update position
    const newPosition = {
      x: event.clientX + offset.x,
      y: event.clientY + offset.y,
    };
    photos.value[index].position = newPosition;

    // Bring it to the top of the photo stack
    if (isNotBehindOtherPhotos(index) && photos.value[index].zIndex !== getMaxZIndex()) {
      photos.value[index].zIndex = getMaxZIndex() + 1;
    }
  }
  document.addEventListener("mousemove", movePhoto);

  // Drop the photo
  document.onmouseup = function () {
    // Save positions
    localStorage.setItem("photos", JSON.stringify(photos.value));

    // Reset variables and remove event listener
    isDragging = false;
    draggedPhotoIndex.value = null;
    document.removeEventListener("mousemove", movePhoto);
  };
}

function getMaxZIndex() {
  return Math.max(...photos.value.map((photo) => photo.zIndex));
}

function isNotBehindOtherPhotos(index) {
  // Only run this function on the dragged photo
  if (index !== draggedPhotoIndex.value) {
    return false;
  }

  // Check if the dragged photo 1) overlaps another photo, and 2) has a lower z-index than that photo
  const draggedPhoto = photos.value[index];
  const otherPhotos = photos.value.filter((_, i) => i !== index);

  for (const otherPhoto of otherPhotos) {
    if (
      doPhotosOverlap(
        draggedPhoto.position.x,
        draggedPhoto.position.y,
        draggedPhoto.width,
        draggedPhoto.height,
        otherPhoto.position.x,
        otherPhoto.position.y,
        otherPhoto.width,
        otherPhoto.height,
      ) &&
      draggedPhoto.zIndex < otherPhoto.zIndex
    ) {
      return false;
    }
  }

  // Dragged photo is not behind another photo
  return true;
}

function doPhotosOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

const photoElements = ref([]);
function updatePhotoDimensions() {
  nextTick(() => {
    photoElements.value.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      photos.value[index].width = rect.width;
      photos.value[index].height = rect.height;
    });
  });
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
