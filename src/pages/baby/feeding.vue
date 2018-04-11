<template>
  <q-page padding class="docs-table">
    <q-table
      title="Feeding Table"
      :data="tableData"
      :columns="columns"
      row-key="_id"
      :pagination.sync="pagination"
    >

      <div slot="top-right" slot-scope="props" class="column">
        <div>
          <q-btn
            color="primary"
            size="sm"
            label="Add Left Breast Feeding"
            icon="add"
            class="q-mb-sm"
            @click="start_left_breast_feeding"
          />
          <q-btn
            color="primary"
            size="sm"
            label="Add Right Breast Feeding"
            icon="add"
            class="q-mb-sm"
            @click="start_right_breast_feeding"
          />
        </div>
        <div>
          <q-btn
            color="primary"
            size="sm"
            class="q-mb-sm-sq"
            icon="refresh"
            @click="update_table"
          />
          <q-btn
            color="primary"
            size="sm"
            label="Add Bottle Feeding"
            icon="add"
            @click="start_bottle_feeding"
          />
        </div>
      </div>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="type" :props="props">{{props.row.type}}</q-td>
        <q-td key="start_time" :props="props">{{moment(props.row.start_time).tz('Asia/Hong_Kong').format('LLL')}}</q-td>
        <q-td key="end_time" :props="props">{{props.row.end_time ? moment(props.row.end_time).tz('Asia/Hong_Kong').format('LLL'): ''}}</q-td>
        <q-td key="breast" :props="props">{{props.row.breast}}</q-td>
        <q-td key="quantity" :props="props">
          <div class="row items-center justify-between no-wrap">
            <q-btn size="sm" round dense color="secondary" icon="remove" @click="dec_quantity(props.row._id)" class="q-mr-xs" />
            <div>{{ props.row.quantity }}</div>
            <q-btn size="sm" round dense color="tertiary" icon="add" @click="inc_quantity(props.row._id)" class="q-mr-sm" />
          </div>
        </q-td>
        <q-td key="end_feeding" :props="props">
          <div class="row items-center justify-between no-wrap">
            <q-btn size="sm" color="secondary" label="End" @click="end_feeding(props.row._id)" class="q-ma-xs" />
            <q-btn size="sm" color="negative" label="Delete" @click="delete_feeding(props.row._id)" class="q-ma-xs" />
          </div>
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import { QTable, QTh, QTr, QTd, QTableColumns } from 'quasar'
export default {
  components: {
    QTable,
    QTh,
    QTr,
    QTd,
    QTableColumns
  },
  name: 'Feeding-Table',
  data: () => ({
    columns: [
      { name: 'type', required: true, label: 'Type (Breast/Bottle)', align: 'center', field: 'type', sortable: true },
      { name: 'start_time', label: 'Start Time', align: 'center', field: 'start_time', sortable: true },
      { name: 'end_time', label: 'End Time', align: 'center', field: 'end_time', sortable: true },
      { name: 'breast', label: 'Breast', align: 'center', field: 'breast', sortable: true },
      { name: 'quantity', label: 'Quantity (oz)', align: 'center', field: 'quantity', sortable: true },
      { name: 'end_feeding', label: 'End Feeding', align: 'center' }
    ],
    tableData: [
    ],
    pagination: {
      sortBy: 'start_time', // String, column "name" property value
      descending: true,
      rowsPerPage: 25 // current rows per page being displayed
    }
  }),
  mounted () {
    this.update_table()
  },
  sockets: {
    update_tables: function () {
      this.update_table()
    }
  },
  methods: {
    update_table: function () {
      this.$axios.get('/api/babies/5abe510131dac80d382cd974/intake')
        .then((response) => {
          this.tableData = response.data
        })
        .catch(e => {
        })
    },
    start_left_breast_feeding: function (breast) {
      this.$axios.post('/api/babies/5abe510131dac80d382cd974/intake', {
        type: 'Breast',
        breast: 'Left'
      })
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    start_right_breast_feeding: function (breast) {
      this.$axios.post('/api/babies/5abe510131dac80d382cd974/intake', {
        type: 'Breast',
        breast: 'Right'
      })
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    start_bottle_feeding: function () {
      this.$axios.post('/api/babies/5abe510131dac80d382cd974/intake', {
        type: 'Bottle'
      })
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    end_feeding: function (id) {
      this.$axios.get('/api/intake/' + id + '/finish')
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    delete_feeding: function (id) {
      this.$axios.delete('/api/intake/' + id)
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    inc_quantity: function (id) {
      this.$axios.get('/api/intake/' + id + '/inc')
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    },
    dec_quantity: function (id) {
      this.$axios.get('/api/intake/' + id + '/dec')
        .then((response) => {
          this.update_table()
          this.$socket.emit('update_intake_table')
        })
    }
  }
}
</script>
