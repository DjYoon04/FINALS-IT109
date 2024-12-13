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
          <!-- Icon -->
          <component
            :is="tab.icon"
            :class="[ currentTab === tab.name ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500','h-5 w-5 sm:mr-2'
            ]"
            aria-hidden="true"/>
          <!-- Tab Name -->
          <span class="hidden sm:inline pr-5">{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Tab Contents -->
    <div class="p-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide pb-12">
      <!-- Upcoming Appointments -->
      <TransitionGroup
        v-if="currentTab === 'Upcoming Appointments'"
        name="list"
        tag="ul"
        class="space-y-1"
      >
        <li
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="p-4 hover:bg-emerald-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img 
                :src="getAvatarUrl(appointment.student)" 
                :alt="appointment.student" 
                class="h-10 w-10 rounded-full"
              />
              <div>
                <p class="font-medium text-gray-900">{{ appointment.student }}</p>
                <p class="text-sm text-gray-500">{{ appointment.subject }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2 px-4">
              <p class="text-sm font-semibold text-teal-600">
                {{ appointment.preferredendstart }}
              </p>
              <button
                @click="openDetailsModal(appointment)"
                class="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                <InfoIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </li>
      </TransitionGroup>

      <!-- Appointment History -->
      <TransitionGroup
        v-if="currentTab === 'Appointment History'"
        name="list"
        tag="ul"
        class="space-y-1"
      >
        <li
          v-for="appointment in pastAppointments"
          :key="appointment.id"
          class="p-4 hover:bg-emerald-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-900">{{ appointment.subject }}</p>
              <p class="text-sm text-gray-500">{{ appointment.student }}</p>
            </div>
            <button
              @click="openDetailsModal(appointment)"
              class="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
            >
              <InfoIcon class="h-5 w-5 mr-4" />
            </button>
          </div>
        </li>
      </TransitionGroup>

      <!-- Recent Tutors -->
      <TransitionGroup
        v-if="currentTab === 'Recent Tutors'"
        name="list"
        tag="ul"
        class="space-y-1"
      >
        <li
          v-for="tutor in recentTutors"
          :key="tutor.id"
          class="p-4 hover:bg-emerald-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <div class="flex items-start space-x-4">
            <img 
              :src="getAvatarUrl(tutor.name)"
              :alt="tutor.name"
              class="h-10 w-10 rounded-full"
            />
            <div class="flex-grow">
              <p class="font-medium text-gray-900">{{ tutor.name }}</p>
              <p class="text-sm text-gray-500">{{ tutor.subjects.join(', ') }}</p>
              <div class="mt-2 space-y-2">
                <div
                  v-for="(comment, index) in tutor.comments"
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 rounded p-2"
                >
                  <p class="text-sm text-gray-700">{{ comment }}</p>
                  <button
                    @click="openEditCommentModal(tutor.id, index)"
                    class="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <button
              @click="openCommentModal(tutor)"
              class="flex items-center space-x-1 bg-emerald-100 text-teal-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors duration-200"
            >
              <!-- Icon -->
              <MessageCircle class="w-4 h-4" />
              <!-- Text -->
              <span>Comment</span>
            </button>
          </div>
        </li>
      </TransitionGroup>
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
                <p><strong>Student:</strong> {{ selectedAppointment?.student }}</p>
                <p><strong>Subject:</strong> {{ selectedAppointment?.subject }}</p>
                <p><strong>Time:</strong> {{ selectedAppointment?.preferredtimestart }} - {{ selectedAppointment?.preferredendstart }}</p>
                <p><strong>Location:</strong> {{ selectedAppointment?.location }}</p>
                <p><strong>Type:</strong> {{ selectedAppointment?.type }}</p>
                <p><strong>Date:</strong> {{ selectedAppointment?.date }}</p>
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

  <!-- Comment Modal -->
  <TransitionRoot appear :show="isCommentModalVisible" as="template">
    <Dialog as="div" @close="closeCommentModal" class="relative z-10">
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
                Add Comment for {{ selectedTutor?.name }}
              </DialogTitle>
              <div class="mt-2">
                <textarea
                  v-model="newComment"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  placeholder="Enter your comment here..."
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeCommentModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  @click="submitComment"
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

  <!-- Edit Comment Modal -->
  <TransitionRoot appear :show="isEditCommentModalVisible" as="template">
    <Dialog as="div" @close="closeEditCommentModal" class="relative z-10">
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
                Edit Comment
              </DialogTitle>
              <div class="mt-2">
                <textarea
                  v-model="editedComment"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  placeholder="Edit your comment here..."
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flexjustify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="deleteComment"
                >
                  Delete
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeEditCommentModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  @click="saveEditedComment"
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
import { ref } from 'vue';
import { CalendarIcon, ClockIcon, UsersIcon, InfoIcon, PencilIcon, MessageCircle } from 'lucide-vue-next';
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
const isCommentModalVisible = ref(false);
const isEditCommentModalVisible = ref(false);
const selectedAppointment = ref(null);
const selectedTutor = ref(null);
const newComment = ref('');
const editedComment = ref('');
const editingTutorId = ref(null);
const editingCommentIndex = ref(null);


const upcomingAppointments = ref([
  { id: 1, student: "Angela Martinez", subject: "Biology", preferredtimestart: "10:00 AM", preferredendstart: "11:00 AM", location: "Online", type: "Video Call", date: "2024-12-13" },
  { id: 2, student: "Leo Tan", subject: "Algebra", preferredtimestart: "4:00 PM", preferredendstart: "5:00 PM", location: "Library", type: "In-person", date: "2024-12-14" },
  { id: 3, student: "Mila Garcia", subject: "History", preferredtimestart: "3:00 PM", preferredendstart: "4:00 PM", location: "Online", type: "Video Call", date: "2024-12-13" },
  { id: 4, student: "Peter Cruz", subject: "Programming", preferredtimestart: "11:30 AM", preferredendstart: "12:30 PM", location: "Library", type: "In-person", date: "2024-12-14" },
  { id: 5, student: "Sophia Rivera", subject: "Advanced Calculus", preferredtimestart: "5:00 PM", preferredendstart: "6:00 PM", location: "Online", type: "Video Call", date: "2024-12-13" },
]);

const pastAppointments = ref([
  { id: 1, student: "Angela Martinez", subject: "Biology", preferredtimestart: "10:00 AM", preferredendstart: "11:00 AM", location: "Online", type: "Video Call", date: "2024-12-10" },
  { id: 2, student: "Leo Tan", subject: "Algebra", preferredtimestart: "4:00 PM", preferredendstart: "5:00 PM", location: "Library", type: "In-person", date: "2024-12-09" },
  { id: 3, student: "Mila Garcia", subject: "History", preferredtimestart: "3:00 PM", preferredendstart: "4:00 PM", location: "Online", type: "Video Call", date: "2024-12-10" },
  { id: 4, student: "Peter Cruz", subject: "Programming", preferredtimestart: "11:30 AM", preferredendstart: "12:30 PM", location: "Library", type: "In-person", date: "2024-12-09" },
  { id: 5, student: "Sophia Rivera", subject: "Advanced Calculus", preferredtimestart: "5:00 PM", preferredendstart: "6:00 PM", location: "Online", type: "Video Call", date: "2024-12-10" },
]);

const recentTutors = ref([
  { id: 1, name: "Angela Martinez", subjects: ["Biology", "Chemistry"], comments: [] },
  { id: 2, name: "Leo Tan", subjects: ["Algebra", "Geometry"], comments: [] },
  { id: 3, name: "Mila Garcia", subjects: ["History", "Political Science"], comments: [] },
  { id: 4, name: "Peter Cruz", subjects: ["Programming", "Web Development"], comments: [] },
  { id: 5, name: "Sophia Rivera", subjects: ["Advanced Calculus", "Statistics"], comments: [] },
]);


// Tabs data
const tabs = [
  { name: 'Upcoming Appointments', icon: CalendarIcon },
  { name: 'Appointment History', icon: ClockIcon },
  { name: 'Recent Tutors', icon: UsersIcon },
];

// Methods
function setCurrentTab(tabName) {
  currentTab.value = tabName;
}

function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}

function openDetailsModal(appointment) {
  selectedAppointment.value = appointment;
  isAppointmentModalVisible.value = true;
}

function closeAppointmentModal() {
  isAppointmentModalVisible.value = false;
  selectedAppointment.value = null;
}

function openCommentModal(tutor) {
  selectedTutor.value = tutor;
  isCommentModalVisible.value = true;
}

function closeCommentModal() {
  isCommentModalVisible.value = false;
  selectedTutor.value = null;
  newComment.value = '';
}

function submitComment() {
  if (selectedTutor.value && newComment.value.trim()) {
    const tutor = recentTutors.value.find(t => t.id === selectedTutor.value.id);
    if (tutor) {
      tutor.comments.push(newComment.value.trim());
    }
  }
  closeCommentModal();
}

function openEditCommentModal(tutorId, commentIndex) {
  const tutor = recentTutors.value.find(t => t.id === tutorId);
  if (tutor) {
    editingTutorId.value = tutorId;
    editingCommentIndex.value = commentIndex;
    editedComment.value = tutor.comments[commentIndex];
    isEditCommentModalVisible.value = true;
  }
}

function closeEditCommentModal() {
  isEditCommentModalVisible.value = false;
  editingTutorId.value = null;
  editingCommentIndex.value = null;
  editedComment.value = '';
}

function saveEditedComment() {
  if (editingTutorId.value !== null && editingCommentIndex.value !== null) {
    const tutor = recentTutors.value.find(t => t.id === editingTutorId.value);
    if (tutor) {
      tutor.comments[editingCommentIndex.value] = editedComment.value.trim();
    }
  }
  closeEditCommentModal();
}

function deleteComment() {
  if (editingTutorId.value !== null && editingCommentIndex.value !== null) {
    const tutor = recentTutors.value.find(t => t.id === editingTutorId.value);
    if (tutor) {
      tutor.comments.splice(editingCommentIndex.value, 1);
    }
  }
  closeEditCommentModal();
}
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