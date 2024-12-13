<template>
  <div class="px-4 md:px-6 bg-white rounded-[30px] shadow-xl overflow-hidden h-full max-h-full pb-2 flex flex-col">
    <h1 class="text-2xl md:text-3xl font-bold text-teal-700 pb-6 pt-4 text-center">Find a Tutor</h1>

    <!-- Search and Filters -->
    <div class="mb-6 max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-grow">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, subject, or expertise"
            class="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @input="filterTutors"
          />
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
        </div>
        <div class="relative">
          <select
            v-model="selectedSubject"
            class="w-full md:w-auto p-2 pl-10 pr-8 border rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="filterTutors"
          >
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
          <BookOpen class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
          <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
        </div>
        <div class="relative">
          <select
            v-model="selectedRating"
            class="w-full md:w-auto p-2 pl-10 pr-8 border rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="filterTutors"
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <Star class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
          <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
        </div>
      </div>
    </div>

    <!-- Tutor Grid with Scrollbar -->
    <div class="flex-grow overflow-hidden">
      <div class="h-full overflow-y-auto pr-4 -mr-4">
        <div v-if="paginatedTutors.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <div
            v-for="tutor in paginatedTutors"
            :key="tutor.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-emerald-100 flex flex-col"
          >
            <div class="p-4 flex-grow flex flex-col">
              <div class="flex items-center mb-4">
                <img 
                  :src="tutor.profilePicture || getAvatarUrl(tutor.name)" 
                  :alt="tutor.name" 
                  class="w-12 h-12 rounded-full object-cover mr-4 cursor-pointer"
                  @click="openImageModal(tutor)"
                />
                <h2 class="text-xl font-semibold text-emerald-800">{{ tutor.name }}</h2>
              </div>
              <p class="text-emerald-600 mb-2 flex items-center">
                <GraduationCap class="mr-2" :size="16" />
                {{ tutor.expertise }}
              </p>
              <p class="text-sm text-gray-600 mb-2">{{ tutor.bio }}</p>
              <div class="flex items-center mb-2 text-yellow-500">
                <Star class="mr-1" :size="16" fill="currentColor" />
                <span>{{ tutor.rating }} ({{ tutor.reviewCount }} reviews)</span>
              </div>
              <p class="text-sm text-gray-600 mb-2 flex items-center">
                <MapPin class="mr-2" :size="16" />
                {{ tutor.location }}
              </p>
              <p class="text-sm text-emerald-600 mb-2 flex items-center">
                <Clock class="mr-2" :size="16" />
                {{ tutor.availability }}
              </p>
              <p class="text-sm text-emerald-500 mb-4 flex items-center">
                <Clock class="mr-2" :size="16" />
                Preferred Time: {{ tutor.preferredTime }}
              </p>
              <div class="mt-auto flex space-x-2">
                <button
                  @click="bookAppointment(tutor.id)"
                  class="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center"
                >
                  <CalendarPlus class="mr-2" :size="20" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>No tutors found matching your criteria.</p>
        </div>
      </div>

      <!-- Image Modal -->
      <TransitionRoot appear :show="!!selectedTutor" as="template">
        <Dialog as="div" @close="closeImageModal" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-50" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-lg text-left align-middle shadow-xl transition-all relative">
                  <!-- Close Button -->
                  <button
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                    @click="closeImageModal"
                  >
                    <XIcon class="w-6 h-6" />
                  </button>
                  <div class="mt-2">
                    <img 
                      :src="selectedTutor?.profilePicture || getAvatarUrl(selectedTutor?.name)" 
                      :alt="selectedTutor?.name"
                      class="w-full h-auto rounded-lg"
                    />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-2 flex justify-center items-center space-x-2">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        class="px-3 py-1 text-emerald-600 hover:text-emerald-800"
        :disabled="currentPage === 1"
      >
        <ChevronLeft class="w-6 h-6"/>
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-1 rounded-lg',
          currentPage === page ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        class="px-3 py-1 text-emerald-600 hover:text-emerald-800"
        :disabled="currentPage === totalPages"
      >
        <ChevronRight class="w-6 h-6" />
      </button>
    </div>

    <!-- Appointment Booking Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
        <form @submit.prevent="handleBookAppointment">
          <div class="mb-4">
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              id="location"
              v-model="appointment.location"
              type="text"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter location"
              required
            />
          </div>
          <div class="mb-4">
            <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Preferred Start Time</label>
            <select
              id="startTime"
              v-model="appointment.startTime"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Select start time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">Preferred End Time</label>
            <select
              id="endTime"
              v-model="appointment.endTime"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Select end time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              id="subject"
              v-model="appointment.subject"
              type="text"
              class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter subject"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { Search, BookOpen, Calendar, ChevronDown, GraduationCap, Star, MapPin, Clock, CalendarPlus, ChevronLeft, ChevronRight, XIcon } from 'lucide-vue-next'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'


