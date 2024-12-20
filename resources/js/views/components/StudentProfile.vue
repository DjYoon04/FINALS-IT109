<template>
  <div class="bg-white rounded-3xl shadow-xl overflow-hidden h-full pb-16">
    <h1 class="text-3xl font-bold text-teal-700 px-6 pb-6 pt-4 text-center">Profile</h1>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 max-h-full overflow-y-auto scrollbar-hide">
      <div v-if="loading" class="text-center">
        <p class="text-lg text-emerald-600">Loading profile...</p>
      </div>
      <div v-else-if="error" class="text-center">
        <p class="text-lg text-red-600">{{ error }}</p>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Profile Info -->
        <div class="lg:col-span-1">
          <div class="flex flex-col items-center">
            <div class="w-44 h-44 bg-emerald-200 rounded-full flex items-center justify-center relative mb-2 shadow-md mr-2">
              <img 
                :src="profile.avatar_url || getAvatarUrl(profile.fullname)" 
                :alt="profile.fullname"
                class="w-full h-full object-cover border-4 border-teal-200 rounded-full"
              />
            </div>
            <h2 class="text-2xl font-semibold text-emerald-800 flex items-center justify-center">
              {{ profile.fullname }}
              <button @click="openEditModal" class="text-lg px-2 bg-white text-emerald-600 rounded-full hover:bg-gray-100 transition duration-200">
                ✎
              </button>
            </h2>
            <p class="text-emerald-600 mb-4 mr-4">{{ profile.occupation }}</p>
            <div class="w-full">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <h4 class="font-medium text-emerald-700">University</h4>
                  <p class="text-gray-600">{{ profile.university }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Learning Goals Section -->
          <section class="mt-6">
            <h3 class="text-md font-medium text-emerald-700 mb-3">Learning Goals</h3>
            <div v-if="profile.learning_goals" class="flex flex-wrap gap-2">
              <span 
                v-for="goal in learningGoalsList" 
                :key="goal"
                class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
              >
                {{ goal }}
              </span>
            </div>
            <p v-else class="text-gray-500 italic">No learning goals added yet.</p>
          </section>

          <!-- Contact Information -->
          <section class="mt-6">
            <h3 class="text-md font-medium text-emerald-700 mb-3">Contact</h3>
            <div v-if="hasContacts" class="flex flex-col space-y-2">
              <span v-if="profile.email" class="text-gray-600 flex items-center">
                <Mail class="w-5 h-5 mr-2" />
                {{ profile.email }}
              </span>
              <span v-if="profile.fbemail" class="text-gray-600 flex items-center">
                <Facebook class="w-5 h-5 mr-2" />
                {{ profile.fbemail }}
              </span>
            </div>
            <p v-else class="text-gray-500 italic">No contact information added yet.</p>
          </section>
        </div>

        <!-- Right Column: Reviews and Transactions -->
        <div class="lg:col-span-2">
         <!-- Reviews Section -->
          <section class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-emerald-800">Comments</h3> 
            </div>
            <div v-if="reviews.length > 0" class="space-y-4">
              <div 
                v-for="review in reviews" 
                :key="review.id" 
                class="bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-200 shadow-md p-4 rounded-2xl"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center"> 
                    <!-- Access the nested comment -->
                    <p class="text-gray-600">{{ review.reviews?.comments || 'No comment available' }}</p>
                  </div>
                  <span class="text-sm text-emerald-600">
                    {{ formatDate(review.created_at) }}
                  </span>  
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 italic text-center bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-200 shadow-md p-4 rounded-2xl">
              No comments yet.
            </p>
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
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-emerald-800 mb-6 text-center">
                  Edit Profile
                </DialogTitle>
                <button @click="closeEditModal" class="absolute top-2 right-2 text-emerald-600 hover:text-emerald-800">
                  <XIcon class="w-6 h-6" />
                </button>

                <form @submit.prevent="saveProfile" class="space-y-6">
                  <div class="space-y-4">
                    <!-- Profile Picture -->
                    <div class="space-y-1">
                      <label for="avatar" class="block text-sm font-medium text-emerald-800">Profile Picture</label>
                      <div class="flex items-center space-x-4">
                        <img 
                          :src="avatarPreview || profile.avatar_url || getAvatarUrl(editedProfile.fullname)" 
                          :alt="editedProfile.fullname"
                          class="w-20 h-20 object-cover rounded-full border-2 border-emerald-300"
                        />
                        <input
                          type="file"
                          id="avatar"
                          ref="fileInput"
                          @change="handleFileUpload"
                          accept="image/*"
                          class="hidden"
                        />
                        <button
                          type="button"
                          @click="$refs.fileInput.click()"
                          class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition"
                        >
                          Choose File
                        </button>
                      </div>
                    </div>

                    <!-- Basic Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-1">
                        <label for="fullname" class="block text-sm font-medium text-emerald-800">Full Name</label>
                        <input
                          type="text"
                          id="fullname"
                          v-model="editedProfile.fullname"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div class="space-y-1">
                        <label for="university" class="block text-sm font-medium text-emerald-800">University</label>
                        <input
                          type="text"
                          id="university"
                          v-model="editedProfile.university"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-1">
                        <label for="email" class="block text-sm font-medium text-emerald-800">Email</label>
                        <input
                          type="email"
                          id="email"
                          v-model="editedProfile.email"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div class="space-y-1">
                        <label for="fbemail" class="block text-sm font-medium text-emerald-800">Facebook Account</label>
                        <input
                          type="text"
                          id="fbemail"
                          v-model="editedProfile.fbemail"
                          class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label for="learning_goals" class="block text-sm font-medium text-emerald-800">Learning Goals</label>
                      <textarea
                        id="learning_goals"
                        v-model="editedProfile.learning_goals"
                        rows="3"
                        class="w-full px-3 py-2 bg-white border border-emerald-300 rounded-md text-emerald-900 focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your learning goals separated by commas"
                      ></textarea>
                    </div>
                  </div>

                  <div class="flex gap-4 justify-end mt-6">
                    <button
                      type="button"
                      @click="closeEditModal"
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
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
import { Facebook, Mail, XIcon } from 'lucide-vue-next'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { supabase } from '@/supabaseClient'

// State
const profile = ref({
  id: '',
  fullname: '',
  occupation: '',
  university: '',
  email: '',
  fbemail: '',
  specialization: '',
  description: '',
  skills: '',
  learning_goals: '',
  avatar_url: '',
})

const reviews = ref([])
const transactions = ref([])
const loading = ref(true)
const error = ref(null)
const isEditModalOpen = ref(false)
const editedProfile = ref({ ...profile.value })
const avatarPreview = ref(null)
const fileInput = ref(null)

// Computed
const hasContacts = computed(() => profile.value.email || profile.value.fbemail)
const skillsList = computed(() => 
  profile.value.skills ? profile.value.skills.split(',').map(skill => skill.trim()) : []
)
const learningGoalsList = computed(() => 
  profile.value.learning_goals ? profile.value.learning_goals.split(',').map(goal => goal.trim()) : []
)
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 'N/A'
  const total = reviews.value.reduce((acc, review) => acc + review.star, 0)
  return (total / reviews.value.length).toFixed(1)
})

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = null

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    if (!user) throw new Error('No user found')

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users_info')
      .select('*')
      .eq('auth_users_id', user.id)
      .single()

    if (userError) throw userError
    if (!userData) throw new Error('Profile not found')

    profile.value = userData

    // Fetch reviews with comments
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('review_list')
      .select(`
        *,
        reviews:reviews_id (
          comments
        )
      `)
      .eq('users_info_id', userData.id)
      .order('created_at', { ascending: false })

    if (reviewsError) throw reviewsError
    reviews.value = reviewsData || []

    // Fetch transactions through user_transactions junction table
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('user_transactions')
      .select(`
        transactions (
          id,
          created_at,
          location,
          preferred_time_date,
          subject,
          type,
          isCompleted
        )
      `)
      .eq('users_info_id', userData.id)
      .order('created_at', { ascending: false })

    if (transactionsError) throw transactionsError
    transactions.value = transactionsData?.map(t => t.transactions) || []

  } catch (e) {
    console.error('Error fetching profile:', e)
    error.value = 'Failed to load profile. Please try again later.'
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  try {
    loading.value = true
    error.value = null

    let avatar_url = profile.value.avatar_url

    if (fileInput.value?.files.length > 0) {
      const file = fileInput.value.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile_picture')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile_picture')
        .getPublicUrl(filePath)

      avatar_url = publicUrl
    }

    const updatedProfile = {
      ...editedProfile.value,
      avatar_url
    }

    const { error: updateError } = await supabase
      .from('users_info')
      .update(updatedProfile)
      .eq('id', profile.value.id)

    if (updateError) throw updateError

    profile.value = updatedProfile
    isEditModalOpen.value = false
    avatarPreview.value = null

  } catch (e) {
    console.error('Error updating profile:', e)
    error.value = e.message || 'Failed to update profile. Please try again later.'
  } finally {
    loading.value = false
  }
}

const openEditModal = () => {
  editedProfile.value = { ...profile.value }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editedProfile.value = { ...profile.value }
  avatarPreview.value = null
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getAvatarUrl = (fullname) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`
}

onMounted(() => {
  fetchProfile()
})
</script>