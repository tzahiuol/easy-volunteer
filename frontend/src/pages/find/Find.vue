<template>
  <h1 class="page-title">Find</h1>
  <div class="grid grid-cols-12">
    <div class="col-span-4">
      <VueDatePicker placeholder="From" v-model="from"></VueDatePicker>
    </div>
    <div class="col-span-1 justify-self-center">
      <VaIcon size="2.5rem" name="mso-arrow_forward" />
    </div>
    <div class="col-span-4">
      <VueDatePicker placeholder="To" v-model="to"></VueDatePicker>
    </div>
  </div>
  <div class="grid grid-cols-12">
    <div class="col-span-4">
      <VaSelect background="#fff" v-model="selectedCountry" :options="countriesToShow"
        placeholder="Country" />
    </div>
    <div class="col-span-1 justify-self-center">
      <VaIcon size="2.5rem" name="mso-location_city" />
    </div>
    <div class="col-span-4">
      <VaSelect background="#fff" v-model="selectedCity" :options="citiesToShow"
        :disabled="selectedCountry == null" placeholder="City" />
    </div>
  </div>
  <div class="pt-3">
    <div>
      <VaButton color="primary" @click="filter" :disabled="isFilterDisabled">Filter</VaButton>
    </div>
  </div>
  <div class="" v-if="isFilterDisabled">
    <div class="">
      <p class="font-semibold" style="color:var(--va-danger)">Please choose at least from and to date</p>
    </div>
  </div>
  <div class="pt-2" v-if="allAvaliablePositions.length > 0">
    <hr />
    <div class="grid grid-cols-12">
      <div class="md:col-span-4 sm:col-span-6" v-for="position in allAvaliablePositions">
      
        <VaCard>
          
        </VaCard>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { computed } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useFindStore } from '../../stores/find-store';

const findStore = useFindStore();
const from = ref();
const to = ref();

// Remove later..
from.value = new Date();
const toDate = new Date();
toDate.setMonth(toDate.getMonth() + 1);
to.value = toDate;

const selectedCountry = ref();
const selectedCity = ref();

const countriesToShow = computed(() => {
  return findStore.countries.map((country) =>
    country.country_code)
})

const citiesToShow = computed(() => {
  if (!selectedCountry.value) {
    return []
  }
  return findStore.countries.filter((country) => country.country_code === selectedCountry.value)[0].cities
})

const isFilterDisabled = computed(() => {
  return !from.value || !to.value
})

const allAvaliablePositions = computed(() => {
  return findStore.avaliablePositions
})

const filter = () => {
  findStore.getAvaliablePositions(selectedCountry.value, selectedCity.value, from.value, to.value)
}

findStore.getAvaliableCountries()
</script>

<style scoped>

</style>