<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput v-model="formData.firstName" :rules="[validators.required]" class="mb-4" label="First Name" type="text" />
    <VaInput v-model="formData.lastName" :rules="[validators.required]" class="mb-4" label="Last Name" type="text" />
    <VaInput v-model="formData.email" :rules="[validators.email]" class="mb-4" label="Email" type="email" />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput ref="password1" v-model="formData.password" :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'" class="mb-4" label="Password"
        messages="Password should be 8+ characters: a lower case letter, an upper case letter, numbers, and special characters."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value">
        <template #appendInner>
          <VaIcon :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'" class="cursor-pointer"
            color="secondary" />
        </template>
      </VaInput>
      <VaInput ref="password2" v-model="formData.repeatPassword" :rules="[
        (v) => !!v || 'Repeat Password field is required',
        (v) => v === formData.password || 'Passwords don\'t match',
      ]" :type="isPasswordVisible.value ? 'text' : 'password'" class="mb-4" label="Repeat Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value">
        <template #appendInner>
          <VaIcon :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'" class="cursor-pointer"
            color="secondary" />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils';
import requests from '../../data/requests'

import { AxiosError } from 'axios'


const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: '',
})

const submit = async () => {
  try {
    await requests.user.register(formData.email, formData.password, formData.firstName, formData.lastName)
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 409) {
        return init({
          title: 'Error',
          message: 'User with this email already exists',
          color: 'danger',
        })
      }
      return init({
        title: 'Error',
        message: 'Something unexcpected happened',
        color: 'danger',
      })

    }
  }
  push('login')

}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Z]/.test(v)) || 'Password must contain at least one upper case letter',
  (v) => (v && /[a-z]/.test(v)) || 'Password must contain at least one lower case letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
