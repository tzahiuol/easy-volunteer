import { defineStore } from 'pinia'
import requests from '../data/requests'

interface Questions {
    id: number,
    question: string,
    answers: Answers
}

interface Answers {
    id: number,
    answer: string,
    order: number,
}

export const useQuizStore = defineStore('questions', {
    state: () => {
        return {
            questions: [],
            shouldAnswerQuestions: null,
        } as {
            questions: Questions[];
            shouldAnswerQuestions: Boolean | null;
        }
    },

    actions: {
        async checkShouldAnswerQuestions() {
            const {result} = await requests.question.shouldAnswerQuestion()
            this.shouldAnswerQuestions = result
        },

        async getQuestions() {
            const questions = await requests.question.list()
            this.questions = questions
        },

        reset() {
            this.questions = []
            this.shouldAnswerQuestions = null
        }
    },
})
