<template>
    <section>
        <h2>Количестов песен по годам</h2>
        <ul>
            <li v-for="entry in stats" :key="entry.year">
                {{ entry.year }} - {{ entry.count }} песен
            </li>
        </ul>
    </section>
</template>

<script>
export default{
    name: 'SongByYear',
    props: {
        stats: Array
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
