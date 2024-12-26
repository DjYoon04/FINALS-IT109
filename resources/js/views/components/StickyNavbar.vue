<template>
  <nav
    class="sticky top-0 z-10 py-4 px-5 lg:px-8 backdrop-filter backdrop-blur-lg transition-colors duration-300 bg-white shadow-xl font-sans font-semibold">
    <div class="flex items-center justify-between text-blue-gray-900">
      <div class="flex items-center cursor-pointer">
        <GraduationCap class="w-12 h-12 text-teal-600 mr-1" />
        <h1 class="text-2xl md:text-2xl font-bold py-1 text-emerald-800">TutorHive</h1>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden lg:block">
          <ul class="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li v-for="item in navItems" :key="item.id" class="p-1 font-normal">
              <a @click="scrollToSection(item.id)" class="flex items-center text-blue-gray-900 cursor-pointer text-emerald-700 hover:text-emerald-600 font-semibold">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>
        <div class="hidden sm:ml-2 sm:flex sm:items-center pr-3">
          <!-- Sign In / Sign Up buttons -->
          <router-link
            :to="{ name: 'Auth' }"
            class="mr-4 rounded-lg text-emerald-700 hover:text-emerald-600"
          >
            Login
          </router-link>
          <router-link
            :to="{ name: 'Auth' }"
            class="mx-2 rounded-xl bg-teal-700 hover:bg-emerald-600 text-white p-2 px-3"
          >
            Sign up
          </router-link>
        </div>
        <button
          class="lg:hidden p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          @click="toggleNav"
        >
          <svg v-if="openNav" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="openNav" class="lg:hidden mt-2">
      <ul class="mt-2 mb-4 flex font-bold flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <li v-for="item in navItems" :key="item.id" class="p-1 font-normal">
          <a @click="scrollToSection(item.id)" class="flex items-center text-blue-gray-900 cursor-pointer">
            {{ item.name }}
          </a>
        </li>
      </ul>
      <div class="flex flex-col gap-2 px-1">
        <router-link
            :to="{ name: 'Auth' }"
            class="block py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Log In
          </router-link>
          <router-link
            :to="{ name: 'Auth' }"
            class="block py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Sign Up
          </router-link>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { GraduationCap } from 'lucide-vue-next'


const openNav = ref(false);
const navbarOpacity = ref(1);
const navItems = [
  { id: 'home', name: 'Home' },
  { id: 'tutors', name: 'Tutors' },
  { id: 'about', name: 'About' },
  { id: 'faq', name: 'FAQ' }
];

const showSignin = ref(false);
const showSignup = ref(false); 

const toggleNav = () => {
  openNav.value = !openNav.value;
};

const handleScroll = () => {
  const scrollY = window.scrollY;
  navbarOpacity.value = scrollY > 50 ? 0.75 : 1;
};

const handleResize = () => {
  if (window.innerWidth >= 960) openNav.value = false;
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  openNav.value = false; // Close mobile menu after clicking
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
a {
  position: relative;
}

a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: #036e6e; /* Underline color */
  left: 50%;
  bottom: -4px;
  transition: width 0.3s ease, left 0.3s ease;
}

a:hover::after {
  width: 100%;
  left: 0;
}
</style>