export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'find',
      displayName: 'Find',
      meta: {
        icon: 'mso-location_on',
      },
    },
    {
      name: 'quiz',
      displayName: 'Quiz',
      meta: {
        icon: 'mso-question_mark',
      },
    }
  ] as INavigationRoute[],
}
