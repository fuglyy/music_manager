<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Редактировать группу' : 'Добавить группу' }}</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <div class="form-fields">
        <div class="form-group">
          <label for="name">Название группы</label>
          <input 
            id="name"
            v-model="form.name" 
            placeholder="Введите название группы" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="year">Год основания</label>
          <input 
            id="year"
            v-model.number="form.year" 
            type="number" 
            placeholder="Введите год основания" 
          />
        </div>
        
        <div class="form-group">
          <label for="country">Страна</label>
          <input 
            id="country"
            v-model="form.country" 
            placeholder="Введите страну" 
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="close" class="cancel">
          Отмена
        </button>
        <button type="button" @click="submitForm" class="submit">
          {{ isEdit ? 'Сохранить' : 'Добавить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupForm',
  props: {
    editableGroup: Object,
    visible: Boolean
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        year: null,
        country: ''
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.form.id
    }
  },
  watch: {
    editableGroup: {
      immediate: true,
      handler(value) {
        this.form = value ? { ...value } : {
          id: null,
          name: '',
          year: null,
          country: ''
        }
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit(this.isEdit ? 'update-group' : 'add-group', this.form)
      this.close()
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
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

.form-fields {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #94a3b8;
}

.modal-content input {
  background-color: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  padding: 0.875rem 1rem;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
}

.modal-content input:focus {
  border-color: #34d399;
  background-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.submit {
  background-color: #10b981;
  color: white;
  min-width: 120px;
}

.submit:hover {
  background-color: #059669;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.cancel {
  background-color: rgba(75, 85, 99, 0.3);
  color: #e2e8f0;
}

.cancel:hover {
  background-color: rgba(107, 114, 128, 0.5);
}
</style>
