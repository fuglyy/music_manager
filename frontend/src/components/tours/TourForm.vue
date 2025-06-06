<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Редактировать тур' : 'Добавить тур' }}</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <div class="form-fields">
        <div class="form-group">
          <label for="name">Название гастрольной программы</label>
          <input 
            id="name"
            v-model="form.name" 
            placeholder="Введите название тура" 
            required 
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Дата начала</label>
            <input 
              id="startDate"
              v-model="form.startDate" 
              type="date" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="endDate">Дата окончания</label>
            <input 
              id="endDate"
              v-model="form.endDate" 
              type="date" 
              required 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="groupID">Группа</label>
          <select 
            id="groupID"
            v-model="form.groupID" 
            required
            class="form-select"
          >
            <option disabled value="">Выберите группу</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>
        
        <div class="cities-section">
          <div class="section-header">
            <h3>Города тура</h3>
            <button type="button" @click="addCity" class="add-city-button">
              <span>+</span> Добавить город
            </button>
          </div>
          
          <div v-for="(city, index) in form.cities" :key="index" class="city-entry">
            <div class="city-number">{{ index + 1 }}</div>
            
            <div class="city-fields">
              <div class="form-row">
                <div class="form-group">
                  <label :for="`city-${index}`">Город</label>
                  <select 
                    :id="`city-${index}`"
                    v-model="city.cityID" 
                    required
                    class="form-select"
                  >
                    <option disabled value="">Выберите город</option>
                    <option v-for="cityOption in cities" :key="cityOption.id" :value="cityOption.id">
                      {{ cityOption.name }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label :for="`date-${index}`">Дата концерта</label>
                  <input 
                    :id="`date-${index}`"
                    v-model="city.date" 
                    type="date" 
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label :for="`price-${index}`">Цена билета</label>
                  <input 
                    :id="`price-${index}`"
                    v-model.number="city.ticketPrice" 
                    type="number" 
                    placeholder="Цена в рублях" 
                    required 
                  />
                </div>
              </div>
              
              <button 
                v-if="form.cities.length > 1" 
                @click="removeCity(index)" 
                class="remove-city-button"
                type="button"
              >
                <span>×</span>
              </button>
            </div>
          </div>
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
  name: 'TourForm',
  props: {
    editableTour: Object,
    visible: Boolean,
    groups: Array,
    cities: Array
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        startDate: '',
        endDate: '',
        groupID: '',
        cities: [{ cityID: '', date: '', ticketPrice: null }]
      }
    };
  },
  computed: {
    isEdit() {
      return !!this.form.id;
    }
  },
  watch: {
    editableTour: {
      immediate: true,
      handler(value) {
        if (value) {
          this.form = {
            id: value.id || null,
            name: value.name || '',
            startDate: value.startDate || '',
            endDate: value.endDate || '',
            groupID: value.groupID || '',
            cities: Array.isArray(value.cities) && value.cities.length > 0
              ? value.cities.map(city => ({
                  cityID: city.cityID || '',
                  date: city.date || '',
                  ticketPrice: city.ticketPrice || null
                }))
              : [{ cityID: '', date: '', ticketPrice: null }]
          };
        } else {
          this.form = {
            id: null,
            name: '',
            startDate: '',
            endDate: '',
            groupID: '',
            cities: [{ cityID: '', date: '', ticketPrice: null }]
          };
        }
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit(this.isEdit ? 'update-tour' : 'add-tour', this.form);
      this.close();
    },
    close() {
      this.$emit('close');
    },
    addCity() {
      this.form.cities.push({ cityID: '', date: '', ticketPrice: null });
    },
    removeCity(index) {
      this.form.cities.splice(index, 1);
    }
  }
};
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
  overflow-y: auto;
  padding: 2rem 0;
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
  max-width: 700px;
  color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: slideUp 0.3s ease;
  overflow: hidden;
  max-height: 90vh;
  margin: auto;
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
  position: sticky;
  top: 0;
  z-index: 10;
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
  overflow-y: auto;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
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

.modal-content input,
.form-select {
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

.modal-content input:focus,
.form-select:focus {
  border-color: #34d399;
  background-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

/* Cities section */
.cities-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #34d399;
}

.add-city-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-city-button:hover {
  background-color: rgba(52, 211, 153, 0.2);
  border-color: rgba(52, 211, 153, 0.3);
}

.city-entry {
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.city-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  color: #94a3b8;
}

.city-fields {
  flex: 1;
  display: flex;
  gap: 1rem;
}

.remove-city-button {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  align-self: flex-start;
}

.remove-city-button:hover {
  background: rgba(239, 68, 68, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  position: sticky;
  bottom: 0;
  z-index: 10;
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

@media (max-width: 768px) {
  .form-row,
  .city-fields {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-content {
    max-width: 90%;
    margin: 0 1rem;
  }
  
  .city-entry {
    flex-direction: column;
    gap: 1rem;
  }
  
  .city-number {
    align-self: flex-start;
  }
  
  .remove-city-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
