import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { DataTable, Column } from '../src/components/DataTable'

type User = { id: number; name: string; email: string }
const data: User[] = [
  { id: 1, name: 'Bob', email: 'b@example.com' },
  { id: 2, name: 'Alice', email: 'a@example.com' },
]
const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
]

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable<User> data={data} columns={columns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('selects rows and calls onRowSelect', () => {
    const spy = vi.fn()
    render(<DataTable<User> data={data} columns={columns} selectable onRowSelect={spy} />)
    const checkboxes = screen.getAllByRole('checkbox')
    // first checkbox is header "select all"
    fireEvent.click(checkboxes[1])
    expect(spy).toHaveBeenCalled()
  })
})