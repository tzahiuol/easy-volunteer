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
      name: 'filter',
      displayName: 'Filter',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'quiz',
      displayName: 'Quiz',
      meta: {
        icon: 'ion-help',
      },
    }
  ] as INavigationRoute[],
}
