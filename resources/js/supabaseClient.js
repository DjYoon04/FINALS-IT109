// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ojdkrwslrkglfjyksvwi.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZGtyd3NscmtnbGZqeWtzdndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTE1MTEsImV4cCI6MjA0ODk4NzUxMX0.Uia2PiDh02Mjlvy0nhspv2c0l8u6T7s1Glnd8eaD33k"; // Replace with your anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google Auth
async function loginwithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
    });
    return { data, error }; // Return data and error for handling in the component
}

async function handleLogout() {
    await supabase.auth.signOut(); // Sign out the current user
    localStorage.removeItem("access_token"); // Clear the token
    this.$router.push("/auth"); // Redirect to the login page
}

supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Store the access token
        localStorage.setItem("access_token", session.access_token);
    } else {
        // Remove token when logged out
        localStorage.removeItem("access_token");
    }
});

// Success Notification
function successNotification(message, seconds = 0) {
    document.querySelector(".alert-success").classList.remove("d-none");
    document.querySelector(".alert-success").classList.add("d-block");
    document.querySelector(".alert-success").innerHTML = message;
    a;
    if (seconds != 0) {
        setTimeout(function () {
            document
                .querySelector(".alert-success")
                .classList.remove("d-block");
            document.querySelector(".alert-success").classList.add("d-none");
        }, seconds * 1500);
    }
}

// Error Notification
function errorNotification(message, seconds = 0) {
    document.querySelector(".alert-danger").classList.remove("d-none");
    document.querySelector(".alert-danger").classList.add("d-block");
    document.querySelector(".alert-danger").innerHTML = message;

    if (seconds !== 0) {
        setTimeout(function () {
            document.querySelector(".alert-danger").classList.remove("d-block");
            document.querySelector(".alert-danger").classList.add("d-none");
        }, seconds * 1500);
    }
}

export { supabase, successNotification, errorNotification, loginwithGoogle };