// State
const tutors = ref([])
const subjects = ['Math', 'Science', 'Languages', 'History', 'Arts']
const searchQuery = ref('')
const selectedSubject = ref('')
const selectedAvailability = ref('')
const selectedRating = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const isLoading = ref(true)
const error = ref(null)
const isModalOpen = ref(false)
const selectedTutorId = ref(null)
const selectedTutor = ref(null)

const appointment = reactive({
  location: '',
  startTime: '',
  endTime: '',
  subject: '',
})

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
]

const fetchTutors = async () => {
  // Simulating an API call with setTimeout
  await new Promise(resolve => setTimeout(resolve, 1000))
  tutors.value = [
    {
      id: 1,
      name: 'John Doe',
      expertise: 'Math Expert',
      bio: 'Passionate about making math easy and fun',
      rating: 4.8,
      reviewCount: 120,
      location: 'New York, NY',
      availability: 'Available Today',
      preferredTime: '2:00 PM - 4:00 PM',
      profilePicture: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      expertise: 'Science Tutor',
      bio: 'PhD in Physics, specializing in quantum mechanics',
      rating: 4.9,
      reviewCount: 85,
      location: 'Online',
      availability: 'Weekend slots available',
      preferredTime: '10:00 AM - 12:00 PM',
      profilePicture: null
    },
    // ... (other tutor objects)
  ]
  isLoading.value = false
}

// Define visible pages for pagination
const visiblePages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  const startPage = Math.max(1, currentPage.value - 2)
  const endPage = Math.min(totalPages.value, currentPage.value + 2)
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

onMounted(fetchTutors)

// Filtering and pagination
const filteredTutors = computed(() => {
  let filtered = tutors.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tutor =>
      tutor.name.toLowerCase().includes(query) ||
      tutor.expertise.toLowerCase().includes(query) ||
      tutor.bio.toLowerCase().includes(query)
    )
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(tutor => 
      tutor.expertise.toLowerCase().includes(selectedSubject.value.toLowerCase())
    )
  }

  if (selectedAvailability.value) {
    filtered = filtered.filter(tutor => 
      tutor.availability.toLowerCase().includes(selectedAvailability.value.toLowerCase())
    )
  }

  if (selectedRating.value) {
    filtered = filtered.filter(tutor => tutor.rating >= parseFloat(selectedRating.value))
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTutors.value.length / itemsPerPage))

const paginatedTutors = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredTutors.value.slice(startIndex, endIndex)
})

// Watch for filter changes
watch([searchQuery, selectedSubject, selectedAvailability, selectedRating], () => {
  currentPage.value = 1
})

// Methods
const filterTutors = () => {
  currentPage.value = 1
}

const bookAppointment = (tutorId) => {
  selectedTutorId.value = tutorId
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  Object.assign(appointment, {
    location: '',
    startTime: '',
    endTime: '',
    subject: '',
  })
}

const handleBookAppointment = async () => {
  try {
    // Replace this with your actual booking API call
    const response = await fetch('/api/book-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tutorId: selectedTutorId.value,
        ...appointment
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to book appointment')
    }
    alert(`Appointment booked successfully with tutor ID: ${selectedTutorId.value}`)
    closeModal()
  } catch (err) {
    console.error('Error booking appointment:', err)
    alert('Failed to book appointment. Please try again later.')
  }
}

function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

const openImageModal = (tutor) => {
  selectedTutor.value = tutor
}

const closeImageModal = () => {
  selectedTutor.value = null
}
</script>

<style>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>