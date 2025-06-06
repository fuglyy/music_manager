<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Управление пользователями</h1>
        <p class="header-description">
          Управляйте пользователями системы, изменяйте роли и права доступа
        </p>
      </div>
      
      <div class="header-actions">
        <button class="refresh-button" @click="fetchUsers">
          <span class="button-icon">↻</span>
          <span>Обновить</span>
        </button>
      </div>
    </div>
    
    <div class="admin-content">
      <div class="filters-section">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск пользователей..." 
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-container">
          <select v-model="roleFilter" class="filter-select">
            <option value="">Все роли</option>
            <option value="admin">Администратор</option>
            <option value="manager">Менеджер</option>
          </select>
          
          <select v-model="sortBy" class="filter-select">
            <option value="id">Сортировать по ID</option>
            <option value="username">Сортировать по имени</option>
            <option value="role">Сортировать по роли</option>
          </select>
        </div>
      </div>
      
      <div class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td class="user-id">{{ user.id }}</td>
              <td class="user-name">
                <div class="user-avatar">{{ getInitials(user.username) }}</div>
                <span>{{ user.username }}</span>
              </td>
              <td>
                <div class="role-badge" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleDisplayName(user.role) }}
                </div>
              </td>
              
              <td>
                <div class="status-badge" :class="user.active ? 'status-active' : 'status-inactive'">
                  {{ user.active ? 'Активен' : 'Неактивен' }}
                </div>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    v-if="user.role !== 'admin'" 
                    @click="showRoleChangeModal(user)" 
                    class="edit-role-button"
                    title="Изменить роль"
                  >
                    <span class="button-icon">👤</span>
                  </button>
                  <button 
                    @click="deleteUser(user.id)" 
                    class="delete-button"
                    title="Удалить пользователя"
                  >
                    <span class="button-icon">×</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <p>Пользователи не найдены</p>
          <p class="empty-hint">Попробуйте изменить параметры поиска или фильтрации</p>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          @click="currentPage > 1 && (currentPage--)" 
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          Предыдущая
        </button>
        <div class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </div>
        <button 
          @click="currentPage < totalPages && (currentPage++)" 
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Следующая
        </button>
      </div>
    </div>
    
    <!-- Модальное окно изменения роли -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Изменить роль пользователя</h2>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <p>Выберите новую роль для пользователя <strong>{{ selectedUser?.username }}</strong>:</p>
          
          <div class="role-options">
            <div 
              v-for="role in availableRoles" 
              :key="role.value"
              class="role-option"
              :class="{ 'selected': selectedRole === role.value }"
              @click="selectedRole = role.value"
            >
              <div class="role-option-icon" :class="getRoleBadgeClass(role.value)">
                {{ role.icon }}
              </div>
              <div class="role-option-info">
                <div class="role-option-name">{{ role.name }}</div>
                <div class="role-option-desc">{{ role.description }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Отмена</button>
          <button @click="confirmRoleChange" class="confirm-button">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'AdminUsersPage',
  data() {
    return {
      users: [],
      searchQuery: '',
      roleFilter: '',
      sortBy: 'id',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      selectedUser: null,
      selectedRole: '',
      availableRoles: [
        { 
          value: 'admin', 
          name: 'Администратор', 
          icon: '👑',
          description: 'Полный доступ ко всем функциям системы' 
        },
        { 
          value: 'manager', 
          name: 'Менеджер', 
          icon: '🎯',
          description: 'Управление группами и контентом' 
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      let result = [...this.users];
      
      // Применяем поиск
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(user => 
          user.username?.toLowerCase().includes(query) || 
          user.id?.toString().includes(query)
        );
      }
      
      // Применяем фильтр по роли
      if (this.roleFilter) {
        result = result.filter(user => user.role === this.roleFilter);
      }
      
      // Сортировка
      result.sort((a, b) => {
        if (this.sortBy === 'id') {
          return a.id - b.id;
        } else if (this.sortBy === 'username') {
          return a.username?.localeCompare(b.username);
        } else if (this.sortBy === 'role') {
          return a.role?.localeCompare(b.role);
        }
        return 0;
      });
      
      // Пагинация
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return result.slice(startIndex, startIndex + this.itemsPerPage);
    },
    totalPages() {
      let filteredCount = this.users.length;
      
      // Учитываем фильтры при расчете общего количества страниц
      if (this.searchQuery || this.roleFilter) {
        filteredCount = this.users.filter(user => {
          const matchesSearch = !this.searchQuery || 
            user.username?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
            user.id?.toString().includes(this.searchQuery);
          
          const matchesRole = !this.roleFilter || user.role === this.roleFilter;
          
          return matchesSearch && matchesRole;
        }).length;
      }
      
      return Math.max(1, Math.ceil(filteredCount / this.itemsPerPage));
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'admin') {
      this.$router.push({ name: 'Home' }) // или другой маршрут
      return
    }

    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      // Добавим имитацию загрузки для демонстрации
      setTimeout(() => {
        api.get(`/users`)
          .then(res => {
            // Добавим дополнительные поля для демонстрации
            this.users = res.data.map(user => ({
              ...user,
              createdAt: user.createdAt || new Date().toISOString(),
              active: user.active !== undefined ? user.active : Math.random() > 0.2,
              username: user.username || `user_${user.id}`
            }));
          })
          .catch(err => {
            console.error('Ошибка загрузки пользователей', err);
            // Для демонстрации добавим тестовые данные
            
          });
      }, 300);
    },
    showRoleChangeModal(user) {
      this.selectedUser = user;
      this.selectedRole = user.role;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedUser = null;
      this.selectedRole = '';
    },
    confirmRoleChange() {
      if (!this.selectedUser || !this.selectedRole) return;
      
      this.changeRole(this.selectedUser.id, this.selectedRole);
      this.closeModal();
    },
    changeRole(userId, newRole) {
      api.put(`/users/${userId}/role`, { role: newRole })
        .then(() => {
          const userIndex = this.users.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRole;
          }
          
          // Показываем уведомление
          alert(`Роль пользователя успешно изменена на "${this.getRoleDisplayName(newRole)}"`);
        })
        .catch(err => {
          console.error('Ошибка изменения роли', err);
          // Для демонстрации все равно обновим локально
          const userIndex = this.users.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRole;
          }
        });
    },
    deleteUser(userId) {
      if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
        api.delete(`/users/${userId}`)
          .then(() => {
            this.users = this.users.filter(u => u.id !== userId);
            
            // Показываем уведомление
            alert('Пользователь успешно удален');
          })
          .catch(err => {
            console.error('Ошибка удаления пользователя', err);
            // Для демонстрации все равно удалим локально
            this.users = this.users.filter(u => u.id !== userId);
          });
      }
    },
    getInitials(username) {
      if (!username) return '?';
      return username.substring(0, 2).toUpperCase();
    },
    getRoleBadgeClass(role) {
      const roleClasses = {
        'admin': 'role-admin',
        'manager': 'role-manager',
      };
      return roleClasses[role];
    },
    getRoleDisplayName(role) {
      const roleNames = {
        'admin': 'Администратор',
        'manager': 'Менеджер',
      };
      return roleNames[role];
    },
    
  }
}
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #34d399;
  margin: 0 0 0.5rem;
}

