<template>
  <div class="song-page">
    <div class="page-header">
      <h1>Песни</h1>
      <div class="header-actions">
        <button v-if="currentUserId!=null"
          @click="showAddBandModal = true"
          class="add-button"
        >
          <span class="icon">+</span>
          <span>Добавить песню</span>
        </button>
      </div>
    </div>
    
    <div class="search-filter">
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск песен..." 
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
      <SongTable 
        :songs="filteredSongs" 
        :groups="groups" 
        :albums="albums" 
        :currentUserId="currentUserId"
        :userRole="userRole"
        @delete="deleteSong" 
        @edit="editSong" 
      />
    </div>
    
    <SongForm 
      :visible="showAddBandModal || editingSong !== null" 
      :groups="groups" 
      :albums="albums" 
      :editableSong="editingSong" 
      :currentUserId="currentUserId"
      :userRole="userRole"
      @add-song="addSong" 
      @update-song="updateSong" 
      @close="closeModal"
    />
  </div>
</template>
  
<script>
import axios from 'axios'
import { toRaw } from 'vue';
import SongForm from '../components/songs/SongForm.vue'
import SongTable from '../components/songs/SongTable.vue'
  
export default {
  name: 'SongPage',
  components: { SongForm, SongTable },
  data() {
    return {
      songs: [],
      groups: [],
      albums: [],
      editingSong: null,
      showAddBandModal: false,
      searchQuery: '',
      filterGroup: '',
      filterYear: '',
      currentUserId: null,
      userRole: null
    }
  },
  computed: {
    availableYears() {
      const years = this.songs
        .map(song => song.year)
        .filter(year => year) // Remove null/undefined
        .sort((a, b) => b - a); // Sort descending
      
      return [...new Set(years)]; // Remove duplicates
    },
    filteredSongs() {
      return this.songs.filter(song => {
        // Search query filter
        const matchesSearch = !this.searchQuery || 
          song.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (song.composer && song.composer.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (song.lyricist && song.lyricist.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (song.singer && song.singer.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        // Group filter
        const matchesGroup = !this.filterGroup || song.groupID === this.filterGroup;
        
        // Year filter
        const matchesYear = !this.filterYear || song.year === this.filterYear;
        
        return matchesSearch && matchesGroup && matchesYear;
      });
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.currentUserId = user?.id ?? null;
    this.userRole = user?.role ?? null
    this.fetchSongs()
    this.fetchGroups()
    this.fetchAlbums()
  },
  methods: {
    closeModal() {
      this.showAddBandModal = false
      this.editingSong = null
    },
    fetchSongs() {
      axios.get('http://localhost:3000/api/songs')
        .then(res => this.songs = res.data)
        .catch(error => {
          console.error('Ошибка загрузки песен', error)
        })
    },
    fetchGroups() {
      axios.get('http://localhost:3000/api/groups')
        .then(res => this.groups = res.data)
        .catch(error => {
          console.error('Ошибка загрузки групп', error)
        })
    },
    fetchAlbums() {
      axios.get('http://localhost:3000/api/albums')
        .then(res => this.albums = res.data)
        .catch(error => {
          console.error('Ошибка загрузки альбомов', error)
        })
    },
    addSong(song) {
      axios.post('http://localhost:3000/api/songs', song)
        .then(() => this.fetchSongs())
        .catch(error => {
          console.error('Ошибка добавления песни', error)
        })
    },
    deleteSong(id) {
      axios.delete(`http://localhost:3000/api/songs/${id}`)
        .then(() => this.fetchSongs())
        .catch(err => console.error('Ошибка удаления песни:', err))
    },
    editSong(song) {
      this.editingSong = { ...song }
    },
    updateSong(updatedSong) {
      const songToUpdate = toRaw(updatedSong);
      
      axios.put(`http://localhost:3000/api/songs/${songToUpdate.id}`, songToUpdate)
        .then(() => {
          this.fetchSongs();
          this.editingSong = null;
        })
        .catch(err => console.error('Ошибка редактирования:', err));
    }
  }
}
</script>

<style scoped>
.song-page {
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

@media (max-width: 768px) {
  .song-page {
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
