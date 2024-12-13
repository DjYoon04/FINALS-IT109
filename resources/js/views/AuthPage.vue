<template>
  <div
    class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[700px] flex overflow-hidden relative"
      :class="{ 'right-panel-active': !isLogin }"
    >
      <!-- Sign Up Form -->
      <div
        class="w-1/2 p-6 transition-all duration-700 ease-in-out transform absolute top-0 left-0 h-full"
        :class="!isLogin ? 'translate-x-full opacity-100 z-10' : 'opacity-0'"
      >
        <div class="text-center mb-4">
          <div class="inline-block p-2 bg-emerald-100 rounded-full">
            <GraduationCap class="w-12 h-12 text-emerald-600" />
          </div>
          <div class="text-4xl font-bold text-emerald-600">TutorHive</div>
          <p class="text-emerald-600">Learn, Teach, Grow</p>
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-1">
          Join Our Community
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div class="relative">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
                >Full Name</label
              >
              <input
                id="name"
                v-model="name"
                type="text"
                required
                class="block w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm placeholder-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="John Doe"
              />
              <User class="w-5 h-5 text-emerald-400 absolute right-3 top-9" />
            </div>
            <div class="relative">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
                >Email Address</label
              >
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm placeholder-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="you@example.com"
              />
              <Mail class="w-5 h-5 text-emerald-400 absolute right-3 top-9" />
            </div>
            <div class="relative">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
                >Password</label
              >
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm placeholder-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-9 text-emerald-400 focus:outline-none"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
            <div class="relative">
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Confirm Password</label
              >
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm placeholder-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="••••••••"
              />
              <LockIcon class="w-5 h-5 text-emerald-400 absolute right-3 top-9" />
            </div>
            <div class="mt-6 flex space-x-4">
              <button
                type="button"
                @click="userType = 'Tutor'"
                :class="[
                  'w-44 px-2 py-3 text-sm font-medium rounded-lg transition duration-300 ease-in-out transform hover:scale-105',
                  userType === 'Tutor'
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 text-teal-900 hover:bg-gray-200',
                ]"
              >
                Tutor
              </button>
              <button
                type="button"
                @click="userType = 'Student'"
                :class="[
                  'w-44 px-2 py-3 text-sm font-medium rounded-lg transition duration-300 ease-in-out transform hover:scale-105',
                  userType === 'Student'
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 text-teal-900 hover:bg-gray-200',
                ]"
              >
                Student
              </button>
            </div>
          </div>
          <div class="mt-5">
            <button
              type="submit"
              class="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-br from-emerald-500 to-teal-700 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <!-- Sign In Form -->
      <div
        class="w-1/2 p-8 transition-all duration-700 ease-in-out transform absolute top-0 left-0 h-full"
        :class="isLogin ? 'translate-x-0 opacity-100 z-10' : 'opacity-0'"
      >
        <div class="text-center mb-4">
          <div class="inline-block p-2 bg-teal-100 rounded-full mb-4">
            <GraduationCap class="w-12 h-12 text-teal-600" />
          </div>
          <div class="text-4xl font-bold text-teal-600">TutorHive</div>
          <p class="text-teal-600">Learn, Teach, Grow</p>
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div class="relative">
              <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-1"
                >Email Address</label
              >
              <input
                id="loginEmail"
                v-model="email"
                type="email"
                required
                class="block w-full px-4 py-3 bg-teal-50 border border-teal-200 rounded-lg text-sm placeholder-teal-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                placeholder="you@example.com"
              />
              <Mail class="w-5 h-5 text-teal-400 absolute right-3 top-9" />
            </div>
            <div class="relative">
              <label
                for="loginPassword"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Password</label
              >
              <input
                id="loginPassword"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full px-4 py-3 bg-teal-50 border border-teal-200 rounded-lg text-sm placeholder-teal-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-9 text-teal-400 focus:outline-none"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="mt-6">
            <button
              type="submit"
              class="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-br from-emerald-500 to-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Log In
            </button>
          </div>
        </form>
        <div class="mt-4">
          <button
            @click="signInWithGoogle"
            class="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 ease-in-out flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              class="w-6 h-6 mr-2 object-contain"
            />
            Sign up with Google
          </button>
        </div>
      </div>

      <!-- Overlay Container -->
      <div
        class="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out"
        :class="!isLogin ? '-translate-x-full' : ''"
      >
        <div
          class="bg-gradient-to-r from-emerald-500 to-teal-700 text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out"
          :class="!isLogin ? 'translate-x-1/2' : 'translate-x-0'"
        >
          <div
            class="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center px-12 text-center"
          >
            <h2 class="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p class="mb-6">
              To keep connected with us please login with your personal info
            </p>
            <button
              @click="toggleAuthMode"
              class="border-2 border-white text-white rounded-full px-8 py-2 hover:bg-white hover:text-emerald-600 transition duration-300"
            >
              Sign In
            </button>
          </div>
          <div
            class="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center px-12 text-center"
          >
            <h2 class="text-3xl font-bold mb-4">Hello, Friend!</h2>
            <p class="mb-6">Enter your personal details and start journey with us</p>
            <button
              @click="toggleAuthMode"
              class="border-2 border-white text-white rounded-full px-8 py-2 hover:bg-white hover:text-teal-600 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { supabase } from "@/supabaseClient"; // Adjust the import to your Supabase client location
import { GraduationCap, User, Mail, Eye, EyeOff, LockIcon } from "lucide-vue-next";

const isLogin = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const userType = ref(""); // No default value, user will set it by clicking a button
const router = useRouter();

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
  resetForm();
};

const resetForm = () => {
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  showPassword.value = false;
  userType.value = ""; // Reset userType on form switch
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  if (isLogin.value) {
    // Sign-In logic
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (error) throw error;

      // Fetch user details from users_info
      const { data: userInfo, error: userInfoError } = await supabase
        .from("users_info")
        .select("occupation")
        .eq("email", email.value)
        .single();

      if (userInfoError) throw userInfoError;

      // Route based on occupation
      if (userInfo.occupation === "Student") {
        router.push("/dashboard");
      } else if (userInfo.occupation === "Tutor") {
        router.push("/dashboardTutors");
      } else {
        alert("Unknown occupation. Please contact support.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Failed to log in. Please check your email and password.");
    }
  } else {
    // Sign-Up logic
    if (password.value !== confirmPassword.value) {
      alert("Passwords don't match");
      return;
    }

    if (!userType.value) {
      alert("Please select your occupation (Tutor or Student).");
      return;
    }

    try {
      // Sign up the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });

      if (authError) throw authError;

      // Insert user details into users_info
      const { data: userInfo, error: userInfoError } = await supabase
        .from("users_info")
        .insert({
          email: email.value,
          fullname: name.value,
          occupation: userType.value, // Use selected occupation
          auth_users_id: authData.user.id, // Map the user's unique id
        });

      if (userInfoError) throw userInfoError;

      alert("Sign-up successful!");
      resetForm();
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert("Sign-up failed. Please try again.");
    }
  }
};
// Google OAuth logic
const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;

    alert("Google sign-in successful!");
  } catch (error) {
    console.error("Error with Google sign-in:", error.message);
    alert("Google sign-in failed. Please try again.");
  }
};
</script>

<style scoped>
.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.right-panel-active .overlay {
  transform: translateX(50%);
}
</style>
