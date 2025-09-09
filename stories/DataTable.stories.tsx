import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { DataTable, Column } from '../src/components/DataTable'
import '../src/index.css'

type User = { id: number; name: string; email: string; password: string }

const initialData: User[] = [
  { id: 1, name: 'Yash', email: 'yash@example.com', password: '••••••' },
  { id: 2, name: 'kartik', email: 'kartik@example.com', password: '••••••' },
  { id: 3, name: 'karan', email: 'karan@example.com', password: '••••••' },
]

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'password', title: 'Password', dataIndex: 'password', sortable: true },
]

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' }
}
export default meta
type Story = StoryObj<typeof DataTable<User>>

// --------- Basic Story ---------
export const Basic: Story = {
  render: () => <DataTable<User> data={initialData} columns={columns} />
}

// --------- Selectable Story ---------
export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([])
    return (
      <div className="space-y-2">
        <DataTable<User> data={initialData} columns={columns} selectable onRowSelect={setSelected} />
        <div className="text-sm">Selected: {selected.map(s => s.name).join(', ') || 'None'}</div>
      </div>
    )
  }
}

// --------- Loading Story ---------
export const Loading: Story = {
  render: () => <DataTable<User> data={[]} columns={columns} loading />
}

// --------- Empty Story ---------
export const Empty: Story = {
  render: () => <DataTable<User> data={[]} columns={columns} />
}

// --------- Interactive Story (Add/Delete) ---------
export const Interactive: Story = {
  render: () => {
    const [tableData, setTableData] = useState<User[]>(initialData)
    const [selected, setSelected] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    const handleAdd = () => {
      setLoading(true)
      setTimeout(() => {
        const newUser: User = {
          id: Date.now(),
          name: `User${tableData.length + 1}`,
          email: `user${tableData.length + 1}@example.com`,
          password: '••••••'
        }
        setTableData(prev => [...prev, newUser])
        setLoading(false)
      }, 1000)
    }

    const actionColumns: Column<User>[] = [
      ...columns,
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
      }
    ]

    return (
      <div className="space-y-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Add User
        </button>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <DataTable<User>
              data={tableData}
              columns={actionColumns}
              selectable
              onRowSelect={setSelected}
              loading={loading}
             
            />
          </div>
        </div>

        <div className="text-sm">Selected: {selected.map(s => s.name).join(', ') || 'None'}</div>
      </div>
    )
  }
}
