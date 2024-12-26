import { createRouter, createWebHistory } from 'vue-router';  
import { supabase } from "@/supabaseClient";
import Home from '../views/Home.vue'; 
import Dashboard from '../views/dashboard.vue';
import DashboardTutors from '../views/dashboardTutors.vue'; 
import Auth from '../views/AuthPage.vue';

const routes = [ 
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
  }, 
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboardTutors',
    name: 'DashboardTutors',
    component: DashboardTutors,
    meta: { requiresAuth: true },
  },
  {
    path: '/authpage',
    name: 'Auth',
    component: Auth,
  },
];

const router = createRouter({ 
  history: createWebHistory(), 
  routes, 
}); 
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { user } = session;

    // Fetch user profile using auth_users_id
    const { data: profile, error } = await supabase
      .from('users_info')
      .select('occupation')
      .eq('auth_users_id', user.id) // Use auth_users_id to match UUID from auth.users
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return next({ path: '/authpage' });
    }

    // Redirect based on occupation
    if (to.path === '/') {
      if (profile?.occupation === 'Student') {
        return next({ path: '/dashboard' });
      } else if (profile?.occupation === 'Tutor') {
        return next({ path: '/dashboardTutors' });
      } else {
        console.warn("Unknown occupation:", profile?.occupation);
        return next({ path: '/authpage' });
      }
    }
  } else {
    // No session, handle auth route and restricted access
    if (to.path === '/authpage') {
      return next(); // Allow access to auth page
    }

    if (to.meta.requiresAuth) {
      return next({ path: '/authpage' }); // Redirect to auth if route requires auth
    }
  }

  // Default: Allow navigation
  next();
});



export default router;
