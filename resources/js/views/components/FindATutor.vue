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
            <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <!-- Tutor Grid with Scrollbar -->
    <div v-else class="flex-grow overflow-hidden">
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
                  :src="tutor.avatar_url || getAvatarUrl(tutor.fullname)" 
                  :alt="tutor.fullname" 
                  class="w-12 h-12 rounded-full object-cover mr-4 cursor-pointer"
                  @click="openImageModal(tutor)"
                />
                <h2 class="text-xl font-semibold text-emerald-800">{{ tutor.fullname }}</h2>
              </div>
              <p class="text-emerald-600 mb-2 flex items-center">
                <GraduationCap class="mr-2" :size="16" />
                {{ tutor.specialization }}
              </p>
              <p class="text-sm text-gray-600 mb-2">{{ tutor.description }}</p>
              <div class="flex items-center mb-2 text-yellow-500">
                <Star class="mr-1" :size="16" fill="currentColor" />
                <span>{{ tutor.average_rating || 'No ratings' }} ({{ tutor.review_count || 0 }} reviews)</span>
              </div>
              
              <!-- Reviews Section -->
              <div class="mt-2 space-y-2">
                <h3 class="font-semibold text-gray-700">Recent Reviews</h3>
                <div v-if="tutor.reviews && tutor.reviews.length > 0" class="space-y-2">
                  <div v-for="review in tutor.reviews.slice(0, 2)" :key="review.id" class="bg-gray-50 p-3 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="flex text-yellow-500">
                        <Star v-for="i in review.star" :key="i" :size="12" fill="currentColor" />
                      </div>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(review.created_at) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ review.comments }}</p>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500 italic">No reviews yet</p>
              </div>

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

    <!-- Booking Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
                <form @submit.prevent="handleBookAppointment" class="space-y-4">
                  <div>
                    <label for="appointment_type" class="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                    <select
                      id="appointment_type"
                      v-model="appointment.type"
                      class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="online">Online</option>
                      <option value="face-to-face">Face-to-face</option>
                    </select>
                  </div>
                  <div>
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
                  <div>
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
                  <div>
                    <label for="preferred_time_date" class="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                    <input
                      id="preferred_time_date"
                      v-model="appointment.preferred_time_date"
                      type="datetime-local"
                      class="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div class="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {{ isSubmitting ? 'Booking...' : 'Book Appointment' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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
                <button
                  class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                  @click="closeImageModal"
                >
                  <XIcon class="w-6 h-6" />
                </button>
                <div class="mt-2">
                  <img 
                    :src="selectedTutor?.avatar_url || getAvatarUrl(selectedTutor?.fullname)" 
                    :alt="selectedTutor?.fullname"
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
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { supabase } from "@/supabaseClient"
import { Search, BookOpen, ChevronDown, GraduationCap, Star, CalendarPlus, ChevronLeft, ChevronRight, XIcon } from 'lucide-vue-next'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'

// State management
const tutors = ref([])
const searchQuery = ref('')
const selectedSubject = ref('')
const selectedRating = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const isLoading = ref(true)
const error = ref(null)
const isModalOpen = ref(false)
const selectedTutorId = ref(null)
const selectedTutor = ref(null)
const isSubmitting = ref(false)

const appointment = reactive({
  type: '',
  location: '',
  subject: '',
  preferred_time_date: '',
})

// Fetch tutors with their ratings and reviews
const fetchTutors = async () => {
  try {
    isLoading.value = true
    error.value = null

    const { data: tutorsData, error: tutorsError } = await supabase
      .from('users_info')
      .select(`
        *,
        review_list (
          reviews (
            id,
            created_at,
            star,
            comments
          )
        )
      `)
      .eq('occupation', 'Tutor')

    if (tutorsError) throw new Error(`Error fetching tutors: ${tutorsError.message}`)

    tutors.value = tutorsData.map(tutor => {
      const reviews = tutor.review_list.flatMap(rl => rl.reviews || [])
      const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.star, 0) / reviews.length).toFixed(1)
        : null

      return {
        ...tutor,
        average_rating: averageRating,
        review_count: reviews.length,
        reviews: reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 2)
      }
    })

  } catch (err) {
    console.error('Error in fetchTutors:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTutors()
})

