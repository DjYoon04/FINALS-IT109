<template>
    <section id="about"
    class="py-24 px-4 md:px-8">
      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4 text-emerald-900 pb-14 mt-5">
        How TutorHive Works
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md transition ease-in-out hover:scale-105 hover:bg-[#c3f7dd]"
        >
          <div class="bg-emerald-500 text-white rounded-full p-4 mb-4">
            <component :is="step.icon" class="h-8 w-8" />
          </div>
          <h3 class="font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-600">{{ step.description }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { MagnifyingGlassIcon, CalendarIcon, ComputerDesktopIcon, TrophyIcon } from '@heroicons/vue/24/outline';
  
  const steps = [
    {
      title: 'Find a Tutor',
      icon: MagnifyingGlassIcon,
      description: 'Browse or search for the perfect tutor based on your needs.',
    },
    {
      title: 'Book a Session',
      icon: CalendarIcon,
      description: 'Check availability and book online.',
    },
    {
      title: 'Start Learning',
      icon: ComputerDesktopIcon,
      description: 'Meet your tutor and get one-on-one help.',
    },
    {
      title: 'Track Your Progress',
      icon: TrophyIcon,
      description: 'Monitor your academic improvements over time.',
    },
  ];
  </script>
  
  <style scoped>
  /* Add any scoped styles if necessary */
  </style>
  