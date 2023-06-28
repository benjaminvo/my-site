<template>
  <div>
    <Transition name="fade">
      <div v-show="photoPositionsLoaded">
        <img v-for="(photo, index) in photos" :key="index" :src="photo.src" :srcset="photo.srcset" ref="draggablePhoto"
          :style="{ left: photo.position.x + 'px', top: photo.position.y + 'px', zIndex: photo.zIndex }"
          @mousedown="startDragging(index, $event)" @mousemove="drag(index, $event)" @mouseup="stopDragging"
          @mouseleave="leaveDragging(index)" class="absolute border-4 border-white transition select-none" :class="[photo.rotate,
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          shouldApplyEffect(index) ? 'shadow-2xl scale-110' : 'shadow scale-100',
          ]">
      </div>
    </Transition>
  </div>
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
      isDragging: false,
      draggedPhotoIndex: null,
      offset: { x: 0, y: 0 },
      photoPositionsLoaded: false,
      zIndexUpdated: false,
    };
  },
  mounted() {
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
      this.zIndexUpdated = false;
      this.isDragging = false;
      this.draggedPhotoIndex = null;
    },
    leaveDragging(index) {
      if (this.isDraggedPhoto(index) && this.isNotBehindOtherPhotos(index)) {
        this.stopDragging();
      }
    },
    drag(index, event) {
      event.preventDefault();

      if (!this.isDragging) {
        return false;
      }

      const newPosition = {
        x: event.clientX + this.offset.x,
        y: event.clientY + this.offset.y,
      };
      this.photos[this.draggedPhotoIndex].position = newPosition;

      // Update the z-index of the dragged photo to bring it to the top
      if (this.isDraggedPhoto(index) && this.isNotBehindOtherPhotos(index) && this.zIndexUpdated == false) {
        this.photos[this.draggedPhotoIndex].zIndex = this.getMaxZIndex() + 1;
        this.zIndexUpdated = true;
      }
    },
    shouldApplyEffect(index) {
      if (this.isDraggedPhoto(index) && this.isNotBehindOtherPhotos(index)) {
        return true;
      }
    },
    getMaxZIndex() {
      return Math.max(...this.photos.map((photo) => photo.zIndex));
    },
    isNotBehindOtherPhotos(index) {
      const draggedPhoto = this.photos[this.draggedPhotoIndex];
      const otherPhotos = this.photos.filter((_, i) => i !== index);

      for (const photo of otherPhotos) {
        if (this.doPhotosOverlap(
          draggedPhoto.position.x,
          draggedPhoto.position.y,
          draggedPhoto.width,
          draggedPhoto.height,
          photo.position.x,
          photo.position.y,
          photo.width,
          photo.height
        ) && index < this.photos.indexOf(photo)) {
          return false;
        }
      }
      return true;
    },
    isDraggedPhoto(index) {
      return index === this.draggedPhotoIndex;
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
        const photoElements = this.$refs.draggablePhoto;
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
