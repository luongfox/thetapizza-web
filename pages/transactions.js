import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { formatNumber, transactionUrl, accountUrl } from '../fixtures/utils'
import SearchForm from '../components/search-form'
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
  const [formIsVisible, setFormIsVisible] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [params])

  const loadTransactions = useCallback(() => {
    fetch(process.env.apiEndpoint + '/transactions?date=' + (params.date ?? '') + '&type=' + (params.type ?? '') + '&account=' + (params.account ?? '') + '&currency=' + (params.currency ?? '') + '&sort=' + (params.sort ?? '') + '&t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        setTransactions(prevTransactions => data.data)
        router.push({ pathname: '/transactions', query: params }, undefined, { shallow: true })
      })
  }, [params])

  const getDateObj = useCallback((timestamp) => {
    return new Date(timestamp * 1000)
  }, [])

  return (
    <div className="transactions mt-3">
      <Head>
        <title>Transactions</title>
      </Head>
      { formIsVisible && <SearchForm params={params} setParams={setParams} setFormIsVisible={setFormIsVisible} /> }
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="col-id w-3/12 border p-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 inline-block" onClick={() => setFormIsVisible(true)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
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
