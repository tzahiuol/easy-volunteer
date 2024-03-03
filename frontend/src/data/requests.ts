import axios, { AxiosResponse } from 'axios';

export default {
    user: {
        register: async (email: string, password: string, firstName: string, lastName: string) => {
            return await axios.post('/api/user/register', { email, password, firstName, lastName });
        },
        login: async (email: string, password: string) => {
            return await axios.post('/api/user/login', { email, password });
        },
        me: async () => {
            return (await axios.get('/api/user/me')).data;
        }
    },
    question: {
        shouldAnswerQuestion: async (): Promise<{ result: Boolean }> => {
            return (await axios.get('/api/question/should-answer-questions')).data;
        },
        list: async () => {
            return (await axios.get('/api/question/list')).data;
        },
        answer: async (questionsAndAnswers: any[]) => {
            return await axios.post('/api/question/answer', { answers: questionsAndAnswers });
        },
    },
    positions: {
        getSchedule: async () => {
            return await axios.get('/api/positions/schedule');
        },
        scheduleTimeSlot: async (timeSlotId: number) => {
            return await axios.post(`/api/institution-positions/schedule/timeslot/${timeSlotId}`);
        },
        getScheduleTimeSlotInformation: async (timeSlotId: number) => {
            return await axios.get(`/api/institution-positions/schedule/timeslot/${timeSlotId}`);
        },
        getFilterCountries: async () => {
            return await axios.get('/api/institution-positions/filter/countries');
        },
        filter: async (country_code: string, city: string, from?: Date, to?: Date) => {
            const data: { country_code: string; city: string; from?: string; to?: string } = { country_code, city, }
            if (from) {
                data.from = from.toISOString();
            }
            if (to) {
                data.to = to.toISOString();
            }
            return await axios.post('/api/institution-positions/filter', data);
        }
    }

}