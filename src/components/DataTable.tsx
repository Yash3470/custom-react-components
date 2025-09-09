import React, { useMemo, useState } from 'react'
import { clsx } from 'clsx'

export interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
  render?: (value: any, record: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  rowKey?: keyof T | ((record: T, index: number) => string | number)
  selectionMode?: 'single' | 'multiple'
  emptyText?: string
}

type SortState<T> = { key: keyof T | null; direction: 'asc' | 'desc' }

function getRowKey<T>(row: T, index: number, rowKey?: DataTableProps<T>['rowKey']): string | number {
  if (!rowKey) return (index as number)
  if (typeof rowKey === 'function') return rowKey(row, index)
  return (row as any)[rowKey] as any
}

export function DataTable<T extends Record<string, any>> ({
  data,
  columns,
  loading = false,
  selectable = false,
  selectionMode = 'multiple',
  onRowSelect,
  rowKey,
  emptyText = 'No data'
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState<T>>({ key: null, direction: 'asc' })
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set())

  const sorted = useMemo(() => {
    if (!sort.key) return data
    const copy = [...data]
    copy.sort((a, b) => {
      const av = a[sort.key as keyof T]
      const bv = b[sort.key as keyof T]
      if (av == null && bv == null) return 0
      if (av == null) return -1
      if (bv == null) return 1
      if (av < bv) return sort.direction === 'asc' ? -1 : 1
      if (av > bv) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [data, sort])

  function toggleSort(key: keyof T) {
    setSort(prev => (prev.key !== key) ? { key, direction: 'asc' } :
      { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' })
  }

  function isSelected(k: string | number) {
    return selectedKeys.has(k)
  }

  function toggleSelect(k: string | number, row: T) {
    setSelectedKeys(prev => {
      const next = new Set(prev)
      if (selectionMode === 'single') {
        next.clear()
        next.add(k)
      } else {
        if (next.has(k)) next.delete(k); else next.add(k)
      }
      if (onRowSelect) {
        const rows = sorted.filter((r, i) => next.has(getRowKey(r, i, rowKey)))
        onRowSelect(rows)
      }
      return next
    })
  }

  function toggleSelectAll() {
    if (selectionMode === 'single') return
    setSelectedKeys(prev => {
      const next = new Set(prev)
      const allKeys = sorted.map((r, i) => getRowKey(r, i, rowKey))
      const allSelected = allKeys.every(k => next.has(k))
      if (allSelected) {
        allKeys.forEach(k => next.delete(k))
      } else {
        allKeys.forEach(k => next.add(k))
      }
      if (onRowSelect) {
        const rows = sorted.filter((r, i) => next.has(getRowKey(r, i, rowKey)))
        onRowSelect(rows)
      }
      return next
    })
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 ">
      <table role="table" className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr role="row">
            {selectable && (
              <th scope="col" className="w-10 px-3 py-2">
                {selectionMode === 'multiple' ? (
                  <input
                    aria-label="Select all rows"
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={sorted.length > 0 && sorted.every((r, i) => isSelected(getRowKey(r, i, rowKey)))}
                  />
                ) : null}
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                className={clsx('px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 select-none',
                  col.sortable && 'cursor-pointer')}
                onClick={() => col.sortable && toggleSort(col.dataIndex as keyof T)}
                aria-sort={sort.key === col.dataIndex ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1">
                  {col.title}
                  {col.sortable && (
                    <span aria-hidden="true" className="text-xs">
                      {sort.key === col.dataIndex ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {loading ? (
            <tr>
              <td colSpan={(columns.length + (selectable ? 1 : 0))} className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-300">
                Loading...
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={(columns.length + (selectable ? 1 : 0))} className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-300">
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, idx) => {
              const key = getRowKey(row, idx, rowKey)
              return (
                <tr key={String(key)} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {selectable && (
                    <td className="px-3">
                      {selectionMode === 'single' ? (
                        <input
                          aria-label="Select row"
                          type="radio"
                          name="row-select"
                          checked={isSelected(key)}
                          onChange={() => toggleSelect(key, row)}
                        />
                      ) : (
                        <input
                          aria-label="Select row"
                          type="checkbox"
                          checked={isSelected(key)}
                          onChange={() => toggleSelect(key, row)}
                        />
                      )}
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                      {col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}