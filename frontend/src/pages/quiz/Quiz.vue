<template>
  <h1 class="page-title">Quiz</h1>
  {{ questions }}
</template>


<script lang="ts" setup>
import { defineComponent, watch, ref, computed } from 'vue'
import { useQuizStore } from '../../stores/quiz-store'

const quizStore = useQuizStore()

quizStore.getQuestions()

const questions = computed(() => quizStore.questions)

</script>