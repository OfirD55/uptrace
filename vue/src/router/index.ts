import Vue from 'vue'
import VueRouter, { RouteConfig, NavigationGuard } from 'vue-router'

// Composables
import { useUser } from '@/org/use-users'

import NotFoundPage from '@/org/views/NotFoundPage.vue'
import ProjectSettings from '@/org/views/ProjectSettings.vue'

import Alerting from '@/alerting/views/Alerting.vue'
import AlertList from '@/alerting/views/AlertList.vue'
import AlertShow from '@/alerting/views/AlertShow.vue'
import MonitorList from '@/alerting/views/MonitorList.vue'
import MonitorMetricShow from '@/alerting/views/MonitorMetricShow.vue'
import MonitorMetricNew from '@/alerting/views/MonitorMetricNew.vue'
import MonitorErrorShow from '@/alerting/views/MonitorErrorShow.vue'
import MonitorErrorNew from '@/alerting/views/MonitorErrorNew.vue'
import ChannelList from '@/alerting/views/ChannelList.vue'
import ChannelShowSlack from '@/alerting/views/ChannelShowSlack.vue'
import ChannelShowWebhook from '@/alerting/views/ChannelShowWebhook.vue'
import ChannelShowAlertmanager from '@/alerting/views/ChannelShowAlertmanager.vue'
import EmailNotifications from '@/alerting/views/EmailNotifications.vue'

import Overview from '@/tracing/views/Overview.vue'
import OverviewAttr from '@/tracing/views/OverviewAttr.vue'
import OverviewSlowestGroups from '@/tracing/views/OverviewSlowestGroups.vue'
import OverviewGroups from '@/tracing/views/OverviewGroups.vue'

import TracingHelp from '@/tracing/views/Help.vue'
import Tracing from '@/tracing/views/Tracing.vue'
import TracingGroups from '@/tracing/views/TracingGroups.vue'
import TracingSpans from '@/tracing/views/TracingSpans.vue'
import TracingTimeseries from '@/tracing/views/TracingTimeseries.vue'

import TraceShow from '@/tracing/views/TraceShow.vue'
import TraceFind from '@/tracing/views/TraceFind.vue'
import SpanShow from '@/tracing/views/SpanShow.vue'

import MetricsLayout from '@/metrics/views/Layout.vue'
import MetricsDash from '@/metrics/views/Dashboard.vue'
import MetricsExplore from '@/metrics/views/Explore.vue'
import MetricsHelp from '@/metrics/views/Help.vue'

