<template>
    <div>
        <ScheduleXCalendar :calendar-app="calendarApp">
        </ScheduleXCalendar>
    </div>
    <VaModal v-model="showModal" hide-default-actions size="small">
        <h3 class="va-h3">
            {{ selectedEvent.title }}
        </h3>
        <p>
            <VaIcon size="small" name="mso-schedule" /> {{ selectedEvent.start }} - {{ selectedEvent.end }}
        </p>
        <p>
            <VaIcon size="small" name="mso-location_on" /> {{ selectedEvent.location }}
        </p>
        <p class="pt-3">
            {{ selectedEvent.description }}
        </p>
        <template #footer>
            <VaButton color="secondary" @click="showModal = false">Close</VaButton>
            <div class="pl-2">
                <VaButton @click="cancelSubmission(selectedEvent)" color="danger">Delete event</VaButton>
            </div>
        </template>
    </VaModal>
</template>


<script lang="ts" setup>
import { Ref, computed, ref, watch } from 'vue';
import { useScheduleStore } from '../../stores/schedule-store';
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
    createCalendar,
    viewDay,
    viewWeek,
    viewMonthGrid,
    viewMonthAgenda,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import requests from '../../data/requests';
import { useToast } from 'vuestic-ui'

const { init } = useToast()
const showModal = ref(false)
const selectedEvent: Ref<any> = ref(null)

const scheduleStore = useScheduleStore()

scheduleStore.getSchedule()

const events = computed(() => {
    return scheduleStore.schedule.map((event) => ({
        id: event.id,
        title: event.institutionPosition.name,
        location: event.institutionPosition.fullAddress,
        start: reformatDate(event.from),
        end: reformatDate(event.to),
        description: event.institutionPosition.description,

    }))
})

const cancelSubmission = async (eventFromCalendar: any) => {
    const event = scheduleStore.schedule.find((e) => e.id === eventFromCalendar.id)
    if (!event){
        return
    }
    if (event.from < new Date()) {
        return init({ message: "Cannot cancel an event from the past.", color: 'warning' })
    }
    await requests.positions.cancelTimeSlot(event.id)
    await scheduleStore.getSchedule()
    showModal.value = false
}

const reformatDate = (inputDate: Date) => {

    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const calendarApp = createCalendar({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    plugins: [],
    callbacks: {
        onEventClick: (event) => {
            showModal.value = true
            selectedEvent.value = event
        }
    }
})

watch(events, (newEvents) => {
    calendarApp.events.getAll().forEach((event) => {
        calendarApp.events.remove(event.id)
    })
    for (const event of newEvents) {
        calendarApp.events.add(event)
    }
})
</script>

<style scoped></style>