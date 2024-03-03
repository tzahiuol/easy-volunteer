<template>
    <!-- <h1 class="page-title">Profile</h1> -->
    <div class="grid grid-cols-12">
        <div class="col-span-6">
            <VaCard>
                <VaCardTitle>Hello {{ store.user.firstName }} {{ store.user.lastName }}!</VaCardTitle>
                <VaCardContent>

                    <div>
                        <VaIcon name="mso-email" /> {{ store.user.email }}
                    </div>
                    <div class="pt-3">
                        <p class="font-semibold">You match the criteria for the following positions:</p>
                        <div class="flex flex-wrap">
                            <div v-for="position in store.user.positions" class="flex-auto">
                                <VaBadge :text="position.name" color="primary" />
                            </div>
                        </div>
                    </div>
                    <div class="pt-3">
                        <p class="font-semibold">Impressive Skills Match, Your profile aligns with the following sought-after skills:</p>
                        <div class="flex flex-wrap">
                            <div v-for="skill in store.user.skills" class="flex-auto">
                                <VaBadge :text="skill.name" color="success" />
                            </div>
                        </div>
                    </div>
                </VaCardContent>
                <VaCardActions>
                    <VaButton color="warning" @click="logout">Logout</VaButton>
                </VaCardActions>
            </VaCard>
        </div>
    </div>
</template>


<script lang="ts" setup>
import requests from '../../data/requests';
import { useAuthStore } from '../../stores/auth-store';


const store = useAuthStore()

store.getMe()

const logout = async () => {
    await requests.user.logout()
    location.reload()
}

</script>

<style scoped></style>