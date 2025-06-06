<template>
  <div class="app-container">
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo-container">
          <h1 class="logo">Музыкальный Менеджер</h1>
        </div>
        
        <nav class="nav-desktop">
          <ul class="nav-links">
            <li 
              v-for="(item, index) in navItems" 
              :key="index"
              :class="{ active: isActive(item.route) }"
              @click="goTo(item.route)"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </nav>
        
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <span>☰</span>
        </button>
      </div>
      
      <div class="mobile-menu" :class="{ 'menu-open': mobileMenuOpen }">
        <ul class="mobile-nav-links">
          <li 
            v-for="(item, index) in navItems" 
            :key="index"
            :class="{ active: isActive(item.route) }"
            @click="goToMobile(item.route)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer" v-if="!isAuthPage">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-logo">
            <h2>Музыкальный Менеджер</h2>
            <p>Управление музыкальными группами, песнями и гастролями</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h3>Навигация</h3>
              <ul>
                <li v-for="(item, index) in navItems" :key="index" @click="goTo(item.route)">
                  {{ item.name }}
                </li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Контакты</h3>
              <ul>
                <li>Email: info@musicmanager.com</li>
                <li>Телефон: +7 (999) 123-45-67</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Музыкальный Менеджер. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false,
      navItems: [
        { name: 'Группы', route: 'groups'},
        { name: 'Песни', route: 'songs'},
        { name: 'Гастроли', route: 'tours'},
        { name: 'Аналитика', route: 'analytics'},
        {name: 'Профль', route: 'profile'}
      ]
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    isAuthPage() {
    return this.$route.path === '/auth';
  }
  },
  methods: {
    goTo(route) {
      this.$router.push(`/${route}`);
    },
    goToMobile(route) {
      this.$router.push(`/${route}`);
      this.mobileMenuOpen = false;
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    isActive(route) {
      return this.$route.path.includes(`/${route}`);
    }
  }
}
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #0f172a;
  color: white;
  line-height: 1.6;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navbar */
.navbar {
  background-color: #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #34d399;
  margin: 0;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-links li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #34d399;
}

.nav-links li.active {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
}

.nav-icon {
  font-size: 1.25rem;
}

/* Mobile menu */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  background-color: #1e293b;
  padding: 1rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-menu.menu-open {
  max-height: 300px;
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-links li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.mobile-nav-links li:hover,
.mobile-nav-links li.active {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
}

/* Main content */
.main-content {
  flex: 1;
  background-color: #0f172a;
}

/* Footer */
.footer {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.footer-logo {
  max-width: 300px;
}

.footer-logo h2 {
  color: #34d399;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.footer-logo p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-section h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  position: relative;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: #34d399;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.75rem;
  color: #94a3b8;
  transition: color 0.2s;
  cursor: pointer;
}

.footer-section li:hover {
  color: #34d399;
}

.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
  }
  
  .nav-desktop {
    display: none;
  }
  
  .mobile-menu-button {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-logo {
    max-width: 100%;
  }
}
</style>
