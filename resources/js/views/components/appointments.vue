<template>
  <div class="bg-white rounded-[30px] shadow-xl overflow-hidden h-full">
    <h2 class="text-3xl font-bold text-teal-700 px-6 pb-6 pt-4 text-center">Appointments</h2>
    <div v-if="loading" class="p-6 text-center flex flex-col items-center justify-center">
      <img :src="bookanimation" alt="Tutor illustration" class="w-14 h-14 object-cover" />
      <p class="mt-2 text-emerald-600">Loading appointments...</p>
    </div>
    <div v-else-if="error" class="p-6 text-center">
      <AlertCircleIcon class="inline-block w-8 h-8 text-red-500 mb-2" />
      <p class="text-red-600">{{ error }}</p>
    </div>
    <ul v-else class="divide-y divide-emerald-100 max-h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 pb-20 scrollbar-hide">
      <li
        v-for="appointment in appointments"
        :key="appointment.id"
        class="p-6 hover:bg-emerald-50 transition duration-300 ease-in-out"
      >
         <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <img 
              :src="getAvatarUrl(appointment.users_info?.fullname)" 
              :alt="appointment.users_info?.fullname" 
              class="h-10 w-10 rounded-full"
            />
            <div>
              <p class="font-medium text-gray-900">{{ appointment.users_info?.fullname }}</p>
              <div class="flex items-center">
                <p class="text-sm text-gray-500">{{ appointment.subject }}</p>
                <span
                  :class="{
                    'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-yellow-100 text-yellow-800': appointment.isCompleted === null,
                    'bg-green-100 text-green-800': appointment.isCompleted === true,
                    'bg-red-100 text-red-800': appointment.isCompleted === false
                  }"
                >
                  {{ appointment.isCompleted === null ? 'Pending' : appointment.isCompleted ? 'Accepted' : 'Declined' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2 px-4">
            <p class="text-sm font-semibold text-teal-600">
              {{ formatDate(appointment.preferred_time_date) }}
            </p>
            <button
              @click="viewDetails(appointment)"
              class="text-gray-400 hover:text-emerald-600 transition-colors duration-200"
            >
              <InfoIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- Modal -->
  <TransitionRoot appear :show="showModal" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
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
            <DialogTitle as="h3" class="text-lg font-bold leading-6 text-emerald-800">
                Appointment Details
              </DialogTitle>
              <div class="mt-4 space-y-2">
                <p class="text-md "> <strong>Tutor:</strong> {{ selectedAppointment.users_info?.fullname }}</p>
                <p class="text-md mt-1"><strong>Subject: </strong>{{ selectedAppointment.subject }}</p>
                <p class="text-md mt-1"><strong>Date: </strong>{{ formatDate(selectedAppointment.preferred_time_date) }}</p>
                <p class="text-md mt-1"><strong>Location: </strong>{{ selectedAppointment.location }}</p>
                <p class="text-md mt-1"><strong>Status: </strong> {{ selectedAppointment.isCompleted === null ? 'Pending' : selectedAppointment.isCompleted ? 'Accepted' : 'Declined' }}</p>
                
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  @click="closeModal"
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

  <!-- Alert component -->
  <div v-if="showAlert" class="fixed inset-x-0 top-0 flex items-center justify-center">
    <div :class="[ 
      'p-4 rounded-md shadow-md text-white text-center transition-all duration-300 ease-in-out', 
      alertType === 'success' ? 'bg-green-500' : 'bg-red-500' 
    ]">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { AlertCircleIcon, InfoIcon } from 'lucide-vue-next'
import { supabase } from "@/supabaseClient"

const bookanimation = '/img/book.gif'
const appointments = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const selectedAppointment = ref({})
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')

const fetchAppointments = async () => {
  try {
    loading.value = true
    
    // First get the current user's ID
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    // Then get the users_info record for the current user
    const { data: userInfo, error: userError } = await supabase
      .from('users_info')
      .select('id')
      .eq('auth_users_id', user.id)
      .single()
    if (userError) throw userError

    // Finally fetch only the transactions where the user is involved
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
      .order('preferred_time_date', { ascending: true })

    if (fetchError) throw fetchError

    // Transform the nested data structure
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
            isCompleted: appointment.isCompleted === null ? null : appointment.isCompleted
          }
        })
    })
  } catch (e) {
    console.error('Error:', e)
    error.value = 'Failed to load appointments. Please try again.'
  } finally {
    loading.value = false
  }
}


const viewDetails = (appointment) => {
  selectedAppointment.value = { ...appointment }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const updateAppointmentStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ isCompleted: status })
      .eq('id', selectedAppointment.value.id)

    if (error) throw error

    const index = appointments.value.findIndex(a => a.id === selectedAppointment.value.id)
    if (index !== -1) {
      appointments.value[index].isCompleted = status
      selectedAppointment.value.isCompleted = status
    }

    showAlert.value = true
    alertType.value = 'success'
    alertMessage.value = status ? 'Appointment accepted successfully!' : 'Appointment declined successfully!'
    
    setTimeout(() => {
      showAlert.value = false
    }, 3000)

    closeModal()
  } catch (e) {
    console.error('Error:', e)
    showAlert.value = true
    alertType.value = 'error'
    alertMessage.value = `Failed to ${status ? 'accept' : 'decline'} appointment. Please try again.`
    
    setTimeout(() => {
      showAlert.value = false
    }, 3000)
  }
}

const acceptAppointment = () => updateAppointmentStatus(true)
const declineAppointment = () => updateAppointmentStatus(false)

const formatDate = (date) => {
  if (!date) return 'No date specified'
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

