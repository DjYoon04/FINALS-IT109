<template>
  <div>
    <!-- FAQ Section (Replacing Featured Tutors) -->
    <section id="faq"
    class="mb-6 bg-white p-6 rounded-lg shadow-md mx-6 mt-44">
      <h2 class="text-3xl md:text-3xl font-bold mb-6 text-center text-emerald-900 mt-12">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 pb-4">
          <button 
            @click="toggleFAQ(index)" 
            class="flex justify-between items-center w-full text-left"
          >
            <span class="text-lg font-medium text-emerald-800">{{ faq.question }}</span>
            <ChevronDown 
              :class="{'transform rotate-180': faq.isOpen}"
              class="w-5 h-5 text-emerald-600 transition-transform duration-300"
            />
          </button>
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <p v-if="faq.isOpen" class="mt-2 text-gray-600">
              {{ faq.answer }}
            </p>
          </transition>
        </div>
      </div>
    </section>

 <!-- Call to Action (CTA) Section -->
 <section class="mb-6 text-center py-8 px-4 bg-gradient-to-r from-emerald-50 to-cyan-50">
      <h2 class="text-2xl md:text-3xl font-bold mb-4 text-emerald-900">
        Join TutorHive Today!
      </h2>
      <p class="text-sm md:text-base mb-4 max-w-2xl mx-auto">
        Ready to take your learning to the next level? Sign up to find the perfect tutor and unlock your full potential!
      </p>
    </section>

    <!-- Footer Section -->
    <footer class="border-t pt-8 px-4 py-6 bg-gradient-to-br from-cyan-950 to-emerald-800 text-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          <!-- Column 1: Get in Touch -->
          <div>
            <h3 class="font-semibold mb-4">Get in Touch</h3>
            <ul class="space-y-2">
              <li><a href="/contact" class="hover:underline">Contact Us</a></li>
              <li class="flex justify-center sm:justify-start space-x-4 mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook class="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter class="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin class="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 2: Explore More -->
          <div>
            <h3 class="font-semibold mb-4">Explore More</h3>
            <ul class="space-y-2">
              <li><a href="/about" class="hover:underline">About Us</a></li>
              <li><a href="/faq" class="hover:underline">FAQ</a></li>
              <li><a href="/privacy" class="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" class="hover:underline">Terms of Service</a></li>
            </ul>
          </div>

          <!-- Column 3: Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="/find-tutors" class="hover:underline">Find Tutors</a></li>
              <li><a href="/pricing" class="hover:underline">Pricing</a></li>
              <li><a href="/become-tutor" class="hover:underline">Become a Tutor</a></li>
              <li><a href="/resources" class="hover:underline">Learning Resources</a></li>
            </ul>
          </div>

          <!-- Column 4: TutorHive Info -->
          <div>
            <h3 class="font-semibold mb-4">TutorHive</h3>
            <p class="text-sm text-gray-300 mb-4">
              Empowering students to achieve their academic goals through personalized tutoring.
            </p>
            <p class="text-xs text-gray-400">&copy; {{ currentYear }} TutorHive. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
  <Signup :isVisible="showSignup" @close="showSignup = false" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Facebook, Twitter, Linkedin } from 'lucide-vue-next'

const showSignup = ref(false); 
const currentYear = computed(() => new Date().getFullYear())

const faqs = ref([
  {
    question: "How does TutorHive work?",
    answer: "TutorHive connects students with peer tutors from the same university. You can search for tutors who specialize in the subject you need help with, view their profiles, and book sessions directly through the platform.",
    isOpen: false
  },
  {
    question: "How do I find a tutor for my subject?",
    answer: "Use the search function to filter tutors by subject, course code, or availability. You'll see profiles of tutors who have successfully completed the same courses you're taking.",
    isOpen: false
  },
  {
    question: "Can I cancel or reschedule a session?",
    answer: "Yes, you can cancel or reschedule sessions, but it's courteous to notify the tutor as soon as possible to allow them to adjust their schedule.",
    isOpen: false
  },
  {
    question: "Is online tutoring available?",
    answer: "Yes, many of the tutors offer both online and in-person sessions. You can select your preference when booking a session.",
    isOpen: false
  }
])

const toggleFAQ = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>