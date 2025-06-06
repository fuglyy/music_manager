<template>
  <div 
    class="cards-container"
  >
    <div
      class="card" 
      @click="goToGroupDetail(group.id)" 
      v-for="group in groups" 
      :key="group.id"
    >
      <div class="card-content">
        <div class="top">
          <h3>{{ group.name }}</h3>
          <span v-if="Number(group.ownerId) === currentUserId" class="my-badge">Моя группа</span>
        </div>
        
        <div class="card-details">
          <p><span>Год основания:</span> {{ group.year }}</p>
          <p><span>Страна:</span> {{ group.country }}</p>
        </div>
      </div>

      <div v-if="userRole === 'admin' || Number(group.ownerId) === currentUserId" class="actions">
        <button @click.stop="$emit('edit', group)" class="edit-button">
          Редактировать
        </button>
        <button @click.stop="$emit('delete', group.id)" class="delete-button">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  groups: Array,
  currentUserId: Number,
  userRole: String
})

const emit = defineEmits(['edit', 'delete', 'click'])

function goToGroupDetail(groupId) {
  emit('click', groupId)
}
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: calc(33.333% - 1rem);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}


.my-badge {
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  padding: 0.6rem 0.75rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  height: 3rem;
}

.top{
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1200px) {
  .card {
    width: calc(50% - 0.75rem);
  }
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(52, 211, 153, 0.3);
}

.card-content {
  flex: 1;
}

.card h3 {
  margin: 0 0 1rem;
  color: #34d399;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 0.75rem;
}

.card h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #34d399;
  border-radius: 3px;
}

.card-details {
  margin-top: 1rem;
}

.card p {
  margin: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.6;
}

.card p span {
  color: #94a3b8;
  font-weight: 500;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.card:hover .actions {
  opacity: 1;
  transform: translateY(0);
}

.edit-button,
.delete-button {
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
</style>
