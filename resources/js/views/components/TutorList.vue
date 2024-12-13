<template>
  <section>
    <div class="bg-emerald-50 pt-8">
      <swiper
        :slides-per-view="slidesPerView"
        :space-between="30"
        :pagination="{ clickable: true }"
        :modules="modules"
        @slideChange="onSlideChange"
        class="featured-tutors-swiper"
      >
        <swiper-slide v-for="(tutor, index) in tutors" :key="index">
          <TutorCard :tutor="tutor" />
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TutorCard from "./TutorCard.vue";

const props = defineProps({
  tutors: {
    type: Array,
    required: true,
  },
});

// Reactive reference to manage the number of visible slides
const slidesPerView = ref(3);

// Swiper modules
const modules = [Pagination];

// Function to determine slides per view based on window size
const updateSlidesPerView = () => {
  if (window.innerWidth < 576) {
    slidesPerView.value = 1;
  } else if (window.innerWidth < 768) {
    slidesPerView.value = 2;
  } else {
    slidesPerView.value = 3;
  }
};

// Handle window resize to update the slides per view
onMounted(() => {
  updateSlidesPerView();
  window.addEventListener("resize", updateSlidesPerView);
});

// Cleanup the event listener on unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSlidesPerView);
});

// Function to handle slide change events
const onSlideChange = (swiper) => {
  console.log("Slide changed to:", swiper.activeIndex);
};
</script>

<style scoped>
.featured-tutors-swiper {
  padding-bottom: 40px; /* Add space for pagination dots */
}

:deep(.swiper-pagination) {
  bottom: 0;
}

:deep(.swiper-pagination-bullet) {
  background: #047857; /* Emerald 700 */
  opacity: 0.5;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: #047857; /* Emerald 700 */
  opacity: 1;
  transform: scale(1.2);
}
</style>
