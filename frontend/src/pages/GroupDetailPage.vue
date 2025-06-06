<template>
  <div class="detail-page">
    <div class="page-header">
      <div class="header-content">
        <h1>{{ group.name }}</h1>
        <div class="group-meta">
          <div class="meta-item">
            <span class="meta-label">Год основания</span>
            <span class="meta-value">{{ group.year }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Страна</span>
            <span class="meta-value">{{ group.country }}</span>
          </div>
        </div>
      </div>
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>Назад</span>
      </button>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2>Участники</h2>
        <span class="member-count">{{ members.length }} человек</span>
      </div>
      
      <div class="members-grid">
        <div 
          class="member-card"
          v-for="member in members" 
          :key="member.id">
          <div class="member-avatar">
            {{ getInitials(member.name, member.surname) }}
          </div>
          <div class="member-name">
            {{ member.surname }} {{ member.name }}
          </div>
          <div class="member-role">{{ member.role }}</div>

          <div class="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-header">
              <div class="tooltip-avatar">{{ getInitials(member.name, member.surname) }}</div>
              <div class="tooltip-name">{{ member.surname }} {{ member.name }}</div>
            </div>
            <div class="tooltip-content">
              <p><span>Роль:</span> {{ member.role }}</p>
              <p><span>Дата присоединения:</span> {{ formatDate(member.joinDate) }}</p>
              <p><span>Инструмент:</span> {{ member.instrument }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-section">
      <div class="section-header">
        <h2>Альбомы</h2>
        <span class="album-count">{{ albums.length }} альбомов</span>
      </div>
      
      <div class="albums-grid">
        <div v-for="album in albums" :key="album.id" class="album-card">
          <div class="album-cover">
            <div class="album-icon">💿</div>
          </div>
          <div class="album-info">
            <div class="album-name">{{ album.name }}</div>
            <div class="album-year" v-if="album.year">{{ album.year }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2>Гастроли</h2>
        <span class="tour-count">{{ tours.length }} туров</span>
      </div>

      <div v-if="tours.length" class="tours-container">
        <div v-for="tour in tours" :key="tour.id" class="tour-block">
          <div class="tour-header">
            <h3>{{ tour.name }}</h3>
            <div class="tour-dates">
              {{ formatDate(tour.startDate) }} — {{ formatDate(tour.endDate) }}
            </div>
            <div class="tour-price" v-if="tour.avgPrice">
              Средняя цена: <span>{{ tour.avgPrice }} ₽</span>
            </div>
          </div>

          <div class="tour-cities">
            <table class="tour-table">
              <thead>
                <tr>
                  <th>Город</th>
                  <th>Дата</th>
                  <th>Цена билета</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="city in tour.cities" :key="city.id">
                  <td>{{ city.cityName }}</td>
                  <td>{{ formatDate(city.date) }}</td>
                  <td>{{ city.ticketPrice }} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-tours">
        <div class="empty-icon">🎵</div>
        <p>У этой группы пока нет запланированных туров</p>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
  
export default {
  name: 'GroupDetailPage',
  props: {
    id: Number, 
  },
  data() {
    return {
      group: {},
      albums: [],
      tours: [],
      members: []
    };
  },
  mounted() {
    this.fetchGroupDetails();
  },
  methods: {
    fetchGroupDetails() {
      axios.get(`http://localhost:3000/api/groups/${this.id}`)
        .then(response => {
          this.group = response.data;
        });

      axios.get(`http://localhost:3000/api/groups/${this.id}/songs`)
        .then(response => {
          this.songs = response.data;
        });

      axios.get(`http://localhost:3000/api/groups/${this.id}/tours`)
        .then(response => {
          this.tours = response.data;
        });

      axios.get(`http://localhost:3000/api/groups/${this.id}/members`)
        .then(response => {
          this.members = response.data;
        });
        
      axios.get(`http://localhost:3000/api/groups/${this.id}/albums`)
        .then(response => {
          this.albums = response.data;
        });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
    getInitials(firstName, lastName) {
      return (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '');
    },
    goBack() {
      this.$router.go(-1);
    }
  },
};
</script>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #34d399;
  margin: 0 0 1rem;
  position: relative;
}

.group-meta {
  display: flex;
  gap: 2rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.back-button {
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

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.content-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #34d399;
  margin: 0;
  position: relative;
}

.member-count,
.album-count,
.tour-count {
  margin-left: 1rem;
  font-size: 0.95rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

/* Members section */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.member-card {
  position: relative;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 211, 153, 0.3);
}

.member-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.member-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.member-role {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  width: 280px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.tooltip-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #0f172a;
}

.member-card:hover .tooltip {
  opacity: 1;
  visibility: visible;
  bottom: 120%;
  pointer-events: auto;
}

.tooltip-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 0 0;
}

.tooltip-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  margin-right: 0.75rem;
}

.tooltip-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.tooltip-content {
  padding: 1rem;
}

.tooltip-content p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
}

.tooltip-content p span {
  color: #94a3b8;
}

/* Albums section */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.album-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 211, 153, 0.3);
}

.album-cover {
  height: 160px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-icon {
  font-size: 3rem;
}

.album-info {
  padding: 1rem;
}

.album-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.album-year {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Tours section */
.tours-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tour-block {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tour-header {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tour-header h3 {
  margin: 0 0 0.75rem;
  font-size: 1.4rem;
  color: #34d399;
}

.tour-dates {
  font-size: 1rem;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.tour-price {
  font-size: 0.95rem;
  color: #94a3b8;
}

.tour-price span {
  color: #34d399;
  font-weight: 600;
}

.tour-cities {
  padding: 1.5rem;
}

.tour-table {
  width: 100%;
  border-collapse: collapse;
}

.tour-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.95rem;
}

.tour-table th:first-child {
  border-radius: 8px 0 0 8px;
}

.tour-table th:last-child {
  border-radius: 0 8px 8px 0;
}

.tour-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tour-table tr:last-child td {
  border-bottom: none;
}

.empty-tours {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  text-align: center;
}

.empty-tours .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-tours p {
  color: #94a3b8;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .detail-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
  }
  
  .back-button {
    margin-top: 1rem;
    align-self: flex-start;
  }
  
  .group-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .members-grid,
  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .tooltip {
    width: 240px;
  }
}
</style>
