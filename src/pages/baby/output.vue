<template>
  <q-page padding class="docs-table">
    <q-table
      title="Output Table"
      :data="tableData"
      :columns="columns"
      row-key="_id"
    >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="desc" :props="props">
          <span class="text-italic">{{ props.row.name }}</span>
          <q-tooltip>I'd like to eat "{{ props.row.name }}"</q-tooltip>
        </q-td>
        <q-td key="calories" :props="props">
          <div class="row items-center justify-between no-wrap">
            <q-btn size="sm" round dense color="secondary" icon="remove" @click="props.row.calories--" class="q-mr-xs" />
            <q-btn size="sm" round dense color="tertiary" icon="add" @click="props.row.calories++" class="q-mr-sm" />
            <div>{{ props.row.calories }}</div>
          </div>
        </q-td>
        <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
        <q-td key="carbs" :props="props">
          <q-chip small square color="amber">{{ props.row.carbs }}</q-chip>
        </q-td>
        <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
        <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
        <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
        <q-td key="iron" :props="props">
          {{ props.row.iron }}
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import { QTable, QTh, QTr, QTd, QTableColumns } from 'quasar'
import axios from 'axios'
export default {
  components: {
    QTable,
    QTh,
    QTr,
    QTd,
    QTableColumns
  },
  name: 'Output-Table',
  data: () => ({
    columns: [
      { name: 'type', required: true, label: 'Type (Poo/Pee)', field: 'type', sortable: true },
      { name: 'time', label: 'Time', field: 'time', sortable: true },
      { name: 'remarks', label: 'Remarks', field: 'remarks' }
    ],
    tableData: [
    ]
  }),
  mounted () {
    this.update_table()
  },
  methods: {
    update_table: function () {
      axios.get('http://localhost:8081/api/babies/5abe510131dac80d382cd974/output')
        .then((response) => {
          this.tableData = response.data
        })
        .catch(e => {
        })
    }
  }
}
</script>
