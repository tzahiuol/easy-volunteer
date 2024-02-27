<template>
  <h1 class="page-title">Quiz</h1>
  <div>
    <p>Hello and welcome to the quiz</p>
    <p>The purpose of the quiz is to find the skills that you own as an individual, and to assign to you the positions
      that fit you the most!</p>

    <div class="pt-3" v-if="!shouldShowQuestionsSection">
      <VaButton @click="shouldShowQuestionsSection = true"> Start the quiz <span class="pl-3">
          <VaIcon name="mso-question_mark"></VaIcon>
        </span></VaButton>
    </div>
  </div>
  <div v-if="shouldShowQuestionsSection" class="pt-3">
    <Transition name="slide-fade">
      <div v-show="showQuestion" class="row">
        <div class="flex flex-col md4">
          <VaCard color="primary" gradient class="item">
            <VaCardTitle>{{ questions[questionIndex].question }} </VaCardTitle>
            <VaCardContent>
              <div v-for="answer in sortedAnswers" class="pt-2"
                @click="choosenAnswer(questions[questionIndex], answer)">
                <p :style=" choosenAnswerId === answer.id ? 'color:var(--va-text-primary)' : ''" class="cursor-pointer">{{ answer.answer }}</p>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script lang="ts" setup>
import { watch, ref, computed, Ref } from 'vue'
import { useQuizStore } from '../../stores/quiz-store'

const quizClick = new Audio('/quiz_click.mp3')
const clappingSound = new Audio('/clapping_sound.mp3')

const shouldShowQuestionsSection = ref(false)
const showQuestion = ref(false)

const animateQuestion = (shouldSkipQuestion: boolean) => {
  const startTimer = shouldSkipQuestion ? 0 : 900
  showQuestion.value = false
  setTimeout(() => {
    setTimeout(() => {
      if (!shouldSkipQuestion) {
        questionIndex.value++
      }
      showQuestion.value = true
    }, 100)
  }, startTimer)
}

watch(shouldShowQuestionsSection, (value) => {
  if (value) {
    animateQuestion(true)
  }
})
const questionIndex = ref(0)
const choosenAnswerId = ref(0)

const quizStore = useQuizStore()

quizStore.getQuestions()

const answers: Ref<{ questionId: number, answerdId: number }[]> = ref([])

const questions = computed(() => quizStore.questions)
const sortedAnswers = computed(() => {
  return questions.value[questionIndex.value].answers.sort((a, b) => {
    return a.order - b.order
  })
})

const choosenAnswer = (question: any, answer: any) => {
  choosenAnswerId.value = answer.id
  quizClick.currentTime = 0
  quizClick.play()
  answers.value.push({ questionId: question.id, answerdId: answer.id })
  if (questionIndex.value < questions.value.length - 1) {
    animateQuestion(false)
  } else {
    console.log(answers)
    clappingSound.currentTime = 2
    clappingSound.play()
  }
}

</script>

<style lang="scss" scoped>
@import "vuestic-ui/styles/grid";

.slide-fade-enter-active {
  transition: all 1.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 1.0s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>