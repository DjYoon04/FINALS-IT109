<template>
  <div class="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
    <div class="bg-white rounded-lg shadow-md p-5 h-full transition ease-in-out hover:scale-105 mt-2">
      <div class="flex items-center mb-4">
        <!-- Using the tutor image -->
        <img :src="tutor.image" :alt="tutor.name" class="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 class="font-bold">{{ tutor.name }}</h4>
          <p class="text-sm text-gray-600">{{ tutor.expertise }}</p>
        </div>
      </div>
      <div class="flex items-center mb-2">
        <span class="text-yellow-400">
          <template v-for="star in Math.floor(tutor.rating)" :key="star">
            ★
          </template>
          <template v-for="star in 5 - Math.floor(tutor.rating)" :key="star">
            ☆
          </template>
        </span>
        <span class="text-sm text-gray-600 ml-2">
          {{ tutor.rating }} ({{ tutor.reviews }} reviews)
        </span>
      </div>
      <p class="text-sm text-gray-700 mb-4">
        Experienced tutor specializing in {{ tutor.expertise.toLowerCase() }} with a passion for helping students succeed.
      </p>
      <div class="flex items-center text-sm text-gray-600 mb-2">
        <MapPinIcon class="h-4 w-4 mr-2" />
        <span>Campus Location</span>
      </div>
      <div class="flex items-center text-sm text-gray-600 mb-4">
        <ClockIcon class="h-4 w-4 mr-2" />
        <span>Flexible Hours</span>
      </div>
      <div class="bg-gray-100 rounded p-3 mb-4">
        <h5 class="font-semibold mb-1 flex items-center">
          <ChatBubbleLeftIcon class="h-4 w-4 mr-2" />
          Latest Review
        </h5>
        <p class="text-sm text-gray-700">"Great tutor! Very patient and explains concepts clearly."</p>
      </div>
      <div class="flex space-x-2">
        <button class="flex-1 text-xs border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-100 transition ease-in-out hover:scale-105">
          <UserIcon class="h-4 w-4 mr-1" />
          View Profile
        </button>
        <button class="flex-1 text-xs bg-emerald-600 text-white rounded-md py-2 px-3 flex items-center justify-center hover:bg-emerald-700 transition ease-in-out hover:scale-105">
          <BookOpenIcon class="h-4 w-4 mr-1" />
          Book Session
        </button>
        <button class="px-2 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition ease-in-out hover:scale-105">
          <EnvelopeIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, ClockIcon, ChatBubbleLeftIcon, UserIcon, BookOpenIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';

// Props
defineProps({
  tutor: {
    type: Object,
    required: true
  }
});
</script>