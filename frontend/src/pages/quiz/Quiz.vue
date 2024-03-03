<template>
  <h1 class="page-title">Quiz</h1>
  <div>
    <p>Hello and welcome to the quiz</p>
    <p>The purpose of the quiz is to find the skills that you own as an individual, and to assign to you the positions
      that fit you the most!</p>

    <div class="pt-3" v-if="shouldShouldStartQuizSection">
      <VaButton @click="shouldShowQuestionsSection = true; shouldShouldStartQuizSection = false"> Start the quiz <span
          class="pl-3">
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
              <div v-for="answer in sortedAnswers" class="pt-2" @click="choosenAnswer(questions[questionIndex], answer)">
                <p :style="choosenAnswerId === answer.id ? 'color:var(--va-text-primary)' : ''" class="cursor-pointer">{{
                  answer.answer }}</p>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </div>
    </Transition>
  </div>
  <div v-if="shouldShowDoneSection" class="pt-3">
    <Transition name="slide-fade">
      <div class="row">
        <div class="flex flex-col md6">
          <VaCard color="primary" gradient class="item">
            <VaCardTitle>Results</VaCardTitle>
            <VaCardContent>
              <p>The skills and positions that we identified by the quiz are </p>
              <div class="row">
                <div v-for="skillOrPosition in presentedSkillsAndPositions" class="pt-2">
                  <VaBadge :text="skillOrPosition.name"
                    :color="skillOrPosition.type === 'position' ? 'primary' : 'success'" class="mr-2" />
                </div>
              </div>
              <div class="row pt-2">
                <VaButton color="primary" to="/panel/find">Click to go to the find section</VaButton>
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
import requests from '../../data/requests'
import _ from 'lodash';
import { useAuthStore } from '../../stores/auth-store';

const quizClick = new Audio('/quiz_click.mp3')
const clappingSound = new Audio('/clapping_sound.mp3')

const shouldShouldStartQuizSection = ref(true)
const shouldShowQuestionsSection = ref(false)
const shouldShowDoneSection = ref(false)
const showQuestion = ref(false)

const animateQuestion = (shouldSkipQuestion: boolean) => {
  const startTimer = shouldSkipQuestion ? 900 : 0
  showQuestion.value = false
  setTimeout(() => {
    setTimeout(() => {
      if (shouldSkipQuestion) {
        questionIndex.value++
      }
      showQuestion.value = true
    }, 100)
  }, startTimer)
}

watch(shouldShowQuestionsSection, (value) => {
  if (value) {
    animateQuestion(false)
  }
})
const questionIndex = ref(0)
const choosenAnswerId = ref(0)

const userStore = useAuthStore()
const quizStore = useQuizStore()

quizStore.getQuestions()


const answers: Ref<{ questionId: number, answerId: number }[]> = ref([])

const questions = computed(() => quizStore.questions)
const sortedAnswers = computed(() => {
  return questions.value[questionIndex.value].answers.sort((a, b) => {
    return a.order - b.order
  })
})
const positions = computed(() => userStore.user?.positions || [])
const skills = computed(() => userStore.user?.skills || [])

const presentedSkillsAndPositions = computed(() => {
  const newPositions = positions.value.map((position : any) => {
    return { name: position.name, type: 'position' }
  })
  const newSkills = skills.value.map((skill: any) => {
    return { name: skill.name, type: 'skill' }
  })
  return _.shuffle(newPositions.concat(newSkills));
})

const choosenAnswer = async (question: any, answer: any) => {
  choosenAnswerId.value = answer.id
  quizClick.currentTime = 0
  quizClick.play()
  answers.value.push({ questionId: question.id, answerId: answer.id })
  if (questionIndex.value < questions.value.length - 1) {
    animateQuestion(true)
  } else {
    clappingSound.currentTime = 2
    clappingSound.play()
    await requests.question.answer(answers.value)

    setTimeout(async () => {
      await quizStore.checkShouldAnswerQuestions()
      shouldShowQuestionsSection.value = false;
      shouldShowDoneSection.value = true;
      await userStore.getMe()
    }, 1000)

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