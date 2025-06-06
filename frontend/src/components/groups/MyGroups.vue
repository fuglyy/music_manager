<template>
  <div>
    <h1>Мои группы</h1>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="myGroups.length">
      <div
        v-for="group in myGroups"
        :key="group.id"
        class="group-card"
      >
        <router-link :to="`/groups/${group.id}`" class="group-name">
          {{ group.name }}
        </router-link>
        <p><strong>Страна:</strong> {{ group.country }}</p>
        <p><strong>Год основания:</strong> {{ group.year }}</p>
      </div>
    </div>
    <div v-else>Группы не найдены</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const myGroups = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/my-groups', {
      headers: { Authorization: `Bearer ${token}` }
    });
    myGroups.value = response.data;
    console.log(response.data);
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка при загрузке групп';
  }
});
</script>

<style scoped>
.group-card {
  background-color: #0f172a;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #fff;
}
.group-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #34d399;
  text-decoration: none;
}
.group-name:hover {
  text-decoration: underline;
}
.error {
  color: red;
  margin: 1rem 0;
}
</style>
