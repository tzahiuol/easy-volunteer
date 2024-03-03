import { defineStore } from 'pinia'

import requests from '../data/requests'

export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    positions: Position[]
    skills: Skill[]
  }
  
  export interface Position {
    name: string
    id: number
  }
  
  export interface Skill {
    name: string
  }
  

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: {},
            isLoggedIn: null,
        } as {
            user: User;
            isLoggedIn: boolean | null;
        }
    },

    actions: {
        async getMe() {
            try{
                const data = await requests.user.me()
                this.user = data;
                this.isLoggedIn = true
            }catch (e){
                this.isLoggedIn = false
            }
        },
    },
})