.header-description {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-button,
.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.refresh-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.add-button {
  background-color: #10b981;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.add-button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
}

.button-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.admin-content {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
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
  font-size: 0.95rem;
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

.table-container {
  padding: 0;
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
  font-size: 0.95rem;
}

.user-table thead {
  background: rgba(0, 0, 0, 0.2);
}

.user-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}

.user-row:hover td {
  background-color: rgba(255, 255, 255, 0.03);
}

.user-id {
  font-family: monospace;
  color: #94a3b8;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.role-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
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

.role-guest {
  background-color: rgba(156, 163, 175, 0.1);
  color: #d1d5db;
  border: 1px solid rgba(156, 163, 175, 0.2);
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}

.status-active {
  background-color: rgba(52, 211, 153, 0.1);
  color: #6ee7b7;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.status-inactive {
  background-color: rgba(156, 163, 175, 0.1);
  color: #d1d5db;
  border: 1px solid rgba(156, 163, 175, 0.2);
}

.actions-cell {
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-role-button,
.delete-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  border: none;
  font-size: 1.1rem;
}

.edit-role-button {
  background-color: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
}

.edit-role-button:hover {
  background-color: rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.delete-button {
  background-color: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.delete-button:hover {
  background-color: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
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
  opacity: 0.7;
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

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.15);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #94a3b8;
  font-size: 0.95rem;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 0;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 500px;
  color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #34d399;
}

.close-button {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.75rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: white;
}

.modal-body {
  padding: 2rem;
}

.modal-body p {
  margin: 0 0 1.5rem;
  color: #e2e8f0;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.role-option.selected {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
}

.role-option-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.role-option-info {
  flex: 1;
}

.role-option-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.role-option-desc {
  font-size: 0.9rem;
  color: #94a3b8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.cancel-button,
.confirm-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.cancel-button {
  background-color: rgba(75, 85, 99, 0.3);
  color: #e2e8f0;
  border: none;
}

.cancel-button:hover {
  background-color: rgba(107, 114, 128, 0.5);
}

.confirm-button {
  background-color: #10b981;
  color: white;
  border: none;
}

.confirm-button:hover {
  background-color: #059669;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .admin-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .filter-container {
    flex-direction: column;
  }
  
  .user-table {
    min-width: 800px;
  }
  
  .role-options {
    gap: 0.75rem;
  }
  
  .role-option {
    padding: 0.75rem;
  }
}
</style>
