<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar">
        <span class="avatar-text">{{ getInitials(user?.username) }}</span>
      </div>
      <div class="profile-info">
        <h1>{{ user?.username }}</h1>
        <div class="role-badge" :class="getRoleMeta(user?.role)?.class">
          <span>{{ getRoleMeta(user?.role)?.label  }}</span>
        </div>
      </div>
      <button @click="logout" class="logout-button">
        <span>Выйти</span>
      </button>
    </div>

    <div class="profile-content">
      

      <GroupForm 
      :visible="showAddBandModal || editingGroup !== null"
      :editableGroup="editingGroup"
      @update-group="updateGroup"
      @close="closeModal"
    />

      <div v-if="user?.role === 'manager'" class="groups-section">
        <div class="section-header">
          <h2>Мои группы</h2>
          <div class="section-badge">Управление</div>
        </div>
        <div class="groups-container">
          <GroupCard
          :groups="userGroups"
          @click="goToGroupDetail"
          @edit="editGroup"
          @delete="deleteGroup" />
        </div>
      </div>

      <div v-if="user?.role === 'admin'" class="admin-section">
        <div class="section-header">
          <h2>Панель администратора</h2>
          <div class="section-badge admin">Админ</div>
        </div>
        <div class="admin-content">
          <div class="admin-cards">
            <div class="admin-card">
              <div class="admin-card-icon">👥</div>
              <div class="admin-card-content">
                <h3>Управление пользователями</h3>
                <p>Просмотр и редактирование пользователей системы</p>
                <button @click="goToUsers" class="admin-button">Перейти</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import api from '../services/api'
import GroupCard from '../components/groups/GroupCard.vue';
import GroupForm from '../components/groups/GroupForm.vue'

// состояния
const router = useRouter();
const user = ref(null);
const userGroups = ref([]);
const initials = ref('?');
const groups = ref([]);
const editingGroup = ref(null);
const showAddBandModal = ref(false);

// функции
function getInitials(username) {
  if (!username) return '?';
  return username.substring(0, 2).toUpperCase();
}

const roleMeta = {
  admin: { class: 'role-admin', label: 'Администратор' },
  manager: { class: 'role-manager', label: 'Менеджер' },
  user: { class: 'role-user', label: 'Пользователь' },
};

function getRoleMeta(role) {
  return roleMeta[role] || roleMeta.user;
}


async function fetchGroups() {
  try {
    const res = await axios.get('http://localhost:3000/api/groups');
    groups.value = res.data;
  } catch (error) {
    console.error('Ошибка загрузки групп', error);
  }
}

async function fetchUserGroups() {
  try {
    const response = await api.get('http://localhost:3000/api/my-groups', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    userGroups.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки групп:', error);
  }
}

function logout() {
  if (confirm('Вы уверены, что хотите выйти?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  }
}

function deleteGroup(id) {
  if (confirm('Вы уверены, что хотите удалить эту группу?')) {
    api
      .delete(`http://localhost:3000/api/groups/${id}`)
      .then(() => fetchGroups())
      .catch((error) => console.error('Ошибка удаления группы', error));
  }
}

function editGroup(group) {
  editingGroup.value = { ...group };
}

async function updateGroup(updatedGroup) {
  const groupToUpdate = toRaw(updatedGroup);

    try {
      await api.put(
        `http://localhost:3000/api/groups/${groupToUpdate.id}`, groupToUpdate
      );
      await fetchUserGroups();
      editingGroup.value = null;
    } catch (err) {
      console.error('Ошибка редактирования:', err);
    }
}

function closeModal(){
  editingGroup.value = null;
}

function goToGroupDetail(groupId) {
  router.push({ name: 'GroupDetail', params: { id: groupId } });
}

function goToUsers() {
  router.push({ path: '/users'});
}

// инициализация
onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    initials.value = getInitials(user.value?.username);
  }

  fetchUserGroups();
});
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.avatar-text {
  line-height: 1;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #34d399;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.role-admin {
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.role-manager {
  background-color: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.role-user {
  background-color: rgba(156, 163, 175, 0.1);
  color: #d1d5db;
  border: 1px solid rgba(156, 163, 175, 0.2);
}

.role-icon {
  font-size: 1.1rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

.logout-icon {
  font-size: 1.25rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.card-header {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #34d399;
}

.card-content {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.groups-section,
.admin-section,
.actions-section {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #34d399;
}

.section-badge {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.section-badge.admin {
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.groups-container,
.admin-content {
  padding: 2rem;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.admin-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 211, 153, 0.3);
}

.admin-card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.admin-card-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #e2e8f0;
}

.admin-card-content p {
  margin: 0 0 1.5rem;
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
}

.admin-button {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.admin-button:hover {
  background-color: rgba(52, 211, 153, 0.2);
}



.action-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: rgba(52, 211, 153, 0.3);
}

.action-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .profile-info h1 {
    font-size: 1.5rem;
  }
  
  
  .admin-cards {
    grid-template-columns: 3fr;
  }
}
</style>