const handleBookAppointment = async () => {
  try {
    isSubmitting.value = true;

    // Step 1: Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    console.log('Booking appointment for user:', user.id);
    console.log('Appointment details:', JSON.stringify(appointment, null, 2));
    console.log('Selected Tutor ID:', selectedTutorId.value);

    // Validate appointment details
    const { type, location, subject, preferred_time_date } = appointment;
    console.log('Appointment type:', type);
    console.log('Appointment location:', location);
    console.log('Appointment subject:', subject);
    console.log('Appointment preferred time and date:', preferred_time_date);

    if (!type || !location || !subject || !preferred_time_date) {
      const missingFields = [];
      if (!type) missingFields.push('type');
      if (!location) missingFields.push('location');
      if (!subject) missingFields.push('subject');
      if (!preferred_time_date) missingFields.push('preferred time and date');
      throw new Error(`Please fill in all appointment details. Missing: ${missingFields.join(', ')}`);
    }

    // Validate selectedTutorId
    if (!selectedTutorId.value || typeof selectedTutorId.value !== 'number' || !Number.isInteger(selectedTutorId.value)) {
      throw new Error('Invalid tutor ID. Please select a valid tutor.');
    }

    // Step 2: Create the transaction
    const preferred_time_date_iso = preferred_time_date
      ? new Date(preferred_time_date).toISOString()
      : null;

    if (!preferred_time_date_iso) {
      throw new Error('Invalid date and time selected');
    }

    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        location: appointment.location,
        preferred_time_date: preferred_time_date_iso,
        subject: appointment.subject,
        type: appointment.type
      })
      .select()
      .single();

    if (transactionError) throw new Error(`Error creating transaction: ${transactionError.message}`);

    console.log('Transaction created:', transactionData);

    // Step 3: Get the users_info records using auth_users_id for student and id for tutor
    const { data: studentData, error: studentError } = await supabase
      .from('users_info')
      .select('id')
      .eq('auth_users_id', user.id)
      .single();

    if (studentError) throw new Error(`Error fetching student info: ${studentError.message}`);

    const { data: tutorData, error: tutorError } = await supabase
      .from('users_info')
      .select('id')
      .eq('id', selectedTutorId.value)
      .single();

    if (tutorError) throw new Error(`Error fetching tutor info: ${tutorError.message}`);

    // Step 4: Create the user_transactions entries
    const { error: userTransactionError } = await supabase
      .from('user_transactions')
      .insert([
        {
          users_info_id: studentData.id,
          transaction_id: transactionData.id,
        },
        {
          users_info_id: tutorData.id,
          transaction_id: transactionData.id,
        }
      ]);

    if (userTransactionError) throw new Error(`Error creating user transactions: ${userTransactionError.message}`);

    console.log('User transactions created successfully');
    alert('Appointment booked successfully!');
    closeModal(); // Assuming closeModal is defined elsewhere

    // Refetch tutors to refresh the list
    await fetchTutors(); // Assuming fetchTutors is defined elsewhere
  } catch (err) {
    console.error('Error booking appointment:', err);
    let errorMessage = 'Failed to book appointment';
    if (err instanceof Error) {
      errorMessage += ': ' + err.message;
    }
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};





// Update the bookAppointment function to handle integer IDs
const bookAppointment = (tutorId) => {
  // tutorId is now an integer from users_info.id
  if (typeof tutorId === 'number' && Number.isInteger(tutorId)) {
    selectedTutorId.value = tutorId;
    isModalOpen.value = true;
  } else {
    console.error('Invalid tutor ID:', tutorId);
    alert('Invalid tutor selected. Please try again.');
  }
}



// Computed properties for filtering and pagination
const filteredTutors = computed(() => {
  let filtered = tutors.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tutor =>
      tutor.fullname?.toLowerCase().includes(query) ||
      tutor.specialization?.toLowerCase().includes(query) ||
      tutor.description?.toLowerCase().includes(query)
    )
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(tutor => 
      tutor.specialization?.toLowerCase() === selectedSubject.value.toLowerCase()
    )
  }

  if (selectedRating.value) {
    filtered = filtered.filter(tutor => 
      tutor.average_rating && parseFloat(tutor.average_rating) >= parseFloat(selectedRating.value)
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTutors.value.length / itemsPerPage))

const paginatedTutors = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredTutors.value.slice(startIndex, endIndex)
})

const uniqueSubjects = computed(() => {
  const subjects = new Set(tutors.value.map(tutor => tutor.specialization).filter(Boolean))
  return Array.from(subjects)
})

const visiblePages = computed(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  const startPage = Math.max(1, currentPage.value - 2)
  const endPage = Math.min(totalPages.value, currentPage.value + 2)
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

// Utility methods
const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}

const filterTutors = () => {
  currentPage.value = 1
}


const closeModal = () => {
  isModalOpen.value = false
  selectedTutorId.value = null
  Object.assign(appointment, {
    type: '',
    location: '',
    subject: '',
    preferred_time_date: '',
  })
}

const openImageModal = (tutor) => {
  selectedTutor.value = tutor
}

const closeImageModal = () => {
  selectedTutor.value = null
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watch for filter changes
watch([searchQuery, selectedSubject, selectedRating], () => {
  currentPage.value = 1
})

</script>

<style>
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