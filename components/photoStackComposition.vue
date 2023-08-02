<template>
  <Transition name="fade">
    <div v-show="photoPositionsLoaded" class="relative" @mouseenter.once="updatePhotoDimensions">
      <img v-for="(photo, index) in photos" :key="index" :src="photo.src" :srcset="photo.srcset" ref="photoElements"
        :style="{ left: photo.position.x + 'px', top: photo.position.y + 'px', zIndex: photo.zIndex }"
        @mousedown="dragPhoto(index, $event)" @mouseenter="showCaption(index, $event)" @mouseleave="removeCaption"
        class="absolute border-4 border-white transition select-none" :class="[photo.rotate,
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        isNotBehindOtherPhotos(index) ? 'shadow-2xl scale-110' : 'shadow scale-100',
        ]">
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';

// Global data
const photos = ref([
  { src: 'img/3.png', srcset: 'img/3@2x.png 2x, img/3@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-1', zIndex: 0, caption: 'Lemon trees in Mallorca' },
  { src: 'img/2.png', srcset: 'img/2@2x.png 2x, img/2@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-6', zIndex: 1, caption: 'My son Eik' },
  { src: 'img/1.png', srcset: 'img/1@2x.png 2x, img/1@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: '-rotate-2', zIndex: 2, caption: 'Me, happy at a concert' },
]);
let draggedPhotoIndex = ref(null);
let photoPositionsLoaded = ref(false);
let isDragging = false;

function showCaption(index, event) {
  if (isDragging) {
    return false;
  }

  // Create a new div element
  const newDiv = document.createElement("div");
  newDiv.setAttribute('id', 'caption');
  newDiv.setAttribute('class', 'absolute bg-black text-white text-sm whitespace-nowrap px-3 py-1 z-[99999] rounded-full shadow-xl');

  // Add text to the div
  const newContent = document.createTextNode(photos.value[index].caption);
  newDiv.appendChild(newContent);

  // Add div to the DOM
  document.body.appendChild(newDiv);

  const onMouseMove = (e) => {
    newDiv.style.left = e.pageX + 16 + 'px';
    newDiv.style.top = e.pageY - 32 + 'px';
  }
  document.addEventListener('mousemove', onMouseMove);
}

function removeCaption() {
  const caption = document.getElementById("caption");
  caption.remove();
}

// On mounted
onMounted(() => {
  if (localStorage.photos) {
    photos.value = JSON.parse(localStorage.photos);
  }
  photoPositionsLoaded.value = true;
})

// Drag
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
  document.addEventListener('mousemove', movePhoto);

  // Drop the photo
  document.onmouseup = function () {
    // Save positions 
    localStorage.setItem("photos", JSON.stringify(photos.value));

    // Reset variables and remove event listener
    isDragging = false;
    draggedPhotoIndex.value = null;
    document.removeEventListener('mousemove', movePhoto);
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
    if (doPhotosOverlap(
      draggedPhoto.position.x,
      draggedPhoto.position.y,
      draggedPhoto.width,
      draggedPhoto.height,
      otherPhoto.position.x,
      otherPhoto.position.y,
      otherPhoto.width,
      otherPhoto.height
    ) && draggedPhoto.zIndex < otherPhoto.zIndex) {
      return false
    }
  }

  // Dragged photo is not behind another photo
  return true;
}

function doPhotosOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
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
  transition: opacity 0.150s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
