<template>
  <div>
    <Transition name="fade">
      <div v-show="photoPositionsLoaded">
        <div v-for="(photo, index) in photos" :class="photo.rotate">
          <img :key="index" :src="photo.src" :srcset="photo.srcset" ref="draggablePhoto"
            :style="{ left: photo.position.x + 'px', top: photo.position.y + 'px' }"
            @mousedown="startDragging(index, $event)" @mousemove="drag($event)" @mouseup="stopDragging"
            @mouseleave="leaveDragging(index)" class="absolute border-4 border-white transition select-none" :class="[
              isDragging ? 'cursor-grabbing' : 'cursor-grab',
              shouldApplyEffect(index) ? 'shadow-2xl scale-110' : 'shadow scale-100',
            ]">
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      photos: [
        { src: 'img/3.png', srcset: 'img/3@2x.png 2x, img/3@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-1' },
        { src: 'img/2.png', srcset: 'img/2@2x.png 2x, img/2@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: 'rotate-6' },
        { src: 'img/1.png', srcset: 'img/1@2x.png 2x, img/1@3x.png 3x', position: { x: 0, y: 0 }, width: null, height: null, rotate: '-rotate-2' },
      ],
      isDragging: false,
      draggedPhotoIndex: null,
      offset: { x: 0, y: 0 },
      photoPositionsLoaded: false,
    };
  },
  mounted() {
    // if (localStorage.photos) {
    //   this.photos = JSON.parse(localStorage.photos);
    // }
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
      // localStorage.setItem("photos", JSON.stringify(this.photos));

      // Stop dragging
      this.isDragging = false;
      this.draggedPhotoIndex = null;
    },
    leaveDragging(index) {
      if (this.isDraggedPhoto(index) && this.isNotBehindOtherPhotos(index)) {
        this.stopDragging();
        // BUG: When leave dragging on a photo that is behind another photo
      }
    },
    drag(event) {
      event.preventDefault();

      // Escape if not dragging
      if (!this.isDragging) {
        return false;
      }

      // Update X and Y position
      const newPosition = {
        x: event.clientX + this.offset.x,
        y: event.clientY + this.offset.y,
      };
      this.photos[this.draggedPhotoIndex].position = newPosition;

      // Could we move the moving to top here to make shouldApplyEffect cleaner?
    },
    shouldApplyEffect(index) {
      if (this.isDraggedPhoto(index) && this.isNotBehindOtherPhotos(index)) {
        this.moveDraggedPhotoToTop();
        return true;
      }
    },
    moveDraggedPhotoToTop() {
      // If dragged photo is not already at the top
      if (this.draggedPhotoIndex !== this.photos.length - 1) {
        // Push dragged photo to be last in the array
        const draggedPhoto = this.photos.splice(this.draggedPhotoIndex, 1)[0];
        this.photos.push(draggedPhoto);

        // Update the draggedPhotoIndex to the new index
        this.draggedPhotoIndex = this.photos.length - 1;
      }
    },
    isNotBehindOtherPhotos(index) {
      const draggedPhoto = this.photos[this.draggedPhotoIndex];
      const otherPhotos = this.photos.filter((_, i) => i !== index);

      for (const photo of otherPhotos) {
        if (
          this.doPhotosOverlap(
            draggedPhoto.position.x,
            draggedPhoto.position.y,
            draggedPhoto.width,
            draggedPhoto.height,
            photo.position.x,
            photo.position.y,
            photo.width,
            photo.height
          ) && index < this.photos.indexOf(photo) // Is dragged photo lower in array than overlapping photos
        ) {
          return false; // Dragged photo is behind another photo
        }
      }
      return true; // Dragged photo is not behind another photo
    },
    isDraggedPhoto(index) {
      if (index === this.draggedPhotoIndex) {
        return true;
      }
      return false;
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
        // const photoElements = this.$el.querySelectorAll('.draggable-photo');
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