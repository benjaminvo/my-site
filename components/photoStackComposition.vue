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
import { ref, nextTick, onMounted, onUnmounted } from "vue";

const photos = useState(() => [
  {
    src: "img/lemons.jpg",
    srcset: "img/lemons@2x.jpg 2x, img/lemons@3x.jpg 3x",
    position: { x: 0, y: 0 },
    width: null,
    height: null,
    rotate: "",
    zIndex: 0,
    caption: "Lemon trees in Mallorca",
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
    caption: "Me, happy at a concert",
  },
]);
let animatePhotos = useState(() => true);
let draggedPhotoIndex = ref(null);
let photoPositionsLoaded = ref(false);
let isDragging = false;
const hasAnimated = ref(false);

// Keep only originalPositions
const originalPositions = [
  { x: 20, y: -35, rotate: "rotate-1", zIndex: 0 },
  { x: 76, y: 2, rotate: "rotate-6", zIndex: 1 },
  { x: -5, y: 27, rotate: "-rotate-2", zIndex: 2 },
];

onMounted(() => {
  if (localStorage.photos) {
    photos.value = JSON.parse(localStorage.photos);
    animatePhotos.value = false;
    hasAnimated.value = true;
  } else {
    animatePhotosOnLoad();
  }
  photoPositionsLoaded.value = true;

  // Update photo dimensions after initial load
  nextTick(() => {
    updatePhotoDimensions();
  });

  // Add keyboard event listener
  window.addEventListener("keydown", handleKeyPress);
});

// Remove event listener on component unmount
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

function animatePhotosOnLoad() {
  animatePhotos.value = true;

  const animationSteps = originalPositions
    .map((pos, index) => ({
      index,
      x: pos.x,
      y: pos.y,
      rotate: pos.rotate,
      zIndex: pos.zIndex,
    }))
    .sort((a, b) => b.zIndex - a.zIndex); // Sort by zIndex in descending order

  animationSteps.forEach((step, i) => {
    setTimeout(
      () => {
        photos.value[step.index].position.x = step.x;
        photos.value[step.index].position.y = step.y;
        photos.value[step.index].rotate = step.rotate;
        photos.value[step.index].zIndex = step.zIndex;
      },
      500 + i * 150,
    ); // Use 'i' instead of 'index' for the delay
  });

  setTimeout(() => {
    animatePhotos.value = false;
    hasAnimated.value = true;
    nextTick(() => {
      updatePhotoDimensions();
    });
  }, 1500);
}

// Function to handle key press
function handleKeyPress(event) {
  if (event.key.toLowerCase() === "p") {
    resetPhotoPositions();
  }
}

// Function to reset photo positions
function resetPhotoPositions() {
  localStorage.removeItem("photos");
  animatePhotos.value = true;

  const photoIndices = photos.value
    .map((photo, index) => ({
      index,
      originalZIndex: originalPositions[index].zIndex,
      currentZIndex: photo.zIndex,
    }))
    .sort((a, b) => originalPositions[a.index].zIndex - originalPositions[b.index].zIndex);

  let maxDelay = 0;

  photoIndices.forEach((photoData, index) => {
    const photo = photos.value[photoData.index];
    const originalPosition = originalPositions[photoData.index];

    const needsIntermediate = photoIndices.some(
      (otherPhoto) =>
        otherPhoto.index !== photoData.index &&
        otherPhoto.originalZIndex > photoData.originalZIndex &&
        otherPhoto.currentZIndex < photoData.currentZIndex &&
        doPhotosOverlap(
          photo.position.x,
          photo.position.y,
          photo.width,
          photo.height,
          photos.value[otherPhoto.index].position.x,
          photos.value[otherPhoto.index].position.y,
          photos.value[otherPhoto.index].width,
          photos.value[otherPhoto.index].height,
        ),
    );

    if (needsIntermediate) {
      const intermediatePosition = findNonOverlappingPosition(photoData.index);

      // First step: Move to non-overlapping position
      setTimeout(() => {
        photo.position.x = intermediatePosition.x;
        photo.position.y = intermediatePosition.y;
        photo.zIndex = Math.max(...photos.value.map((p) => p.zIndex)) + 1; // Move to top temporarily
      }, index * 100);

      // Second step: Move to original position
      setTimeout(
        () => {
          photo.position.x = originalPosition.x;
          photo.position.y = originalPosition.y;
          photo.rotate = originalPosition.rotate;
          photo.zIndex = originalPosition.zIndex;
        },
        index * 100 + 600,
      );

      maxDelay = Math.max(maxDelay, index * 100 + 600);
    } else {
      // Direct move to original position if no intermediate step needed
      setTimeout(() => {
        photo.position.x = originalPosition.x;
        photo.position.y = originalPosition.y;
        photo.rotate = originalPosition.rotate;
        photo.zIndex = originalPosition.zIndex;
      }, index * 100);

      maxDelay = Math.max(maxDelay, index * 100);
    }
  });

  // After all animations complete
  setTimeout(() => {
    animatePhotos.value = false;
    nextTick(() => {
      updatePhotoDimensions();
      localStorage.setItem("photos", JSON.stringify(photos.value));
    });
  }, maxDelay + 500);
}

function findNonOverlappingPosition(photoIndex) {
  const photo = photos.value[photoIndex];
  const originalPosition = originalPositions[photoIndex];
  let angle = Math.random() * Math.PI - Math.PI / 2; // Start with an upward bias
  let distance = 200;
  const maxAttempts = 20;
  const verticalBias = 1.5; // Increase vertical movement

  for (let i = 0; i < maxAttempts; i++) {
    const newPosition = {
      x: originalPosition.x + Math.cos(angle) * distance,
      y: originalPosition.y + Math.sin(angle) * distance * verticalBias,
    };

    let overlaps = false;
    for (let j = 0; j < photos.value.length; j++) {
      if (j !== photoIndex) {
        if (
          doPhotosOverlap(
            newPosition.x,
            newPosition.y,
            photo.width,
            photo.height,
            photos.value[j].position.x,
            photos.value[j].position.y,
            photos.value[j].width,
            photos.value[j].height,
          )
        ) {
          overlaps = true;
          break;
        }
      }
    }

    if (!overlaps) return newPosition;

    distance += 30;
    angle += angle < 0 ? 0.1 : 0.3; // Faster angle change for downward positions
  }

  return {
    x: originalPosition.x + Math.cos(angle) * distance,
    y: originalPosition.y + Math.sin(angle) * distance * verticalBias,
  };
}

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
  photoElements.value.forEach((element, index) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      photos.value[index].width = rect.width;
      photos.value[index].height = rect.height;
    }
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
