<template>
  <section id="home" class="min-h-screen flex items-center">
    <transition name="fade-slide">
      <div class="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-cyan-950 via-emerald-600 to-white-100 w-full">
        <!-- Image Section -->
        <div class="w-full md:w-1/2 order-2 md:order-1">
          <img :src="tutorImage" alt="Tutor illustration" class="w-full h-full object-cover" />
        </div>
        
        <!-- Text Section -->
        <div class="w-full md:w-1/2 order-1 md:order-2 text-center px-4 sm:px-6 md:px-8 py-8 md:py-0 flex flex-col justify-center items-center h-full">
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-bold text-white mb-4 font-serif leading-tight">
            Level Up Your Learning!
          </h1>
          <p class="text-lg sm:text-xl md:text-2xl text-white italic mb-6 max-w-2xl">
            Connect with experienced university students for one-on-one support, anytime, anywhere. Let's unlock your full potential together!
          </p>
          <!-- Centered Button -->
          <div class="flex justify-center">
            <router-link
              :to="{ name: 'Auth', query: { mode: 'signin' } }"
              class="sm:text-lg rounded-xl shadow-xl font-medium hover:text-white text-white p-2 px-8 bg-gradient-to-br from-emerald-600 to-teal-500 focus:ring-2 ring-emerald-700 transition ease-in-out hover:scale-105 text-center"
            >
              Get Started!
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>


<script setup>
import { ref } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

// Importing the image
const tutorImage = '/img/tutor.PNG';

// Define props
const props = defineProps({
  scrollOffset: {
    type: Number,
    default: 0
  }
});

// Scroll to section function
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const yOffset = -props.scrollOffset; 
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
};
</script>

<style scoped>
/* Optional CSS for animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>