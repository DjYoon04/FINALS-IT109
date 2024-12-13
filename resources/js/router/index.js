import { createRouter, createWebHistory } from 'vue-router';  
import { supabase } from "@/supabaseClient";
import Home from '../views/Home.vue'; 
import dashboard from '../views/dashboard.vue';
import dashboardTutors from '../views/dashboardTutors.vue'; 
import Auth from '../views/AuthPage.vue';

const routes = [ 
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
  }, 
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard
  },
  {
    path: '/dashboardTutors',
    name: 'dashboardTutors',
    component: dashboardTutors
  },
  {
    path: '/authpage',
    name: 'Auth',
    component: Auth
  },
];

const router = createRouter({ 
  history: createWebHistory(), 
  routes, 
}); 

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { user } = session;
    // Fetch additional user profile details if needed
    const { data: profile } = await supabase
      .from('users_info')
      .select('occupation')
      .eq('id', user.id)
      .single();

    // Redirect based on occupation
    if (to.path === '/') {
      if (profile?.occupation === 'Student') {
        return next({ path: '/dashboard' });
      } else if (profile?.occupation === 'Tutor') {
        return next({ path: '/dashboardTutors' });
      }
    }
  }

  // Redirect unauthenticated users to the Auth page for protected routes
  if (!session && (to.path === '/dashboard' || to.path === '/dashboardTutors')) {
    return next({ path: '/' });
  }

  // Redirect to '/' if the route does not match any defined paths
  if (!routes.some(route => route.path === to.path)) {
    return next({ path: '/' });
  }

  // Allow navigation
  next();
});

export default router;
