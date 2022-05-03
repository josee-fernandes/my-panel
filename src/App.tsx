import React from 'react'

interface IBill {
  id: number
  label: string
  value: number
}

export const App = () => {
  const [label, setLabel] = React.useState('')
  const [value, setValue] = React.useState(0)
  const [bills, setBills] = React.useState<IBill[]>([])
  const [total, setTotal] = React.useState(0)

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value !== label) {
      setLabel(event.currentTarget.value)
    }
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.currentTarget.value) !== value) {
      setValue(Number(event.currentTarget.value))
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!!label.trim() && !!value) {
      setBills(bills => [...bills, { id: bills.length, label, value }])
  
      setLabel('')
      setValue(0)
    }
  }

  const handleRemoveBill = (id: number) => {
    setBills(bills => bills.filter(bill => bill.id !== id))
  }

  React.useEffect(() => {
    if (window) {
      const item = window.localStorage.getItem('bills')

      const data = item ? JSON.parse(item) : []

      setBills(data)
    }
  }, [])

  React.useEffect(() => {
    if (window && bills.length > 0) {
      window.localStorage.setItem('bills', JSON.stringify(bills))    
    }
  }, [bills])

  React.useEffect(() => {
    if (bills?.length > 0) {
      setTotal(bills.reduce((accumulator, bill) => accumulator + bill.value, 0))
    }
  }, [bills])

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="label">Nome da conta</label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={handleLabelChange}
          />
        </div>
        <div>
          <label htmlFor="value">Valor</label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <button type="submit">Salvar</button>
        </div>
      </form>
      
      {bills?.length > 0 && (
        <div>
          <h2>Lista de contas ({total.toLocaleString('pt-BR')} R$)</h2>
          <ul>
            {bills?.map((bill) => (
              <li key={bill.id}>
                {bill.label} - {bill.value}
                <button onClick={() => handleRemoveBill(bill.id)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
