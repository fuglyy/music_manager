<template>
  <div class="table-container">
    <div class="table-responsive">
      <table class="song-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Композитор</th>
            <th>Автор текста</th>
            <th>Год</th>
            <th>Исполнитель</th>
            <th>Группа</th>
            
            <th class="actions-column">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id" class="song-row">
            <td class="song-name">{{ song.name }}</td>
            <td>{{ song.composer || '—' }}</td>
            <td>{{ song.lyricist || '—' }}</td>
            <td>{{ song.year || '—' }}</td> 
            <td>{{ song.singer || '—' }}</td>
            <td>{{ getGroupName(song.groupID) }}</td>
            
            <td v-if="userRole === 'admin' || getGroupOwnerId(song.groupID) === currentUserId" class="actions-cell">
              <div  class="action-buttons">
                <button @click="$emit('edit', song)" class="edit-button">
                  <span class="action-icon">✎</span>
                </button>
                <button @click="confirmDelete(song.id)" class="delete-button">
                  <span class="action-icon">×</span>
                </button>
              </div>
            </td>
            <td v-else class="actions-cell">
              нет прав
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="songs.length === 0" class="empty-state">
      <div class="empty-icon">🎵</div>
      <p>Нет добавленных песен</p>
      <p class="empty-hint">Нажмите "Добавить песню", чтобы создать первую запись</p>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'SongTable',
  props: {
    songs: Array,
    groups: Array,
    albums: Array,
    currentUserId: Number,
    userRole: String
  },
  methods: {
    getGroupName(groupID) {
      const group = this.groups.find(g => g.id === groupID)
      return group ? group.name : 'Неизвестная группа'
    },
    confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить эту песню?')) {
        this.$emit('delete', id)
      }
    },
    getGroupOwnerId(groupID) {
    const group = this.groups.find(g => g.id === groupID)
    return group ? Number(group.ownerId) : null
  }
  }
}
</script>

<style scoped>
.table-container {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.song-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
  font-size: 0.95rem;
}

.song-table thead {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.song-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
}

.song-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}

.song-row:hover td {
  background-color: rgba(255, 255, 255, 0.03);
}

.song-row:last-child td {
  border-bottom: none;
}

.song-name {
  font-weight: 500;
  color: #34d399;
}

.actions-column {
  width: 100px;
  text-align: center;
}

.actions-cell {
  text-align: center;
  color:#64748b
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.edit-button {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
}

.edit-button:hover {
  background-color: rgba(52, 211, 153, 0.2);
  transform: translateY(-2px);
}

.delete-button {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-button:hover {
  background-color: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.25rem;
  color: #94a3b8;
  margin: 0.5rem 0;
}

.empty-hint {
  font-size: 1rem !important;
  color: #64748b !important;
  max-width: 300px;
}

@media (max-width: 1024px) {
  .song-table {
    min-width: 900px;
  }
}
</style>
