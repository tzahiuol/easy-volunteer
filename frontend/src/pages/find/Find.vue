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
      <VaSelect background="#fff" v-model="selectedCountry" :options="countriesToShow" placeholder="Country" />
    </div>
    <div class="col-span-1 justify-self-center">
      <VaIcon size="2.5rem" name="mso-location_city" />
    </div>
    <div class="col-span-4">
      <VaSelect background="#fff" v-model="selectedCity" :options="citiesToShow" :disabled="selectedCountry == null"
        placeholder="City" />
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
      <div class="md:col-span-4 sm:col-span-6 p-1" v-for="position in allAvaliablePositions">
        <VaCard>
          <div class="relative">
            <VaImage :src="getImageUrlByPosition(position.institutionPosition.position.name)" class="h-52" />
            <span class="bottom-right text-white"> {{ formatDatesToView(position.from, position.to) }} </span>
          </div>
          <VaCardTitle>{{ position.institutionPosition.name }} <br /> </VaCardTitle>
          <VaCardContent>
            <div class="grid grid-cols-12">
              <div class="col-span-10">
                <div class="grid grid-cols-12">
                  <div class="col-span-12">
                    <VaIcon size="small" name="mso-location_on" />
                    <span class="font-thin pl-2"> {{
        position.institutionPosition.fullAddress }}</span>
                  </div>
                  <div class="col-span-12">
                    <VaIcon size="small" name="mso-badge" />
                    <span class="font-thin pl-2"> {{
        position.institutionPosition.institution.name }}</span>
                  </div>
                  <div class="col-span-12 pt-3">
                    <span class="font-thin"> {{
        position.institutionPosition.description }}</span>
                  </div>
                </div>
              </div>
              <div class="col-span-2" v-if="!position.isAlreadyInPosition">
                <VaButton size="small" @click="() => register(position)" color="primary">Register</VaButton>
              </div>
              <div class="col-span-2" v-else>
                <VaButton size="small" color="warning" @click="() => cancelSubmission(position)">Cancel</VaButton>

              </div>
            </div>
          </VaCardContent>
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
import { AvaliablePositions, useFindStore } from '../../stores/find-store';
import requests from '../../data/requests'
import { useToast } from 'vuestic-ui'

const { init } = useToast()
const findStore = useFindStore();
const from = ref();
const to = ref();

const shouldDisablePastChanges = false;

const formatDatesToView = (fromDate: Date, toDate: Date) => {
  const fullOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  if (fromDate.getDay() != toDate.getDay()) {
    return fromDate.toLocaleString("en-US", fullOptions) + " - " + toDate.toLocaleString("en-US", fullOptions)
  }
  return fromDate.toLocaleDateString() + ", " + fromDate.toLocaleTimeString() + " - " + toDate.toLocaleTimeString()
}

const getImageUrlByPosition = (position: string) => {
  return '/positions/' + position.toLowerCase().replaceAll(" ", '_') + '.png'
}


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
  return findStore.avaliablePositions.sort((a, b) => a.from > b.from ? 1 : -1)
})



const filter = async () => {
  await findStore.getAvaliablePositions(selectedCountry.value, selectedCity.value, from.value, to.value)
}

const cancelSubmission = async (timeSlotPosition : AvaliablePositions) => {
  if (timeSlotPosition.from < new Date() && shouldDisablePastChanges) {
    return init({ message: "Cannot cancel an event from the past.", color: 'warning' })
  }
  await requests.positions.cancelTimeSlot(timeSlotPosition.id)
  await filter()
}

const register = async (timeSlotPosition : AvaliablePositions) => {
  if (timeSlotPosition.from < new Date() && shouldDisablePastChanges) {
    return init({ message: "Cannot register to an event from the past.", color: 'warning' })
  }
  await requests.positions.scheduleTimeSlot(timeSlotPosition.id)
  await filter()
}

findStore.getAvaliableCountries()
</script>

<style scoped>
.bottom-right {
  position: absolute;
  bottom: 8px;
  right: 4px;
  background-color: rgba(2, 40, 194, 0.5);
}
</style>