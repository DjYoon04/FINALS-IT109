<template>
  <div class="min-h-screen flex flex-col">
    <StickyNavbar :sections="sections" :scrollToSection="scrollToSection" />
    <main class="flex-grow">
      <section id="home" class="w-full">
        <HeroSection />
      </section>
      <section id="find-your-tutor" class="w-full py-12 md:py-24">
        <FindYourTutor />
      </section>
      <section id="tutors" class="w-full bg-emerald-50 px-4 py-12 md:py-24">
        <h3 class="text-3xl md:text-4xl text-center font-bold text-emerald-900 mb-8">
          Featured Tutors
        </h3>
        <TutorList :tutors="tutors" />
      </section>
      <section id="how-it-works" class="w-full py-12 md:py-24">
        <HowItWorks />
      </section>
      <section id="contact" class="w-full py-12 md:py-24">
        <CTAandFooter />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StickyNavbar from './components/StickyNavbar.vue';
import HeroSection from './components/HeroSection.vue';
import TutorList from './components/TutorList.vue';
import FindYourTutor from './components/FindYourTutor.vue';
import CTAandFooter from './components/CTAandFooter.vue';
import HowItWorks from './components/HowItWorks.vue';

// Import images for tutors
import jelatImage from '../views/img/jelat.jpg';
import jijiImage from '../views/img/jiji.jpg';
import jeraImage from '../views/img/jera.png';
import tinaImage from '../views/img/tina.png';

const router = useRouter();

const navigateToAuth = (mode) => {
  router.push({ name: 'Auth', query: { mode } });
};

// Define the list of tutors
const tutors = ref([
  { name: "Jelli Uayan", expertise: "Mathematics", rating: 4.8, reviews: 42, image: jelatImage },
  { name: "Jeseca Ruelan", expertise: "Physics", rating: 4.6, reviews: 38, image: jijiImage },
  { name: "Jera Acero", expertise: "Chemistry", rating: 4.9, reviews: 55, image: jeraImage },
  { name: "Cristina Repollo", expertise: "Biology", rating: 4.7, reviews: 31, image: tinaImage },
]);

// Define the sections for the navbar
const sections = ref([
  { id: 'home', label: 'Home' },
  { id: 'find-your-tutor', label: 'Find Your Tutor' },
  { id: 'tutors', label: 'Tutors' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'contact', label: 'Contact' },
]);

// Define the scrollToSection method
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>