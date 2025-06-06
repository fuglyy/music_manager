<template>
    <section>
        <h2>Хит-парад песен</h2>
        <ol>
            <li v-for="song in songs" :key="song.id">
                {{ song.name }} - {{ getGroupName(song.groupID) }} (Рейтинг: {{ song.rating }})
            </li>
        </ol>
    </section>
</template>

<script>
export default{
    name: 'TopSongs',
    props:{
        songs: Array,
        groups: Array
    },
    methods: {
      getGroupName(groupID) {
        const group = this.groups.find(g => g.id === groupID)
        return group ? group.name : 'Неизвестная группа'
      }
    }
}
</script>

<style scoped>
section {
  padding: 0.5rem 1rem;
}

h2 {
  margin-bottom: 1rem;
  color: #34d399;
  font-size: 1.25rem;
  font-weight: 600;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

li:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
