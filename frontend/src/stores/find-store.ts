import { defineStore } from 'pinia'

import requests from '../data/requests'

interface CountriesWithCities {
    country_code: string,
    cities: string[]
}

interface AvaliablePositions {
    id: number
    from: string
    to: string
    amountRequired: number
    institutionPosition: InstitutionPosition
}

interface InstitutionPosition {
    id: number
    name: string
    country_code: string
    city: string
    fullAddress: string
    position: Position
}

interface Position {
    id: number
    name: string
}

export const useFindStore = defineStore('find', {
    state: () => {
        return {
            countries: [],
            avaliablePositions: []
        } as {
            countries: CountriesWithCities[],
            avaliablePositions: AvaliablePositions[];
        }
    },

    actions: {
        async getAvaliableCountries() {
            const data = await requests.positions.getFilterCountries()
            this.countries = data
        },

        async getAvaliablePositions(country_code?: string, city?: string, from?: Date, to?: Date) {
            const data = await requests.positions.filter({ country_code, city, from, to })
            this.avaliablePositions = data
        }
    },
})
