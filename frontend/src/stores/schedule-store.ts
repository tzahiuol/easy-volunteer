import { defineStore } from 'pinia'

import requests from '../data/requests'

export interface Schedule {
    id: number
    from: Date
    to: Date
    amountRequired: number
    institutionPosition: InstitutionPosition
}

export interface InstitutionPosition {
    id: number
    name: string
    country_code: string
    city: string
    fullAddress: string
    description: string
}


export const useScheduleStore = defineStore('schedule', {
    state: () => {
        return {
            schedule: [],
        } as {
            schedule: Schedule[]
        }
    },

    actions: {
        async getSchedule() {
            const data = await requests.schedule.getSchedule()
            this.schedule = data.map((schedule: any) => ({
                ...schedule,
                from: new Date(schedule.from),
                to: new Date(schedule.to)
            })
            )
        },
    },
})
