<template>
    <div class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col bg-white shadow-xl">
              <div class="flex-1 h-0 overflow-y-auto">
                <header class="p-6 flex justify-between items-center">
                  <h2 class="text-lg font-medium text-gray-900">{{ headerTitle }}</h2>
                  <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                    <XIcon class="h-6 w-6" />
                  </button>
                </header>
                
                <component :is="currentComponent" :user="user" @navigate="navigate" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { XIcon, LockIcon, HelpCircleIcon, LogOutIcon } from 'lucide-vue-next'
  
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['close'])
  
  const currentSection = ref('profile')
  
  const navigate = (section) => {
    currentSection.value = section
  }
  
  const headerTitle = computed(() => {
    switch (currentSection.value) {
      case 'profile':
        return 'Profile Settings'
      case 'changePassword':
        return 'Change Password'
      case 'helpSupport':
        return 'Help & Support'
      default:
        return 'Settings'
    }
  })
  
  const currentComponent = computed(() => {
    switch (currentSection.value) {
      case 'profile':
        return ProfileSettings
      case 'changePassword':
        return ChangePassword
      case 'helpSupport':
        return HelpSupport
      default:
        return ProfileSettings
    }
  })
  
  const logOut = () => {
    // Implement logout logic here
    console.log('Logging out')
    emit('close')
  }
  
  // ProfileSettings component
  const ProfileSettings = {
    props: ['user'],
    emits: ['navigate'],
    setup(props, { emit }) {
      const menuItems = [
        { label: 'Change Password', section: 'changePassword', icon: LockIcon },
        { label: 'Help & Support', section: 'helpSupport', icon: HelpCircleIcon },
        { label: 'Log Out', section: 'logout', icon: LogOutIcon },
      ]
  
      return { menuItems, emit }
    },
    template: `
      <div class="p-6">
        <div class="flex flex-col items-center">
          <div class="relative h-32 w-32 rounded-full overflow-hidden">
            <img
              :src="user.profileImage"
              :alt="user.name + '\'s profile picture'"
              class="h-full w-full object-cover"
            />
          </div>
          <h2 class="mt-4 text-xl font-semibold">{{ user.name }}</h2>
          <p class="text-sm text-gray-500">{{ user.role }}</p>
        </div>
        <nav class="mt-6">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.section">
              <button
                @click="emit('navigate', item.section)"
                class="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <component :is="item.icon" class="h-5 w-5" />
                <span>{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    `
  }
  
  // ChangePassword component
  const ChangePassword = {
    emits: ['navigate'],
    setup(props, { emit }) {
      const passwordForm = ref({
        current: '',
        new: '',
        confirm: ''
      })
  
      const changePassword = () => {
        // Implement change password logic here
        console.log('Changing password:', passwordForm.value)
        emit('navigate', 'profile')
      }
  
      return { passwordForm, changePassword }
    },
    template: `
      <div class="p-6">
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" id="current-password" v-model="passwordForm.current" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" id="new-password" v-model="passwordForm.new" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" id="confirm-password" v-model="passwordForm.confirm" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Change Password
          </button>
        </form>
      </div>
    `
  }
  
  // HelpSupport component
  const HelpSupport = {
    setup() {
      const faqs = [
        {
          question: 'How do I book a tutor?',
          answer: 'You can book a tutor by navigating to the "Find a Tutor" section and selecting an available time slot.'
        },
        {
          question: 'How do I cancel a session?',
          answer: 'To cancel a session, go to your "Booking Status" and click on the cancel button next to the relevant session.'
        },
        {
          question: 'How can I contact support?',
          answer: 'For additional support, please email us at support@tutorhive.com or use the chat feature in the bottom right corner of the screen.'
        }
      ]
  
      return { faqs }
    },
    template: `
      <div class="p-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
          <ul class="space-y-4">
            <li v-for="(faq, index) in faqs" :key="index">
              <h4 class="text-base font-medium text-gray-900">{{ faq.question }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ faq.answer }}</p>
            </li>
          </ul>
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900">Contact Support</h3>
            <p class="mt-2 text-sm text-gray-500">
              If you need further assistance, please contact our support team at
              <a href="mailto:support@tutorhive.com" class="text-indigo-600 hover:text-indigo-500">support@tutorhive.com</a>.
            </p>
          </div>
        </div>
      </div>
    `
  }
  </script>