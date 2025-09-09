import React, { useState } from 'react'
import { InputField } from './components/InputField'
import { DataTable, Column } from './components/DataTable'

type User = {
  id: number;
  name: string;
  email: string;
  password: string; 
}

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'password', title: 'Password', dataIndex: 'password', sortable: true }, 
]

// Default static data for the table
const defaultData: User[] = [
  { id: 1, name: 'Yash', email: 'yash@example.com', password: '••••••••' },
  { id: 2, name: 'kartik', email: 'kartik@example.com', password: '••••••••' },
  { id: 3, name: 'karan', email: 'karan@example.com', password: '••••••••' },
]

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  // Validation states
  const isEmailInvalid = email.length > 0 && !email.includes('@')
  const isPasswordInvalid = password.length > 0 && password.length < 8
  const isFormValid = email && password && !isEmailInvalid && !isPasswordInvalid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setIsDisabled(true)

    // Simulate API call / processing
    setTimeout(() => {
      setEmail('')
      setPassword('')
      setIsLoading(false)
      setIsDisabled(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <header className="flex flex-col items-center justify-center text-center space-y-2 p-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          React Components Assignment
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Demo of <code>InputField</code> and <code>DataTable</code>.
        </p>
      </header>

      {/* InputField Form */}
      <div className="w-full max-w-md space-y-4">
        <InputField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={isEmailInvalid}
          errorMessage="Please enter a valid email"
          helperText="We never share your email."
          variant="outlined"
          size="md"
          clearable
          disabled={isDisabled}
          loading={isLoading}
        />

        <InputField
          label="Password"
          placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          invalid={isPasswordInvalid}
          errorMessage="Password must be at least 8 characters"
          helperText="Use 8+ characters."
          variant="filled"
          size="md"
          passwordToggle
          disabled={isDisabled}
          loading={isLoading}
        />

        <button
          className={`w-full mt-2 px-4 py-2 rounded text-white font-semibold ${
            isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={!isFormValid || isDisabled}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* DataTable Section */}
      <div className="w-full max-w-4xl mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-center">DataTable</h2>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <DataTable<User>
              data={defaultData}
              columns={columns}
              selectable
              onRowSelect={setSelected}
            />
          </div>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
          Selected: {selected.map(s => s.name).join(', ') || 'None'}
        </div>
      </div>
    </div>
  )
}
