import Head from 'next/head'
import { accountUrl, formatNumber } from '../fixtures/utils'
import process from '../next.config'
import { useCallback, useEffect, useState } from 'react'

export async function getServerSideProps(context) {
  const params = {
    account: context.query.account,
    type: '',
    currency: '',
    flow: 'next',
    minUsd: context.query.min_usd ?? 10000
  }
  const accountResult = await fetch(process.env.apiEndpoint + '/accounts?&t=' + Date.now())
    .then((res) => res.json())
  return { props: { params: params, accounts: accountResult.data } }
}

export default function Trace({ params: defaultParams, accounts }) {
  const [data, setData] = useState(new Map())
  const [params, setParams] = useState(defaultParams)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(() => {
    setLoading(true)
    fetch(process.env.apiEndpoint + '/trace?account=' + params.account + '&type=' + params.type + '&currency=' + params.currency + '&flow=' + params.flow + '&min_usd=' + params.minUsd)
      .then((res) => res.json())
      .then((res) => {
        setData(prevData => {
          const newData = prevData
          newData.set(params.account, res.data)
          return newData
        })
        setLoading(false)
      })
  }, [params])

  const details = useCallback((account) => {
    setParams(oldParams => {
      return { ...oldParams, account: account }
    })
  }, [])

  const getAccountName = useCallback((accountId) => {
    if (accounts[accountId]) {
      return accountId.substring(0, 6) + ' (' + accounts[accountId].name + ')'
    } else {
      return accountId.substring(0, 6)
    }
  }, [])

  const getDateObj = useCallback((timestamp) => {
    return new Date(timestamp * 1000)
  }, [])

  useEffect(() => {
    loadData()
  }, [params])

  return (
    <div className="tracing">
      <Head>
        <title>Tracing</title>
      </Head>

      <div className="mt-2">
      { Array.from(data.keys()).map((acc, i) => (
        <div key={ i } className="node mt-4">
          <div className="name font-bold">{ getAccountName(acc) }</div>
          <div className="children text-sm">
            { data.get(acc).map((child, i2) => (
              <div key={ i2 }> -&gt; <a href={ accountUrl(child.to) } className="text-blue-500">{ getAccountName(child.to) }</a>, { child.type_name.split('_')[0] }, <a onClick={ () => details(child.to) }>{ formatNumber(child.coins, 1, 'auto') } { child.currency }</a>, { getDateObj(child.date).getUTCFullYear() + '-' + (getDateObj(child.date).getUTCMonth() + 1) + '-' + getDateObj(child.date).getUTCDate() }</div>
            ))}
          </div>
        </div>
      ))}
      </div>

    </div>
  )
}
