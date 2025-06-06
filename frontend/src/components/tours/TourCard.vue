<template>
  <div class="tours-grid">
    <div class="tour-card" v-for="tour in tours" :key="tour.id">
      <div class="card-content">
        <div class="tour-header">
          <h3>{{ tour.name }}</h3>
          <div class="tour-group">{{ getGroupName(tour.groupID) }}</div>
        </div>
        
        <div class="tour-info">
          <div class="info-item">

            <div class="info-text">
              <span class="info-label">Даты</span>
              <span class="info-value">{{ formatDate(tour.startDate) }} — {{ formatDate(tour.endDate) }}</span>
            </div>
          </div>
          
          <div class="info-item">

            <div class="info-text">
              <span class="info-label">Средняя цена билета</span>
              <span class="info-value">{{ tour.avgPrice }} ₽</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="card-actions">
        <button @click.stop="$emit('edit', tour)" class="edit-button">
          <span class="button-icon">✎</span>
          <span>Редактировать</span>
        </button>
        <button @click.stop="$emit('delete', tour.id)" class="delete-button">
          <span class="button-icon">×</span>
          <span>Удалить</span>
        </button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'TourCard',
  props: {
    tours: Array,
    groups: Array
  },
  emits: ['edit', 'delete'],
  methods: {
    getGroupName(groupID) {
      const group = this.groups.find(g => g.id === groupID)
      return group ? group.name : 'Неизвестная группа'
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>
  
<style scoped>
.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.tour-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tour-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(52, 211, 153, 0.3);
}

.card-content {
  padding: 1.5rem;
  flex: 1;
}

.tour-header {
  margin-bottom: 1.25rem;
}

.tour-card h3 {
  margin: 0 0 0.5rem;
  color: #34d399;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tour-group {
  display: inline-block;
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tour-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-icon {
  font-size: 1.25rem;
  line-height: 1;
  opacity: 0.8;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
}

.card-actions {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.tour-card:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.edit-button,
.delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
}

.button-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.edit-button:hover {
  background-color: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.delete-button:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

@media (max-width: 768px) {
  .tours-grid {
    grid-template-columns: 1fr;
  }
}
</style>
