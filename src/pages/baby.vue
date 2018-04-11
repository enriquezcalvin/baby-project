<template>
  <div>
    <q-tabs>
      <q-route-tab slot="title" label="Feeding" icon="fas fa-utensil-spoon" to="/baby" />
      <q-route-tab slot="title" label="Output" icon="mdi-emoticon-poop" to="/baby/output" />
    </q-tabs>
    <router-view />
  </div>
</template>

<style>
</style>

<script>
import { QTabs, QTab, QBtn, QRouteTab } from 'quasar'
export default {
  components: {
    QTabs,
    QTab,
    QRouteTab,
    QBtn
  },
  sockets: {
    connect: function (args) {
      console.log('socket connected', args)
    },
    notify_connection: function (val) {
      console.log('another person has connected')
      this.$q.notify('Another person has connected!')
    }
  },
  name: 'PageBaby',
  data () {
    return {
      tab: 'mails'
    }
  }
}
</script>
