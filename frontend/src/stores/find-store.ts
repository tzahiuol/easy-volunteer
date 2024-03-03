import { defineStore } from 'pinia'

import requests from '../data/requests'

interface CountriesWithCities {
    country_code: string,
    cities: string[]
}

export interface AvaliablePositions {
    id: number
    from: Date
    to: Date
    amountRequired: number
    amountOfUsers: number
    isAlreadyInPosition: boolean
    institutionPosition: InstitutionPosition
}

interface InstitutionPosition {
    id: number
    name: string
    country_code: string
    description: string

    city: string
    fullAddress: string
    position: Position
    institution: Institution
  }
  
interface Position {
    id: number
    name: string
  }
  
interface Institution {
    id: number
    name: string
    logo: any
    description: string
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

            const newData = data.map((position: any) => ({
                ...position,
                from: new Date(position.from),
                to: new Date(position.to)
            }))
            this.avaliablePositions = newData
        }
    },
})
