<template>
  <h1 class="page-title">Quiz</h1>
  {{ questions }}
</template>


<script lang="ts" setup>
import { defineComponent, watch, ref, computed } from 'vue'
import { useQuestionsStore } from '../../stores/questions-store'

const questionsStore = useQuestionsStore()

questionsStore.getQuestions()

const questions = computed(() => questionsStore.questions)

</script>