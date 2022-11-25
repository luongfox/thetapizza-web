import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { formatNumber, transactionUrl, accountUrl } from '../fixtures/utils'
import { THETAPIZZA_API_ENDPOINT } from '../fixtures/constants'

export default function Transactions() {
  const router = useRouter()
  const [params, setParams] = useState({ date: '1D', type: '', account: '', currency: '', sort: 'amount' })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  const loadTransactions = useCallback(() => {
    setLoading(prevLoading => true);
    fetch(THETAPIZZA_API_ENDPOINT + '/transactions?date=' + (params.date ?? '') + '&type=' + (params.type ?? '') + '&account=' + (params.account ?? '') + '&currency=' + (params.currency ?? '') + '&sort=' + (params.sort ?? ''))
      .then((res) => res.json())
      .then((data) => {
        setTransactions(prevTransactions => data.data)
        router.push({ pathname: '/transactions', query: params }, undefined, { shallow: true })
        setLoading(prevLoading => false);
      })
  }, [params])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    setParams(prevParams => router.query)
  }, [router.isReady])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    loadTransactions()
  }, [params])

  const handleFilterChange = (event) => {
    setParams(prevParams => ({ ...prevParams, [event.target.name]: event.target.value }))
  }

  const getDateObj = useCallback((timestamp) => {
    return new Date(timestamp * 1000)
  }, [])

  return (
    <div className="transactions">
      <div className="filter grid gap-2 grid-cols-3 grid-rows-2 my-3">
        <select className="border" name="date" value={params.date} onChange={handleFilterChange}>
          <option value="">Date</option>
          <option value="1D">24 hours</option>
          <option value="3D">3 days</option>
          <option value="7D">7 days</option>
          <option value="14D">14 days</option>
          <option value="30D">30 Days</option>
        </select>

        <select className="border" name="type" value={params.type} onChange={handleFilterChange}>
          <option value="">Type</option>
          <option value="transfer">Transfer</option>
          <option value="stake">Stake</option>
          <option value="withdrawn">Widthdrawn</option>
        </select>

        <select className="border" name="account" value={params.account} onChange={handleFilterChange}>
          <option value="">Account</option>
          <option value="thetalab">ThetaLabs</option>
          <option value="exchange">Exchanges</option>
          <option value="validator">Validators</option>
        </select>

        <select className="border" name="currency" value={params.currency} onChange={handleFilterChange}>
          <option value="">Currency</option>
          <option value="theta">Theta</option>
          <option value="tfuel">Tfuel</option>
          <option value="tdrop">Tdrop</option>
        </select>

        <select className="border" name="sort" value={params.sort} onChange={handleFilterChange}>
          <option value="date">Sort By Date</option>
          <option value="amount">Sort By Amount</option>
        </select>
      </div>
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="col-id w-3/12 border p-1 text-center">
              <div role="status" style={{ display: (loading ? 'block' : 'none') }}>
                  <svg class="mx-auto w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span class="sr-only">Loading...</span>
              </div>
            </th>
            <th className="col-from-to w-3/12 border p-1 text-left">From / To</th>
            <th className="border w-4/12 p-1 text-center">Amount</th>
            <th className="border w-2/12 p-1 text-center">Date</th>
          </tr>
        </thead>
        { transactions.map((transaction) => (
        <tbody key={ transaction._id }>
          <tr>
            <td className="auto-trim capitalize border p-1 text-left">
              { transaction.type_name.split('_')[0] }<br/>
              <a href={ transactionUrl(transaction._id) } className="text-blue-500">{ transaction._id }</a>
            </td>
            <td className="auto-trim border p-1 text-left">
              <a href={ accountUrl(transaction.from) } className="text-blue-500">{ transaction.from_account.length > 0 ? transaction.from_account[0].name : transaction.from }</a><br/>
              <a href={ accountUrl(transaction.to) } className="text-blue-500">{ transaction.to_account.length > 0 ? transaction.to_account[0].name : transaction.to }</a>
            </td>
            <td className="auto-trim border p-1 text-center">{ formatNumber(transaction.coins, 2) } { transaction.currency }<br/>(${ formatNumber(transaction.usd, 2) })</td>
            <td className="border p-1 text-center">
              { (getDateObj(transaction.date).getUTCMonth() + 1).toString().padStart(2, '0') }-{ getDateObj(transaction.date).getDate().toString().padStart(2, '0') }<br/>
              { getDateObj(transaction.date).getHours().toString().padStart(2, '0') }:{ getDateObj(transaction.date).getMinutes().toString().padStart(2, '0') }
            </td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  )
}
