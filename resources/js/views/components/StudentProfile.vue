<template>
  <div class="mx-5">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mt-5 mb-5 relative">
      <div class="w-32 h-32 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-600 relative">
        <img v-if="profile.picture" :src="profile.picture" alt="Profile Picture" class="w-full h-full object-cover rounded-full" />
        <User v-else size="64" />
      </div>
      <div class="text-center md:text-left pt-5">
        <h2 class="text-2xl font-semibold text-emerald-800 flex items-center justify-center md:justify-start">
          {{ profile.name }}
          <button @click="openEditModal" class="ml-2 px-2 bg-white text-emerald-600 p-1 rounded-full hover:bg-gray-100 transition duration-200">
            ✎
          </button>
        </h2>
        <p class="text-emerald-600">{{ profile.role }}</p>
        <p class="text-gray-600">{{ profile.year }} • {{ profile.major }}</p>
      </div>
    </div>

    <!-- About Section -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold text-emerald-800 mb-2">About Me</h3>
      <p class="text-gray-600 mb-4">
        {{ profile.about }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium text-emerald-700">University</h4>
          <p class="text-gray-600">{{ profile.university }}</p>
        </div>
      </div>
    </section>

    <!-- Learning Goals -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold text-emerald-800 mb-2">Learning Goals</h3>
      <ul class="list-disc list-inside text-gray-600">
        <li v-for="(goal, index) in profile.learningGoals" :key="index">{{ goal }}</li>
      </ul>
    </section>

    <!-- Current Courses -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold text-emerald-800 mb-2">Current Courses</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="course in currentCourses" :key="course.name" class="bg-emerald-100 p-4 rounded">
          <h4 class="font-medium text-emerald-800">{{ course.name }}</h4>
          <p class="text-gray-600">{{ course.description }}</p>
        </div>
      </div>
    </section>

    <!-- Tutor's Comment -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold text-emerald-800 mb-2">Tutor's Comment</h3>
        <div class="bg-emerald-100 p-4 rounded">
          <p class="text-gray-700 italic">
            "Alex is an exceptionally fast learner with a keen interest in AI. His ability to grasp complex concepts quickly is impressive. However, he sometimes rushes through foundational topics, which can lead to gaps in understanding. I recommend focusing on building a strong theoretical base alongside practical applications."
          </p>
          <p class="text-emerald-600 mt-2">- Dr. Emily Chen, AI Specialist</p>
        </div>
      </section>

    <!-- Edit Profile Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form @submit.prevent="saveProfile">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Name
            </label>
            <input v-model="editedProfile.name" id="name" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="about">
              About Me
            </label>
            <textarea v-model="editedProfile.about" id="about" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Upload Profile Picture
            </label>
            <input type="file" @change="handleFileUpload" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Save Changes
            </button>
            <button @click="closeEditModal" type="button" class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User } from 'lucide-vue-next'

const profile = ref({
  name: 'Bernie Cherry Rante',
  role: 'University Student',
  year: '3rd Year',
  major: 'Computer Science Major',
  picture: '', // Placeholder for profile picture
  about: 'Dedicated computer science student with a passion for artificial intelligence and machine learning.',
  university: 'Tech State University',
  learningGoals: [
    'Master advanced machine learning algorithms',
    'Improve proficiency in Python and TensorFlow',
    'Understand and implement neural network architectures',
    'Prepare for AI research internships'
  ]
})

const currentCourses = ref([
  {
    name: 'Advanced Machine Learning',
    description: 'In-depth study of machine learning algorithms and their applications.'
  },
  {
    name: 'Neural Networks and Deep Learning',
    description: 'Fundamentals of neural networks and deep learning architectures.'
  },
  {
    name: 'Big Data Analytics',
    description: 'Techniques for processing and analyzing large-scale datasets.'
  },
  {
    name: 'AI Ethics and Governance',
    description: 'Ethical considerations and governance frameworks in AI development.'
  },
])

const isEditModalOpen = ref(false)
const editedProfile = ref({ ...profile.value })

const openEditModal = () => {
  editedProfile.value = { 
    ...profile.value,
    learningGoalsText: profile.value.learningGoals.join('\n')
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const saveProfile = () => {
  profile.value = {
    ...editedProfile.value,
    learningGoals: editedProfile.value.learningGoalsText.split('\n').filter(goal => goal.trim() !== '')
  }
  closeEditModal()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      editedProfile.value.picture = reader.result // Set the Base64 string as the profile picture
    }
    reader.readAsDataURL(file)
  }
}
</script>
