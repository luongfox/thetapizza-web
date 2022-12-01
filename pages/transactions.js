import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { formatNumber, transactionUrl, accountUrl } from '../fixtures/utils'
import Loading from '../components/loading'
import Head from 'next/head'

export async function getServerSideProps(context) {
  const params = { date: '1D', type: '', account: '', currency: '', sort: 'amount' }
  if (context.query.date) {
    params.date = context.query.date
  }
  if (context.query.type) {
    params.type = context.query.type
  }
  if (context.query.account) {
    params.account = context.query.account
  }
  if (context.query.currency) {
    params.currency = context.query.currency
  }
  if (context.query.sort) {
    params.sort = context.query.sort
  }
  return { props: { params } }
}

export default function Transactions({ params: defaultParams }) {
  const router = useRouter()
  const [params, setParams] = useState(defaultParams)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [params])

  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactions()
    }, 30000); // 30 seconds
    return () => clearInterval(interval)
  }, [params])

  const loadTransactions = useCallback(() => {
    setLoading(prevLoading => true);
    fetch(process.env.apiEndpoint + '/transactions?date=' + (params.date ?? '') + '&type=' + (params.type ?? '') + '&account=' + (params.account ?? '') + '&currency=' + (params.currency ?? '') + '&sort=' + (params.sort ?? '') + '&t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setTransactions(prevTransactions => data.data)
        router.push({ pathname: '/transactions', query: params }, undefined, { shallow: true })
        setLoading(prevLoading => false);
      })
  }, [params])

  const handleFilterChange = (event) => {
    setParams(prevParams => ({ ...prevParams, [event.target.name]: event.target.value }))
  }

  const getDateObj = useCallback((timestamp) => {
    return new Date(timestamp * 1000)
  }, [])

  return (
    <div className="transactions">
      <Head>
        <title>Transactions</title>
      </Head>
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
          <option value="withdraw">Withdrawn</option>
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
              { loading ? <Loading/> : '' }
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
            <td className="auto-trim border p-1 text-center">{ formatNumber(transaction.coins, 2, 'auto') } { transaction.currency }<br/>(${ formatNumber(transaction.usd, 2) })</td>
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
