<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1>Аналитика</h1>
      <div class="header-actions">
        <button class="refresh-button" @click="fetchAnalytics">
          <span class="refresh-icon">↻</span>
          <span>Обновить данные</span>
        </button>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="analytics-card">
        <div class="card-header">
          <h2>Популярные песни</h2>
          <div class="card-badge">Топ {{ topSongs.length }}</div>
        </div>
        <div class="top">
          <TopSongs :songs="topSongs" :groups="groups"/>
        </div>
        
      </div>
      
      <div class="analytics-card">
        <div class="card-header">
          <h2>Лучшие композиторы</h2>
          <div class="card-badge">Топ {{ topComposer.length }}</div>
        </div>
        <div class="top">
          <TopComposer :composers="topComposer"/>
        </div>
        
      </div>
      
      <div class="analytics-card full-width">
        <div class="card-header">
          <h2>Песни по годам</h2>
          <div class="card-badge">Статистика</div>
        </div>
        <div class="top">
          <SongByYear :stats="songByYear"/>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TopSongs from '../components/analytics/TopSongs.vue';
import TopComposer from '../components/analytics/TopComposers.vue';
import SongByYear from '../components/analytics/SongsByYear.vue';

export default{
  name: 'AnalyticsPage',
  components: {TopSongs, TopComposer, SongByYear},
  data(){
    return {
      groups:[],
      topSongs: [],
      topComposer: [],
      songByYear: [],
      isLoading: true
    }
  },
  mounted() {
    this.fetchAnalytics()
  },
  methods: {
  fetchAnalytics() {
    this.isLoading = true;

    axios.post('http://localhost:3000/api/analytics/refresh-ratings')
      .then(() => {
        return Promise.all([
          axios.get('http://localhost:3000/api/analytics/top-songs'),
          axios.get('http://localhost:3000/api/analytics/top-composers'),
          axios.get('http://localhost:3000/api/analytics/songs-by-year'),
          axios.get('http://localhost:3000/api/groups')
        ]);
      })
      .then(([topSongsRes, topComposerRes, songByYearRes, groupsRes]) => {
        this.topSongs = topSongsRes.data;
        this.topComposer = topComposerRes.data;
        this.songByYear = songByYearRes.data;
        this.groups = groupsRes.data;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Ошибка при обновлении аналитики:', error);
        this.isLoading = false;
      });
  }
}

}
</script>

<style scoped>
.analytics-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #34d399;
  margin: 0;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.refresh-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.analytics-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.analytics-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
  border-color: rgba(52, 211, 153, 0.2);
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #34d399;
}

.card-badge {
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.top {
  padding: 1rem;
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
