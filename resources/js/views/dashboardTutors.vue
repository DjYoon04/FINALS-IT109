<template>
  <div
    class="flex h-screen flex-col bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-800"
  >
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar for larger screens -->
      <aside
        class="w-64 px-6 pt-8 flex-col hidden lg:flex bg-white bg-opacity-15 backdrop-blur-lg rounded-ee-full"
      >
        <div class="flex items-center space-x-3 cursor-pointer">
          <GraduationCap class="w-12 h-12 text-white" />
          <span class="font-bold text-3xl text-white">TutorHive</span>
        </div>
        <nav class="space-y-2 mt-6">
          <a
            v-for="item in navItems"
            :key="item.name"
            href="#"
            class="flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors duration-200 ease-in-out"
            :class="{ 'bg-white bg-opacity-15': currentSection === item.section }"
            @click.prevent="currentSection = item.section"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="font-medium">{{ item.name }}</span>
          </a>
        </nav>
        <div class="mt-44 mb-8">
          <button
            @click="isProfileOpen = true"
            class="flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors duration-200 ease-in-out hover:bg-white hover:bg-opacity-20 w-full"
          >
            <SettingsIcon class="h-5 w-5" />
            <span class="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile header -->
        <header
          class="lg:hidden bg-white backdrop-blur-lg p-4 flex justify-between items-center"
        >
          <span class="font-bold text-2xl text-emerald-700">TutorHive</span>
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-emerald-700">
            <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </button>
        </header>

        <!-- Mobile menu -->
        <nav
          v-if="isMobileMenuOpen"
          class="lg:hidden bg-white bg-opacity-20 backdrop-blur-lg p-4 overflow-y-auto"
        >
          <div class="flex flex-col items-center mb-6">
            <div
              class="relative h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white"
            >
              <img
                :src="Studentimg"
                alt="Profile picture"
                class="h-full w-full object-cover"
              />
            </div>
            <h2 class="text-xl font-semibold text-white">Bernie Cherry D. Rante</h2>
            <p class="text-sm text-white text-opacity-80">Student</p>
          </div>
          <div class="space-y-2">
            <a
              v-for="item in navItems"
              :key="item.name"
              href="#"
              class="flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors duration-200 ease-in-out"
              :class="{ 'bg-white bg-opacity-20': currentSection === item.section }"
              @click.prevent="
                currentSection = item.section;
                isMobileMenuOpen = false;
              "
            >
              <component :is="item.icon" class="h-5 w-5" />
              <span class="font-medium">{{ item.name }}</span>
            </a>
            <button
              @click="
                isProfileOpen = true;
                isMobileMenuOpen = false;
              "
              class="flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-colors duration-200 ease-in-out hover:bg-white hover:bg-opacity-20 w-full"
            >
              <SettingsIcon class="h-5 w-5" />
              <span class="font-medium">Settings</span>
            </button>
          </div>
        </nav>

        <main class="flex-1 overflow-y-auto p-6 sm:p-8">
          <div
            class="bg-gradient-to-br from-emerald-400 via-teal-600 to-cyan-700 backdrop-blur-lg rounded-[40px] p-3 shadow-2xl h-full"
          >
            <!--Dashboard-->
            <template v-if="currentSection === 'dashboard'">
              <dashboardhomeT />
            </template>

            <!--Profile-->
            <template v-if="currentSection === 'profile'">
              <TutorProfile />
            </template>

            <!--Schedule-->
            <template v-if="currentSection === 'appointments'">
              <tappointments />
            </template>
          </div>
        </main>
      </div>
    </div>

    <!-- Settings -->
    <div v-if="isProfileOpen" class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="isProfileOpen = false"
        ></div>
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="w-screen max-w-md">
            <div
              class="h-full flex flex-col bg-white shadow-xl rounded-l-xl overflow-hidden"
            >
              <div class="flex-1 h-0 overflow-y-auto">
                <header class="p-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                  <div class="flex justify-between items-center">
                    <h2 class="text-lg font-medium text-white">Profile Settings</h2>
                    <button
                      @click="isProfileOpen = false"
                      class="text-white hover:text-gray-200"
                    >
                      <XIcon class="h-6 w-6" />
                    </button>
                  </div>
                  <div class="flex flex-col items-center mt-6">
                    <div
                      class="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white"
                    >
                      <img
                        :src="Studentimg"
                        alt="Profile picture"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <h2 class="mt-4 text-xl font-semibold text-white">Djeah A. Tabada</h2>
                    <p class="text-sm text-white text-opacity-80">Tutor</p>
                  </div>
                </header>
                <!-- Navigation -->
                <nav class="mt-6 px-6">
                  <ul class="space-y-2">
                    <li>
                      <button
                        @click="openHelpSupport"
                        class="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                      >
                        <HelpCircleIcon class="h-5 w-5" />
                        <span class="font-medium">Help & Support</span>
                      </button>
                    </li>
                    <li>
                      <button
                        @click="logOut"
                        class="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 ease-in-out"
                      >
                        <LogOutIcon class="h-5 w-5" />
                        <span class="font-medium">Log Out</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Help & Support Modal -->
    <div v-if="isHelpSupportOpen" class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="isHelpSupportOpen = false"
        ></div>
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col bg-white shadow-xl rounded-l-xl">
              <header
                class="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 flex justify-between items-center"
              >
                <button
                  @click="
                    isHelpSupportOpen = false;
                    isProfileOpen = true;
                  "
                  class="text-white hover:text-gray-200"
                >
                  <ArrowLeftIcon class="h-5 w-5" />
                </button>
                <h2 class="text-lg font-medium text-white">Help & Support</h2>
                <button
                  @click="isHelpSupportOpen = false"
                  class="text-white hover:text-gray-200"
                >
                  <XIcon class="h-6 w-6" />
                </button>
              </header>
              <div class="flex-1 h-0 overflow-y-auto p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h3>
                <ul class="space-y-6">
                  <li>
                    <h4 class="text-lg font-medium text-gray-900">
                      How do I book a tutor?
                    </h4>
                    <p class="mt-2 text-gray-600">
                      You can book a tutor by navigating to the "Find a Tutor" section and
                      selecting an available time slot. Choose your preferred tutor and
                      subject, then confirm your booking.
                    </p>
                  </li>
                  <li>
                    <h4 class="text-lg font-medium text-gray-900">
                      How do I cancel a session?
                    </h4>
                    <p class="mt-2 text-gray-600">
                      To cancel a session, go to your "Appointments" and click on the
                      cancel button next to the relevant session. Please note our
                      cancellation policy for any applicable fees.
                    </p>
                  </li>
                  <li>
                    <h4 class="text-lg font-medium text-gray-900">
                      How can I contact support?
                    </h4>
                    <p class="mt-2 text-gray-600">
                      For additional support, please email us at
                      <a
                        href="mailto:support@tutorhive.com"
                        class="text-emerald-600 hover:text-emerald-700 transition duration-200 ease-in-out"
                        >support@tutorhive.com</a
                      >
                      or use the chat feature in the bottom right corner of the screen.
                      Our support team is available 24/7 to assist you with any questions
                      or concerns you may have.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase } from "@/supabaseClient"; // Adjust the import to your Supabase client location
import { ref } from "vue";
import {
  BookCheck,
  CircleUserRound,
  HomeIcon,
  GraduationCap,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ArrowLeftIcon,
} from "lucide-vue-next";
import tappointments from "./components/tappointments.vue";
import dashboardhomeT from "./components/dashboardhomeT.vue";
import TutorProfile from "./components/TutorProfile.vue";

const Studentimg = "/img/bernielat.jpg";
const isProfileOpen = ref(false);
const isMobileMenuOpen = ref(false);
const currentSection = ref("dashboard");

const isHelpSupportOpen = ref(false);

const navItems = [
  { name: "Dashboard", section: "dashboard", icon: HomeIcon },
  { name: "Profile", section: "profile", icon: CircleUserRound },
  { name: "Appointments", section: "appointments", icon: BookCheck },
];

const openHelpSupport = () => {
  isHelpSupportOpen.value = true;
  isProfileOpen.value = false;
};

// Logout function
const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    } else {
      alert("Successfully logged out!");
      // Optionally redirect the user to the AuthPage or Home
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Unexpected error during logout:", error.message);
    alert("An unexpected error occurred. Please try again.");
  }
};
</script>

<style>
/* Add any additional styles here */
</style>
