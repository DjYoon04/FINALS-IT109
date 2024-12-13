<template>
<section id="tutors">
  <div class="bg-white px-4 py-8 md:py-12 text-center">
    <h1
      class="text-3xl md:text-5xl font-bold text-emerald-900 pb-2"
      :class="{ 'fade-up': isVisible }"
    >
      Find Your Perfect Tutor
    </h1>
    <p
      class="text-lg md:text-xl text-emerald-900 px-4 md:px-12 pt-2 mb-8"
      :class="{ 'fade-up': isVisible }"
    >
      Partner with university students for personalized tutoring, available whenever and wherever you need it. Achieve your academic goals with expert help at your side!
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-12">
      <div
        class="p-4 bg-emerald-100 rounded-md shadow-md transition ease-in-out hover:scale-105 hover:bg-[#7ef4de]"
        :class="{ 'fade-up': isVisible }"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-emerald-900 mb-2">
          Expert Tutors
        </h2>
        <p class="text-base md:text-lg text-emerald-800">
          Connect with top university students who are passionate about teaching and ready to help you succeed.
        </p>
      </div>
      <div
        class="p-4 bg-emerald-100 rounded-md shadow-md transition ease-in-out hover:scale-105 hover:bg-[#7ef4de]"
        :class="{ 'fade-up': isVisible }"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-emerald-900 mb-2">
          Flexible Scheduling
        </h2>
        <p class="text-base md:text-lg text-emerald-800">
          Book tutoring sessions at times that work for you, from anywhere, on any device.
        </p>
      </div>
      <div
        class="p-4 bg-emerald-100 rounded-md shadow-md transition ease-in-out hover:scale-105 hover:bg-[#7ef4de]"
        :class="{ 'fade-up': isVisible }"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-emerald-900 mb-2">
          Tailored Learning
        </h2>
        <p class="text-base md:text-lg text-emerald-800">
          Receive personalized tutoring that’s tailored to your learning style and academic goals.
        </p>
      </div>
    </div>
  </div>
</section>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

// Fade up on scroll
const fadeUp = () => {
  const options = {
    root: null,
    threshold: 0.2,
  };

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      } else {
        isVisible.value = false; // Optional: reset visibility when scrolling back
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  const elementsToObserve = document.querySelectorAll('.fade-up');
  elementsToObserve.forEach(element => observer.observe(element));
};

onMounted(() => {
  fadeUp();
});
</script>

<style scoped>
.fade-up {
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  opacity: 0;
  transform: translateY(50px);
}

.fade-up.active {
  opacity: 1;
  transform: translateY(0);
}
</style>