import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    beforeEnter: async (_to, _from, next) => {
      const user = useUser()
      await user.getOrLoad()

      const first = user.projects[0]
      if (first) {
        next({
          name: 'Overview',
          params: { projectId: String(first.id) },
        })
        return
      }

      next({ name: 'ProjectCreate' })
    },
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    name: 'TracingHelp',
    path: '/help/:projectId(\\d+)',
    component: TracingHelp,
  },
  {
    name: 'ProjectCreate',
    path: '/help/projects',
    component: TracingHelp,
  },
  {
    name: 'ProjectShow',
    path: '/projects/:projectId(\\d+)',
    component: ProjectSettings,
  },

  {
    path: '/alerting/:projectId(\\d+)',
    name: 'Alerting',
    component: Alerting,
    redirect: { name: 'AlertList' },
    children: [
      {
        name: 'AlertList',
        path: 'alerts',
        components: { alerting: AlertList },
      },
      {
        name: 'AlertShow',
        path: 'alerts/:alertId(\\d+)',
        components: { alerting: AlertShow },
      },

      {
        name: 'NotifChannelList',
        path: 'channels',
        components: { alerting: ChannelList },
      },

      {
        name: 'MonitorList',
        path: 'monitors',
        components: { alerting: MonitorList },
      },

      {
        name: 'NotifChannelEmail',
        path: 'email',
        components: { alerting: EmailNotifications },
      },
    ],
  },

  {
    name: 'MonitorMetricNew',
    path: '/alerting/:projectId(\\d+)/monitors/new-metric',
    component: MonitorMetricNew,
  },
  {
    name: 'MonitorMetricShow',
    path: '/alerting/:projectId(\\d+)/monitors/:monitorId(\\d+)/metric',
    component: MonitorMetricShow,
  },
  {
    name: 'MonitorErrorNew',
    path: '/alerting/:projectId(\\d+)/monitors/new-error',
    component: MonitorErrorNew,
  },
  {
    name: 'MonitorErrorShow',
    path: '/alerting/:projectId(\\d+)/monitors/:monitorId(\\d+)/error',
    component: MonitorErrorShow,
  },

  {
    name: 'NotifChannelShowSlack',
    path: '/alerting/:projectId(\\d+)/channels/slack/:channelId(\\d+)',
    component: ChannelShowSlack,
  },
  {
    name: 'NotifChannelShowWebhook',
    path: '/alerting/:projectId(\\d+)/channels/webhook/:channelId(\\d+)',
    component: ChannelShowWebhook,
  },
  {
    name: 'NotifChannelShowAlertmanager',
    path: '/alerting/:projectId(\\d+)/channels/alertmanager/:channelId(\\d+)',
    component: ChannelShowAlertmanager,
  },

  {
    path: '/alerts/:projectId(\\d+)/:alertId(\\d+)',
    redirect: { name: 'AlertList' },
  },
  {
    path: '/alerts',
    beforeEnter: redirectToProject('AlertList'),
  },

  {
    name: 'Overview',
    path: '/overview/:projectId(\\d+)',
    component: Overview,
    redirect: { name: 'SystemOverview' },

    children: [
      {
        name: 'SystemOverview',
        path: 'systems',
        component: OverviewAttr,
      },
      {
        name: 'SystemGroupList',
        path: 'groups/:system',
        component: OverviewGroups,
      },
      {
        name: 'AttrOverview',
        path: 'attributes/:attr',
        component: OverviewAttr,
      },
      {
        name: 'SlowestGroups',
        path: 'slowest-groups',
        component: OverviewSlowestGroups,
      },
    ],
  },
  {
    path: '/:projectId(\\d+)',
    redirect: { name: 'Overview' },
  },
  {
    path: '/overview',
    beforeEnter: redirectToProject('SystemOverview'),
  },

  {
    path: '/spans/:projectId(\\d+)',
    component: Tracing,
    children: [
      {
        name: 'SpanGroupList',
        path: '',
        components: { tracing: TracingGroups },
      },
      {
        name: 'SpanList',
        path: 'items',
        components: { tracing: TracingSpans },
      },
      {
        name: 'SpanTimeseries',
        path: 'timeseries',
        components: { tracing: TracingTimeseries },
      },
    ],
  },
  {
    path: '/spans',
    beforeEnter: redirectToProject('SpanGroupList'),
  },

  {
    path: '/events',
    beforeEnter: redirectToProject('SpanGroupList'),
  },

  {
    name: 'TraceShow',
    path: '/traces/:projectId(\\d+)/:traceId',
    component: TraceShow,
  },
  {
    name: 'SpanShow',
    path: '/traces/:projectId(\\d+)/:traceId/:spanId',
    component: SpanShow,
  },
  {
    path: '/traces/:traceId',
    name: 'TraceFind',
    component: TraceFind,
  },

  {
    path: '/metrics/:projectId(\\d+)',
    component: MetricsLayout,
    children: [
      {
        path: '',
        name: 'MetricsDashList',
        components: { metrics: MetricsDash },
      },
      {
        path: ':dashId(\\d+)',
        name: 'MetricsDashShow',
        components: { metrics: MetricsDash },
      },
      {
        path: 'explore',
        name: 'MetricsExplore',
        components: { metrics: MetricsExplore },
      },
    ],
  },
  {
    path: '/metrics/:projectId(\\d+)/help',
    name: 'MetricsHelp',
    component: MetricsHelp,
  },
  {
    path: '/metrics',
    beforeEnter: redirectToProject('MetricsDashList'),
  },

  { path: '*', component: NotFoundPage },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

function redirectToProject(routeName: string): NavigationGuard {
  return async (_to, _from, next) => {
    const user = useUser()
    await user.getOrLoad()

    const first = user.projects[0]
    if (first) {
      next({
        name: routeName,
        params: { projectId: String(first.id) },
      })
      return
    }

    next({ name: 'ProjectCreate' })
  }
}

export default router
