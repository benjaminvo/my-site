<template>
  <Transition name="fade">
    <div class="relative">
      <img v-for="(photo, index) in photos" :key="index" :src="photo.src" :srcset="photo.srcset" ref="photo"
        :style="{ left: photo.position.x + 'px', top: photo.position.y + 'px', zIndex: photo.zIndex }"
        @mousedown="startDragging(index, $event)" @mousemove.prevent="drag(index)" @mouseup="stopDragging(index)"
        @mouseleave="leaveDragging(index)" class="absolute border-4 border-white transition select-none" :class="[photo.rotate,
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        isNotBehindOtherPhotos(index) ? 'shadow-2xl scale-110' : 'shadow scale-100',
        ]">
    </div>
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      photos: [
        { src: 'img/3.png', srcset: 'img/3@2x.png 2x, img/3@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-1', zIndex: 0 },
        { src: 'img/2.png', srcset: 'img/2@2x.png 2x, img/2@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-6', zIndex: 0 },
        { src: 'img/1.png', srcset: 'img/1@2x.png 2x, img/1@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: '-rotate-2', zIndex: 0 },
      ],
      offset: { x: 0, y: 0 },
      draggedPhotoIndex: null,
      draggedPhotoZIndexUpdated: false,
      photoPositionsLoaded: false,
      isDragging: false,
    };
  },
  mounted() {
    if (localStorage.photos) {
      this.photos = JSON.parse(localStorage.photos);
    }
    this.photoPositionsLoaded = true;
    this.updatePhotoDimensions();
  },
  methods: {
    startDragging(index, event) {
      this.isDragging = true;
      this.draggedPhotoIndex = index;

      // Set initial offset
      this.offset = {
        x: this.photos[this.draggedPhotoIndex].position.x - event.clientX,
        y: this.photos[this.draggedPhotoIndex].position.y - event.clientY,
      };
    },
    stopDragging() {
      // Save positions 
      localStorage.setItem("photos", JSON.stringify(this.photos));

      // Reset
      this.isDragging = false;
      this.draggedPhotoIndex = null;
      this.draggedPhotoZIndexUpdated = false;
    },
    leaveDragging(index) {
      if (this.isNotBehindOtherPhotos(index)) {
        this.stopDragging();
        // BUGS: 
        // 1) When leave dragging on a photo that is behind another photo.
        // 2) Clone of photo appears because of browser's native drag and drop
      }
    },
    drag(index) {

      // Don't update positions if dragging has ended
      if (!this.isDragging) {
        return false;
      }

      // Update position
      const newPosition = {
        x: event.clientX + this.offset.x,
        y: event.clientY + this.offset.y,
      };
      this.photos[this.draggedPhotoIndex].position = newPosition;

      // Update the z-index of the dragged photo to bring it to the top
      if (this.isNotBehindOtherPhotos(index) && this.draggedPhotoZIndexUpdated == false) {
        this.photos[this.draggedPhotoIndex].zIndex = this.getMaxZIndex() + 1;
        this.draggedPhotoZIndexUpdated = true;
      }
    },
    getMaxZIndex() {
      return Math.max(...this.photos.map((photo) => photo.zIndex));
    },
    isNotBehindOtherPhotos(index) {

      // Make sure this is the dragged photo
      if (index !== this.draggedPhotoIndex) {
        return false;
      }

      // Check if the dragged photo 1) overlaps another photo, and 2) has a lower z-index than that photo
      const draggedPhoto = this.photos[index];
      const otherPhotos = this.photos.filter((_, i) => i !== index);

      for (const otherPhoto of otherPhotos) {
        if (this.doPhotosOverlap(
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
    },
    doPhotosOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
      return (
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
      );
    },
    updatePhotoDimensions() {
      this.$nextTick(() => {
        const photoElements = this.$refs.photo;
        photoElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          this.photos[index].width = rect.width;
          this.photos[index].height = rect.height;
        });
      });
    },
  },
};
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
