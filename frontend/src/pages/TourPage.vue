<template>
  <div class="tour-page">
    <div class="page-header">
      <h1>Гастроли</h1>
      <div class="header-actions">
        <button v-if="currentUserId!=null"
          @click="showForm = true"
          class="add-button"
        >
          <span class="icon">+</span>
          <span>Добавить тур</span>
        </button>
      </div>
    </div>
    
    <div class="search-filter">
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск туров..." 
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-container">
        <select v-model="filterGroup" class="filter-select">
          <option value="">Все группы</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
        
        <select v-model="filterYear" class="filter-select">
          <option value="">Все годы</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
  
    <div class="content-container">
      <div v-if="filteredTours.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>Нет добавленных туров</h3>
        <p>Нажмите "Добавить тур", чтобы создать первую запись</p>
      </div>
      
      <TourCard
        v-else
        :tours="filteredTours"
        :groups="groups"
        @edit="editTour"
        @delete="confirmDeleteTour"
      />
    </div>
  
    <TourForm
      :visible="showForm || !!editingTour"
      :editableTour="editingTour"
      :groups="groups"
      :cities="cities"
      @add-tour="addTour"
      @update-tour="updateTour"
      @close="closeForm"
    />
  </div>
</template>
  
<script>
import axios from 'axios'
import TourCard from '../components/tours/TourCard.vue'
import TourForm from '../components/tours/TourForm.vue'
  
export default {
  name: 'TourPage',
  components: { TourCard, TourForm },
  data() {
    return {
      tours: [],
      groups: [],
      cities: [],
      showForm: false,
      editingTour: null,
      searchQuery: '',
      filterGroup: '',
      filterYear: '',
      currentUserId: null
    }
  },
  computed: {
    availableYears() {
      const years = this.tours
        .map(tour => new Date(tour.startDate).getFullYear())
        .sort((a, b) => b - a); // Sort descending
      
      return [...new Set(years)]; // Remove duplicates
    },
    filteredTours() {
      return this.tours.filter(tour => {
        // Search query filter
        const matchesSearch = !this.searchQuery || 
          tour.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        // Group filter
        const matchesGroup = !this.filterGroup || tour.groupID === this.filterGroup;
        
        // Year filter
        const tourYear = new Date(tour.startDate).getFullYear();
        const matchesYear = !this.filterYear || tourYear === parseInt(this.filterYear);
        
        return matchesSearch && matchesGroup && matchesYear;
      });
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.currentUserId = user?.id ?? null;
    this.fetchTours()
    this.fetchGroups()
    this.fetchCities()
  },
  methods: {
    fetchTours() {
      axios.get('http://localhost:3000/api/tours')
        .then(res => this.tours = res.data)
        .catch(error => {
          console.error('Ошибка загрузки туров', error)
        })
    },
    fetchGroups() {
      axios.get('http://localhost:3000/api/groups')
        .then(res => this.groups = res.data)
        .catch(error => {
          console.error('Ошибка загрузки групп', error)
        })
    },
    fetchCities(){
      axios.get('http://localhost:3000/api/cities')
        .then(res => this.cities = res.data)
        .catch(error => {
          console.error('Ошибка загрузки городов', error)
        })
    },
    addTour(newTour) {
      const payload = { ...newTour };
      delete payload.id;
      console.log('Перед отправкой:', JSON.parse(JSON.stringify(payload)));

      axios.post('http://localhost:3000/api/tours', payload)
        .then(() => {
          this.fetchTours();
          this.closeForm();
        })
        .catch(error => {
          console.error('Ошибка добавления тура', error);
        });
    },
    updateTour(tour) {
      const payload = { ...tour };
      delete payload.id;

      if (Array.isArray(payload.cities) && payload.cities.length > 0) {
        const prices = payload.cities.map(c => parseFloat(c.ticketPrice));
        payload.avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
      } else {
        payload.avgPrice = 0;
      }

      console.log('Перед обновлением:', JSON.parse(JSON.stringify(payload)));

      axios.put(`http://localhost:3000/api/tours/${tour.id}`, payload)
        .then((res) => {
          // 🔁 Обновить конкретный элемент в массиве
          const updatedTour = res.data;
          const index = this.tours.findIndex(t => t.id === tour.id);
          if (index !== -1) this.tours.splice(index, 1, updatedTour);

          this.closeForm();
        })
        .catch(error => {
          console.error('Ошибка обновления тура', error);
        });
    },

    confirmDeleteTour(id) {
      if (confirm('Вы уверены, что хотите удалить этот тур?')) {
        this.deleteTour(id);
      }
    },
    deleteTour(id) {
      axios.delete(`http://localhost:3000/api/tours/${id}`)
        .then(() => this.fetchTours())
        .catch(error => {
          console.error('Ошибка удаления тура', error)
        })
    },
    async editTour(tour) {
      try {
        const res = await axios.get(`http://localhost:3000/api/tourCities/${tour.id}`);
        this.editingTour = {
          ...tour,
          cities: res.data.map(city => ({
            cityID: city.cityID,
            date: city.date,
            ticketPrice: city.ticketPrice
          }))
        };
      } catch (err) {
        console.error('Ошибка при получении городов тура:', err);
      }
    },
    closeForm() {
      this.showForm = false
      this.editingTour = null
    }
  }
}
</script>
  
<style scoped>
.tour-page {
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

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.add-button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
}

.add-button .icon {
  font-size: 1.25rem;
  line-height: 1;
}

.search-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-container {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #34d399;
  background-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.filter-container {
  display: flex;
  gap: 1rem;
}

.filter-select {
  background-color: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
}

.filter-select:focus {
  border-color: #34d399;
  background-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
}

.content-container {
  margin-top: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #94a3b8;
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: #64748b;
  max-width: 300px;
}

@media (max-width: 768px) {
  .tour-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-container {
    flex-direction: column;
  }
}
</style>
