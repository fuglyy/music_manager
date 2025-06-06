<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Музыкальные группы</h1>
      <button
        @click="handleAddGroupClick"
        class="add-button"
      >
        <span class="icon">+</span>
        <span>Добавить группу</span>
      </button>
    </div>
    
    <GroupForm 
      :visible="showAddBandModal || editingGroup !== null"
      :editableGroup="editingGroup"
      @add-group="addGroup"
      @update-group="updateGroup"
      @close="closeModal"
    />
    
    <div class="content-container">
      <div v-if="groups.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>Нет добавленных групп</h3>
        <p>Нажмите "Добавить группу", чтобы создать первую запись</p>
      </div>
      
      <GroupCard 
        v-else
        :groups="groups" 
        :currentUserId="currentUserId"
        :userRole="userRole"
        @delete="deleteGroup" 
        @edit="editGroup" 
        @click="goToGroupDetail"
      />
    </div>
  </div>
</template>
  
<script>
import api from '../services/api'
import { toRaw } from 'vue';
import GroupCard from '../components/groups/GroupCard.vue'
import GroupForm from '../components/groups/GroupForm.vue'

export default {
  name: 'GroupPage',
  components: { GroupCard, GroupForm },
  data() {
    return {
      groups: [],
      editingGroup: null,
      showAddBandModal: false,
      currentUserId: null,
      userRole: null
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.currentUserId = user?.id ?? null;
    this.userRole = user?.role ?? null
    console.log(this.currentUserId)
    this.fetchGroups()
  },
  methods: {
    closeModal() {
      this.showAddBandModal = false
      this.editingGroup = null
    },
    fetchGroups() {
      api.get('http://localhost:3000/api/groups')
        .then(res => this.groups = res.data)
        .catch(error => {
          console.error('Ошибка загрузки групп', error)
        })
    },
    addGroup(newGroup) {
      api.post('http://localhost:3000/api/groups', newGroup)
        .then(() => this.fetchGroups())
        .catch(error => {
          console.error('Ошибка добавления группы', error)
        })
    },
    deleteGroup(id) {
      if (confirm('Вы уверены, что хотите удалить эту группу?')) {
        api.delete(`http://localhost:3000/api/groups/${id}`)
          .then(() => this.fetchGroups())
          .catch(error => {
            console.error('Ошибка удаления группы', error)
          })
      }
    },
    editGroup(group) {
      this.editingGroup = { ...group} 
    },
    updateGroup(updatedGroup) {
      const groupToUpdate = toRaw(updatedGroup);

      api.put(`http://localhost:3000/api/groups/${groupToUpdate.id}`, groupToUpdate)
        .then(() => {
          this.fetchGroups();
          this.editingGroup = null;
        })
        .catch(err => console.error('Ошибка редактирования:', err));
    },
    goToGroupDetail(groupId) {
      this.$router.push({ name: 'GroupDetail', params: { id: groupId } });
    },
    handleAddGroupClick() {
      if (this.currentUserId === null) {
        // Если не авторизован — редирект
        this.$router.push({ path: '/auth' }) // или 'Register' — в зависимости от маршрутов
      } else {
        // Иначе открываем модалку добавления группы
        this.showAddBandModal = true
      }
    }
  }
}
</script>
  
<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
  position: relative;
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .page-container {
    padding: 1rem;
  }
}
</style>
