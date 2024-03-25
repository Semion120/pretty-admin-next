import './styles.scss'
import {
  Table,
  TableActionConfig,
  TableColumnConfig,
  TableDataItem,
  withTableActions,
} from '@gravity-ui/uikit'
import { Dispatch, SetStateAction } from 'react'

function TableList<Type>(config: ConfigProps<Type>) {
  const MyTable = withTableActions(Table)

  return (
    <div className="table-list">
      <MyTable
        data={config.items}
        columns={config.columns}
        getRowActions={config.rowActions}
        emptyMessage="Не найдено"
      />
    </div>
  )
}

export default TableList

type ConfigProps<Type> = {
  items: any[]
  defaultItems: Type[] | null
  columns: TableColumnConfig<TableDataItem>[]
  rowActions: (
    item: TableDataItem,
    index: number
  ) => TableActionConfig<TableDataItem>[]
  updateItems: Dispatch<SetStateAction<Type[] | null>>
}
