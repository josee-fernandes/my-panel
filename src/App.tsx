import React from 'react'

import { months } from './services/data'

interface IBill {
  id: number
  label: string
  value: number
  month: number
  paid: boolean
}

export const App = () => {
  const [label, setLabel] = React.useState('')
  const [value, setValue] = React.useState(0)
  const [month, setMonth] = React.useState(-1)
  const [bills, setBills] = React.useState<IBill[]>([])
  const [total, setTotal] = React.useState(0)

  const [balance, setBalance] = React.useState(0)
  const [updatingBalance, setUpdatingBalance] = React.useState(false)

  const handleEditBalance = () => {
    setUpdatingBalance(updatingBalance => !updatingBalance)
  }

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.currentTarget.value) !== balance) {
      setBalance(Number(event.currentTarget.value))
    }
  }

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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (Number(event.currentTarget.value) !== month) {
      setMonth(Number(event.currentTarget.value))
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!!label.trim() && !!value) {
      setBills(bills => [
        ...bills,
        {
          id: bills.length,
          label,
          value,
          month,
          paid: false
        }
      ])
  
      setLabel('')
      setValue(0)
    }
  }

  const handleRemoveBill = (id: number) => {
    setBills(bills => bills.filter(bill => bill.id !== id))
  }

  const handlePaidBill = (id: number) => {
    setBills(bills => bills.map(bill => (bill.id === id ? { ...bill, paid: true } : bill)))
  }

  const handleNotPaidBill = (id: number) => {
    setBills(bills => bills.map(bill => (bill.id === id ? { ...bill, paid: false } : bill)))
  }

  React.useEffect(() => {
    if (window) {
      const balanceItem = window.localStorage.getItem('workaround.balance')

      const balanceData = balanceItem ? JSON.parse(balanceItem) : 0

      setBalance(balanceData)

      const billsItem = window.localStorage.getItem('workaround.bills')

      const billData = billsItem ? JSON.parse(billsItem) : []

      setBills(billData)
      
      const monthItem = window.localStorage.getItem('workaround.month')

      const monthData = monthItem ? Number(JSON.parse(monthItem)) : 0

      setMonth(monthData)
    }
  }, [])

  React.useEffect(() => {
    if (window && !updatingBalance && balance !== 0) {
      window.localStorage.setItem('workaround.balance', JSON.stringify(balance))
    }
  }, [balance, updatingBalance])

  React.useEffect(() => {
    if (window && bills?.length > 0) {
      window.localStorage.setItem('workaround.bills', JSON.stringify(bills))    
    }
  }, [bills])

  React.useEffect(() => {
    if (window && month !== -1) {
      window.localStorage.setItem('workaround.month', JSON.stringify(month))
    }
  }, [month])

  React.useEffect(() => {
    if (window && bills?.length > 0) {
      setTotal(
        bills.reduce(
          (accumulator, bill) =>
            bill.month === month
              ? accumulator + bill.value
              : accumulator,
        0)
      )
    }
  }, [bills, month])

  return (
    <div>
      <div>
        <h1>Saldo</h1>
        {!updatingBalance && <span>{balance.toLocaleString('pt-BR')} R$</span>}
        {updatingBalance && (
          <input
            type="number"
            value={balance}
            onChange={handleBalanceChange}
          />
        )}
        <button onClick={handleEditBalance}>
          {updatingBalance ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div>
          <h1>Adicionar conta</h1>
        </div>
        <div>
          <label htmlFor="label">Nome</label>
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
          <label htmlFor="month">Mês</label>
          <select id="month" value={month} onChange={handleMonthChange}>
            {months.map(month => (
              <option key={month.id} value={month.id}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Salvar</button>
        </div>
      </form>
      
      <div>
        <h1>Lista de contas</h1>
        <div>
          <label htmlFor="month-l">Mês</label>
          <select id="month-l" value={month} onChange={handleMonthChange}>
            {months.map(month => (
              <option key={month.id} value={month.id}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Total: ({total.toLocaleString('pt-BR')} R$)</p>
        </div>
        {bills?.length > 0 && (
          <ul>
            {bills?.map((bill) => bill.month === month && (
              <li
                key={bill.id}
                style={{
                  background: `linear-gradient(90deg, ${bill?.paid ? 'green' : 'red'}, transparent)`,
                  color: 'white'
                }}
              >
                {bill.label} - {bill.value.toLocaleString('pt-BR')} R$
                <button onClick={() => handleRemoveBill(bill.id)}>Remover</button>
                {!bill.paid && <button onClick={() => handlePaidBill(bill.id)}>Pago</button>}
                {bill.paid && <button onClick={() => handleNotPaidBill(bill.id)}>Não pago</button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
