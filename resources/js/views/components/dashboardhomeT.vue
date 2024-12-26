<template>
  <div class="bg-white rounded-[30px] shadow-sm overflow-hidden h-full max-h-full px-8">
    <h1 class="text-3xl font-bold text-teal-700 px-6 pb-6 pt-4 text-center">Dashboard</h1>
    
    <!-- Header and Tabs -->
    <div class="overflow-y-auto">
      <nav class="flex flex-wrap justify-center sm:justify-start space-x-0 sm:space-x-1 mt-2 px-4" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="setCurrentTab(tab.name)"
          :class="[ 
            currentTab === tab.name
              ? 'border-teal-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'group inline-flex items-center justify-center sm:py-4 border-b-2 font-medium text-sm transition-all'
          ]"
          :aria-current="currentTab === tab.name ? 'page' : undefined">
          <component
            :is="tab.icon"
            :class="[ currentTab === tab.name ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500','h-5 w-5 sm:mr-2'
            ]"
            aria-hidden="true"/>
          <span class="hidden sm:inline pr-5">{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Tab Contents -->
    <div class="p-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide pb-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <svg class="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-500 text-center">
        {{ error }}
      </div>

      <!-- Upcoming Appointments -->
      <div v-else-if="currentTab === 'Upcoming Appointments'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="appointment in upcomingAppointments" :key="appointment.id" class="hover:bg-emerald-50 transition-all duration-200 ease-in-out">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="getAvatarUrl(appointment.users_info?.fullname)" :alt="appointment.users_info?.fullname" class="h-10 w-10 rounded-full mr-3" />
                  <div class="font-medium text-gray-900">{{ appointment.users_info?.fullname }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ appointment.subject }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-teal-600">{{ formatDate(appointment.preferred_time_date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openDetailsModal(appointment)" class="text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                  <InfoIcon class="h-5 w-5 inline-block" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Past Appointments -->
      <div v-else-if="currentTab === 'Appointment History'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="appointment in pastAppointments" :key="appointment.id" class="hover:bg-emerald-50 transition-all duration-200 ease-in-out">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ appointment.users_info?.fullname }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ appointment.subject }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-teal-600">{{ formatDate(appointment.preferred_time_date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openDetailsModal(appointment)" class="text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                  <InfoIcon class="h-5 w-5 inline-block" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recent Students -->
      <div v-else-if="currentTab === 'Recent Students'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tutor in recentTutors" :key="tutor.id" class="hover:bg-emerald-50 transition-all duration-200 ease-in-out">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="getAvatarUrl(tutor.fullname)" :alt="tutor.fullname" class="h-10 w-10 rounded-full mr-3" />
                  <div class="font-medium text-gray-900">{{ tutor.fullname }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ tutor.lastSubject }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openRateModal(tutor)" class="bg-emerald-100 text-teal-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors duration-200">
                  Comment
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <!-- Appointment Details Modal -->
  <TransitionRoot appear :show="isAppointmentModalVisible" as="template">
    <Dialog as="div" @close="closeAppointmentModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div class="flex justify-between items-center">
                <DialogTitle as="h2" class="text-xl font-bold text-emerald-800">
                  Appointment Details
                </DialogTitle>
                <button @click="closeAppointmentModal" class="text-gray-500 hover:text-gray-700">
                  <span class="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <div class="mt-4 space-y-2">
                <p><strong>Student:</strong> {{ selectedAppointment?.users_info?.fullname }}</p>
                <p><strong>Subject:</strong> {{ selectedAppointment?.subject }}</p>
                <p><strong>Location:</strong> {{ selectedAppointment?.location }}</p>
                <p><strong>Type:</strong> {{ selectedAppointment?.type }}</p>
                <p><strong>Date and Time:</strong> {{ formatDate(selectedAppointment?.preferred_time_date) }}</p>
              </div>

              <div class="mt-6 flex justify-end space-x-4">
                <button
                  @click="closeAppointmentModal"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Rate Modal -->
  <!-- Rate Modal -->
  <TransitionRoot appear :show="isRateModalVisible" as="template">
    <Dialog as="div" @close="closeRateModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Rate {{ selectedTutor?.fullname }}
              </DialogTitle>
              <div class="mt-4">
                <textarea
                  v-model="newComment"
                  rows="4"
                  class="w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  placeholder="Add a comment (optional)"
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeRateModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  @click="submitRating"
                >
                  Submit
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>  
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Edit Review Modal -->
  <TransitionRoot appear :show="isEditReviewModalVisible" as="template">
    <Dialog as="div" @close="closeEditReviewModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Edit Review
              </DialogTitle>
              <div class="mt-4">
                <textarea
                  v-model="editedComment"
                  rows="4"
                  class="w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  placeholder="Edit your comment here..."
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="deleteReview"
                >
                  Delete
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeEditReviewModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  @click="saveEditedReview"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from "@/supabaseClient"
import { CalendarIcon, ClockIcon, UsersIcon, InfoIcon, PencilIcon, Star } from 'lucide-vue-next';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';

// State
const currentTab = ref("Upcoming Appointments");
const isAppointmentModalVisible = ref(false);
const isRateModalVisible = ref(false);
const isEditReviewModalVisible = ref(false);
const selectedAppointment = ref(null);
const selectedTutor = ref(null);
const rating = ref(0);
const newComment = ref('');
const editedRating = ref(0);
const editedComment = ref('');
const editingReviewId = ref(null);
const appointments = ref([]);
const recentTutors = ref([]);
const loading = ref(true);
const error = ref(null);

// Computed properties
const upcomingAppointments = computed(() => 
  appointments.value.filter(apt => new Date(apt.preferred_time_date) > new Date())
);

const pastAppointments = computed(() => 
  appointments.value.filter(apt => new Date(apt.preferred_time_date) <= new Date())
);

// Tabs data
const tabs = [
  { name: 'Upcoming Appointments', icon: CalendarIcon },
  { name: 'Appointment History', icon: ClockIcon },
  { name: 'Recent Students', icon: UsersIcon },
];

// Methods
const fetchAppointments = async () => {
  try {
    loading.value = true
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    const { data: userInfo, error: userError } = await supabase
      .from('users_info')
      .select('id')
      .eq('auth_users_id', user.id)
      .single()
    if (userError) throw userError

    const { data, error: fetchError } = await supabase
      .from('transactions')
      .select(`
        *,
        user_transactions (
          users_info_id,
          users_info (
            id,
            fullname,
            occupation,
            university,
            specialization
          )
        )
      `)
      .eq('isCompleted', true)
      .order('preferred_time_date', { ascending: false })

    if (fetchError) throw fetchError

    appointments.value = data.flatMap(appointment => {
      return appointment.user_transactions
        .filter(transaction => transaction.users_info_id === userInfo.id)
        .map(transaction => {
          const otherUserTransaction = appointment.user_transactions.find(
            t => t.users_info_id !== userInfo.id
          );
          
          return {
            ...appointment,
            users_info: otherUserTransaction?.users_info,
            tutor_id: otherUserTransaction?.users_info_id,
            isCompleted: true
          }
        })
    })

    // Process recent students
    const tutorsMap = new Map();
    appointments.value.forEach(appointment => {
      if (!tutorsMap.has(appointment.tutor_id)) {
        tutorsMap.set(appointment.tutor_id, {
          id: appointment.tutor_id,
          fullname: appointment.users_info.fullname,
          lastSubject: appointment.subject,
          userReview: null
        });
      }
    });

    // Fetch reviews for these tutors
    const { data: reviews, error: reviewsError } = await supabase
      .from('review_list')
      .select(`
        *,
        reviews (
          id,
          star,
          comments
        )
      `)
      .eq('reviews_id', userInfo.id)
      .in('users_info_id', Array.from(tutorsMap.keys()));

    if (reviewsError) throw reviewsError;

    // Add reviews to tutors
    reviews.forEach(review => {
      const tutor = tutorsMap.get(review.users_info_id);
      if (tutor) {
        tutor.userReview = review.reviews;
      }
    });

    recentTutors.value = Array.from(tutorsMap.values());

  } catch (e) {
    console.error('Error:', e)
    error.value = 'Failed to load appointments and reviews. Please try again.'
  } finally {
    loading.value = false
  }
}

function setCurrentTab(tabName) {
  currentTab.value = tabName;
}

function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

function openDetailsModal(appointment) {
  selectedAppointment.value = appointment;
  isAppointmentModalVisible.value = true;
}

function closeAppointmentModal() {
  isAppointmentModalVisible.value = false;
  selectedAppointment.value = null;
}

function openRateModal(tutor) {
  selectedTutor.value = tutor;
  rating.value = 0;
  newComment.value = '';
  isRateModalVisible.value = true;
}

function closeRateModal() {
  isRateModalVisible.value = false;
  selectedTutor.value = null;
  rating.value = 0;
  newComment.value = '';
}

function openEditReviewModal(tutorId, reviewId) {
  const tutor = recentTutors.value.find(t => t.id === tutorId);
  if (tutor) {
    const review = tutor.review_list.find(r => r.id === reviewId);
    if (review) {
      editingReviewId.value = reviewId;
      editedRating.value = review.star;
      editedComment.value = review.comments || '';
      isEditReviewModalVisible.value = true;
    }
  }
}

function closeEditReviewModal() {
  isEditReviewModalVisible.value = false;
  editingReviewId.value = null;
  editedRating.value = 0;
  editedComment.value = '';
}

async function submitRating() {
  if (selectedTutor.value) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userInfo } = await supabase
        .from('users_info')
        .select('id')
        .eq('auth_users_id', user.id)
        .single();

      // First, insert the review
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          star: rating.value,
          comments: newComment.value.trim() || null,
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // Then, create the association in review_list
      const { data, error } = await supabase
        .from('review_list')
        .insert({
          users_info_id: selectedTutor.value.id,  // This should be the tutor's ID
          reviews_id: reviewData.id,
        });

      if (error) throw error;

      // Update the local state to reflect the new review
      const updatedTutor = recentTutors.value.find(t => t.id === selectedTutor.value.id);
      if (updatedTutor) {
        if (!updatedTutor.review_list) {
          updatedTutor.review_list = [];
        }
        updatedTutor.review_list.push({
          id: reviewData.id,
          star: rating.value,
          comments: newComment.value.trim() || null
        });
      }

      closeRateModal();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }
}

async function saveEditedReview() {
  if (editingReviewId.value) {
    try {
      // Update the review in the reviews table
      const { data, error } = await supabase
        .from('reviews')
        .update({
          comments: editedComment.value.trim() || null,
        })
        .eq('id', editingReviewId.value)
        .select()
        .single();

      if (error) throw error;

      // Update the local state
      const updatedTutor = recentTutors.value.find(tutor => 
        tutor.review_list.some(review => review.id === editingReviewId.value)
      );
      if (updatedTutor) {
        const reviewIndex = updatedTutor.review_list.findIndex(review => review.id === editingReviewId.value);
        if (reviewIndex !== -1) {
          updatedTutor.review_list[reviewIndex].comments = editedComment.value.trim() || null;
        }
      }

      closeEditReviewModal();
    } catch (error) {
      console.error('Error in saveEditedReview:', error);
      alert(`Failed to save review: ${error.message}`);
    }
  }
}

async function deleteReview() {
  if (!editingReviewId.value) {
    alert('No review selected for deletion');
    return;
  }

  try {
    // Delete the review from the reviews table
    const { error: deleteReviewError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', editingReviewId.value);

    if (deleteReviewError) throw deleteReviewError;

    // Update the local state to remove the deleted review
    recentTutors.value = recentTutors.value.map(tutor => ({
      ...tutor,
      review_list: tutor.review_list.filter(review => review.id !== editingReviewId.value)
    }));

    closeEditReviewModal();
    alert('Review successfully deleted');
  } catch (error) {
    console.error('Error in deleteReview:', error);
    alert(`Failed to delete review: ${error.message}`);
  }
}



// Fetch initial data
onMounted(() => {
  fetchAppointments();
});
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>