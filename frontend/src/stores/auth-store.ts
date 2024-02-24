import { defineStore } from 'pinia'

import requests from '../data/requests'

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: {},
            isLoggedIn: null,
        } as {
            user: any;
            isLoggedIn: boolean | null;
        }
    },

    actions: {
        async getMe() {
            try{
                const data = await requests.user.me()
                this.user = data;
            }catch (e){
                this.isLoggedIn = false
            }
        },
    },
})
