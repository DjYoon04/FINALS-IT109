<template>
  <div class="bg-white rounded-[30px] shadow-xl overflow-hidden h-full pb-16">
    <h1 class="text-3xl font-bold text-teal-700 px-6 pb-6 pt-4 text-center">Profile</h1>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 max-h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 scrollbar-hide">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Profile Info -->
        <div class="lg:col-span-1">
          <div class="flex flex-col items-center">
            <div class="w-44 h-44 bg-emerald-200 rounded-full flex items-center justify-center relative mb-2 shadow-md">
              <img 
                :src="profile.picture || getAvatarUrl(profile.name)" 
                :alt="profile.name"
                class="w-full h-full object-cover border-4 border-teal-200 rounded-full cursor-pointer"
              />
            </div>
            <h2 class="text-2xl font-semibold text-emerald-800 flex items-center justify-center">
              {{ profile.name }}
              <button @click="openEditModal" class="ml-2 text-xl px-2 bg-white text-emerald-600 rounded-full hover:bg-gray-100 transition duration-200">
                ✎
              </button>
            </h2>
            <p class="text-emerald-600 mb-4">{{ profile.role }}</p>
            <div class="w-full">
              <h3 class="text-lg font-semibold text-emerald-800 mb-2">About Me</h3>
              <p class="text-gray-600 mb-4">{{ profile.about }}</p>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <h4 class="font-medium text-emerald-700">University</h4>
                  <p class="text-gray-600">{{ profile.university }}</p>
                </div>
                <div>
                  <h4 class="font-medium text-emerald-700">Specialization</h4>
                  <p class="text-gray-600">{{ profile.specialization }}</p>
                </div>
                <div>
                  <h4 class="font-medium text-emerald-700">Preferred Time</h4>
                  <p class="text-gray-600">{{ formatTimeRange(profile.preferredTimeStart, profile.preferredTimeEnd) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Contact and Interaction Options -->
          <section>
            <h3 class="text-md font-medium text-emerald-700 mt-4 my-1">Contact</h3>
            <div class="flex flex-wrap items-center gap-4">
              <span class="text-gray-600 flex items-center">
                <a href="#" class="text-emerald-600 hover:text-emerald-800">
                  <Facebook class="w-5 h-5" />
                </a>
                <Mail class="w-5 h-5 mr-2" />
                {{ profile.email }}
              </span>
            </div>
          </section>
        </div>

        <!-- Right Column: Skills Reviews -->
        <div class="lg:col-span-2">
          <!-- Skills Section -->
          <section class="mb-8">
            <h3 class="text-lg font-semibold text-emerald-800 mb-2">Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in skills" :key="skill" class="cursor-pointer bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
                {{ skill }}
              </span>
            </div>
          </section>

          <!-- Reviews Section -->
          <section class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-emerald-800">Reviews</h3>
              <button 
                v-if="reviews.length > 3"
                @click="openAllReviewsModal" 
                class="px-4 py-2 text-teal-800 transition text-sm ease-in-out hover:scale-105 "
              >
                View All Reviews
              </button>
            </div>
            <div class="space-y-4">
              <div 
                v-for="review in displayedReviews" 
                :key="review.id" 
                class="bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-200 shadow-md p-4 rounded-2xl"
              >
                <div class="flex flex-col mb-2">
                  <!-- Review Header -->
                  <div class="flex items-center">
                    <span class="font-medium text-emerald-800 mr-2">{{ review.name }}</span>
                    <div class="flex">
                      <Star 
                        v-for="i in 5" 
                        :key="i" 
                        :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" 
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                  <div class="text-sm text-emerald-600 mt-1">
                    {{ review.subject }}
                  </div>
                </div>
                <p class="text-gray-600">{{ review.comment }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <TransitionRoot appear :show="isEditModalOpen" as="template">
      <Dialog as="div" @close="closeEditModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 scrollbar-hide">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div class="absolute inset-0 rounded-[20px]" aria-hidden="true">
                  <div class="absolute inset-[10px] bg-white rounded-[20px]" />
                </div>
                <div class="relative z-10">
                  <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-emerald-800 mb-6 text-center">
                    Edit Profile
                  </DialogTitle>
                  <button @click="closeEditModal" class="absolute top-2 right-2 text-emerald-600 hover:text-emerald-800">
                    <XIcon class="h-6 w-6" />
                  </button>

                  <form @submit.prevent="saveProfile" class="space-y-6">
                    <div class="flex flex-col items-center space-y-6">
                      <!-- Profile Photo -->
                      <div class="flex flex-col items-center space-y-4">
                        <div class="relative h-44 w-44">
                          <img 
                            :src="previewImage || editedProfile.picture || getAvatarUrl(editedProfile.name)" 
                            class="h-full w-full rounded-full object-cover border-4 border-emerald-200"
                            :alt="editedProfile.name"
                          />
                        </div>
                        <div class="flex space-x-2">
                          <label class="px-3 py-2 bg-teal-600 font-medium text-white text-sm rounded-md cursor-pointer hover:bg-teal-700 transition">
                            Change
                            <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
                          </label>
                          <button 
                            type="button"
                            @click="removePhoto"
                            class="px-3 py-2 bg-red-600 font-medium text-white text-sm rounded-md hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <!-- Name -->
                      <div class="w-full space-y-1">
                        <label for="fullName" class="block text-sm font-medium text-emerald-800">Full name</label>
                        <input
                          type="text"
                          id="fullName"
                          v-model="editedProfile.name"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <!-- University -->
                      <div class="w-full space-y-1">
                        <label for="university" class="block text-sm font-medium text-emerald-800">University</label>
                        <input
                          type="text"
                          id="university"
                          v-model="editedProfile.university"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter your university"
                        />
                      </div>

                      <!-- About Me -->
                      <div class="w-full space-y-1">
                        <label for="aboutMe" class="block text-sm font-medium text-emerald-800">About Me</label>
                        <textarea
                          id="aboutMe"
                          v-model="editedProfile.about"
                          rows="4"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Tell us about yourself"
                        ></textarea>
                      </div>

                      <!-- Specialization -->
                      <div class="w-full space-y-1">
                        <label for="specialization" class="block text-sm font-medium text-emerald-800">Specialization</label>
                        <input
                          type="text"
                          id="specialization"
                          v-model="editedProfile.specialization"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter your specialization"
                        />
                      </div>

                      <!-- Email -->
                      <div class="w-full space-y-1">
                        <label for="email" class="block text-sm font-medium text-emerald-800">Email</label>
                        <input
                          type="email"
                          id="email"
                          v-model="editedProfile.email"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <!-- Preferred Time -->
                      <div class="w-full space-y-1">
                        <label class="block text-sm font-medium text-emerald-800">Preferred Time</label>
                        <div class="flex space-x-4">
                          <div class="flex-1">
                            <select
                              v-model="editedProfile.preferredTimeStart"
                              class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option v-for="time in timeOptions" :key="time" :value="time">
                                {{ formatTime(time) }}
                              </option>
                            </select>
                          </div>
                          <div class="flex items-center">
                            <span class="text-emerald-800">to</span>
                          </div>
                          <div class="flex-1">
                            <select
                              v-model="editedProfile.preferredTimeEnd"
                              class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option v-for="time in timeOptions" :key="time" :value="time">
                                {{ formatTime(time) }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <!-- Skills -->
                      <div class="w-full space-y-1">
                        <label for="skills" class="block text-sm font-medium text-emerald-800">Skills</label>
                        <input
                          type="text"
                          id="skills"
                          v-model="editedProfile.skillsText"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Web Development, UI/UX Design"
                        />
                      </div>

                      <!-- Save and Cancel Buttons -->
                      <div class="flex flex-wrap gap-4 justify-center">
                        <button
                          type="submit"
                          class="flex-1 max-w-md bg-emerald-500 text-white rounded-xl shadow-md py-2 px-24 text-base font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          @click="closeEditModal"
                          class="flex-1 max-w-md bg-gray-400 text-white rounded-xl shadow-md py-2 px-24 text-base font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- All Reviews Modal -->
    <TransitionRoot appear :show="isAllReviewsModalOpen" as="template">
      <Dialog as="div" @close="closeAllReviewsModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 scrollbar-hide">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div class="absolute inset-0 rounded-[20px]" aria-hidden="true">
                  <div class="absolute inset-[10px] bg-white rounded-[20px]" />
                </div>
                <div class="relative z-10">
                  <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-emerald-800 mb-6 text-center">
                    All Reviews
                  </DialogTitle>
                  <button @click="closeAllReviewsModal" class="absolute top-2 right-2 text-emerald-600 hover:text-emerald-800">
                    <XIcon class="h-6 w-6" />
                  </button>

                  <div class="space-y-4 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 scrollbar-hide">
                    <div 
                      v-for="review in reviews" 
                      :key="review.id" 
                      class="bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-200 shadow-md p-4 rounded-2xl"
                    >
                      <div class="flex flex-col mb-2">
                        <div class="flex items-center">
                          <span class="font-medium text-emerald-800 mr-2">{{ review.name }}</span>
                          <div class="flex">
                            <Star 
                              v-for="i in 5" 
                              :key="i" 
                              :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" 
                              class="w-4 h-4"
                            />
                          </div>
                        </div>
                        <div class="text-sm text-emerald-600 mt-1">
                          {{ review.subject }}
                        </div>
                      </div>
                      <p class="text-gray-600">{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Star, Facebook, Mail, XIcon } from 'lucide-vue-next'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const profile = ref({
  name: 'Djeah A. Tabada',
  role: 'Tutor',
  year: '3rd Year',
  major: 'Computer Science Major',
  picture: '',
  about: 'Passionate mathematics tutor with 5 years of experience. I specialize in making complex concepts easy to understand and enjoy helping students build confidence in their math skills.',
  university: 'Caraga State University',
  specialization: 'Artificial Intelligence and Machine Learning',
  email: 'jane.doe@example.com',
  preferredTimeStart: '09:00',
  preferredTimeEnd: '17:00',
})

const skills = ref(['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Problem Solving', 'Test Preparation'])

const reviews = ref([
  { id: 1, name: 'Alex M.', rating: 5, subject: 'Calculus I', comment: 'Jane is an excellent tutor! She explained complex calculus concepts in a way that was easy to understand.' },
  { id: 2, name: 'Sarah L.', rating: 4, subject: 'Algebra II', comment: 'Very patient and knowledgeable. Helped me improve my algebra skills significantly.' },
  { id: 3, name: 'Michael K.', rating: 5, subject: 'Advanced Calculus', comment: 'Jane is an excellent tutor! Her teaching style made even the most challenging topics approachable.' },
  { id: 4, name: 'Emily R.', rating: 4, subject: 'Statistics', comment: 'Very patient and knowledgeable. Helped me improve my statistics skills significantly.' },
])

const isEditModalOpen = ref(false)
const isAllReviewsModalOpen = ref(false)
const editedProfile = ref({ ...profile.value })
const previewImage = ref(null)
const selectedFile = ref(null)

const openEditModal = () => {
  editedProfile.value = { 
    ...profile.value,
    skillsText: skills.value.join(', '),
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editedProfile.value = { ...profile.value }
  previewImage.value = null
  selectedFile.value = null
}

const openAllReviewsModal = () => {
  isAllReviewsModalOpen.value = true
}

const closeAllReviewsModal = () => {
  isAllReviewsModalOpen.value = false
}

// Generate time options every 30 minutes
const timeOptions = computed(() => {
  const options = []
  for (let i = 0; i < 24 * 2; i++) {
    const hours = Math.floor(i / 2)
    const minutes = (i % 2) * 30
    options.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
  }
  return options
})

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const date = new Date(2000, 0, 1, hours, minutes)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const formatTimeRange = (start, end) => {
  return `${formatTime(start)} - ${formatTime(end)}`
}

const displayedReviews = computed(() => {
  return reviews.value.slice(0, 3)
})

onMounted(async () => {
  try {
    const response = await fetch('/api/tutor-profile')
    const data = await response.json()
    profile.value = {
      ...data.profile,
      preferredTimeStart: data.profile.preferredTimeStart || '09:00',
      preferredTimeEnd: data.profile.preferredTimeEnd || '17:00',
    }
    skills.value = data.skills
    reviews.value = data.reviews
  } catch (error) {
    console.error('Error fetching profile data:', error)
  }
})

const saveProfile = async () => {
  if (selectedFile.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.picture = e.target.result
    }
    reader.readAsDataURL(selectedFile.value)
  } else if (previewImage.value === null) {
    profile.value.picture = ''
  }

  profile.value = { ...editedProfile.value }
  skills.value = editedProfile.value.skillsText.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
  isEditModalOpen.value = false
  selectedFile.value = null
  previewImage.value = null

  // Here you would typically send the updated profile to your backend
  // For example:
  // try {
  //   await fetch('/api/update-profile', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       profile: profile.value,
  //       skills: skills.value,
  //     }),
  //   })
  // } catch (error) {
  //   console.error('Error updating profile:', error)
  // }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  previewImage.value = null
  selectedFile.value = null
  editedProfile.value.picture = ''
}

function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>