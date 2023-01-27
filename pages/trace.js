import Head from 'next/head'
import { accountUrl, formatNumber } from '../fixtures/utils'
import process from '../next.config'
import { useCallback, useEffect, useState } from 'react'

export async function getServerSideProps(context) {
  const params = {
    account: context.query.account,
    type: context.query.type ?? '',
    currency: context.query.currency ?? '',
    flow: context.query.flow ?? 'next',
    minUsd: context.query.min_usd ?? 50000
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
          newData.set(params.account + '_' + params.flow, res.data)
          return newData
        })
        setLoading(false)
      })
  }, [params])

  const details = useCallback((account, flow) => {
    setParams(oldParams => {
      return { ...oldParams, account: account, flow: flow }
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
          <div className="name font-bold"><a onClick={ () => details(acc.split('_')[0], 'prev') }>{ getAccountName(acc.split('_')[0]) }</a> ({ acc.split('_')[1] == 'next' ? 'sender' : 'recipient' })</div>
          <div className="children text-sm">
            { data.get(acc).map((child, i2) => (
              <div key={ i2 }> -&gt; <a href={ accountUrl(acc.split('_')[1] == 'next' ? child.to : child.from) } className="text-blue-500">{ getAccountName(acc.split('_')[1] == 'next' ? child.to : child.from) }</a>, { child.type_name.split('_')[0] }, <a onClick={ () => details(acc.split('_')[1] == 'next' ? child.to : child.from, 'next') }>{ formatNumber(child.coins, 1, 'auto') } { child.currency }</a>, { getDateObj(child.date).getUTCFullYear() + '-' + (getDateObj(child.date).getUTCMonth() + 1) + '-' + getDateObj(child.date).getUTCDate() }</div>
            ))}
          </div>
        </div>
      ))}
      </div>

    </div>
  )
}
