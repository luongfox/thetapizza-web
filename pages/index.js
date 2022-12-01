import { useState, useEffect } from 'react'
import { formatNumber } from '../fixtures/utils'
import Loading from '../components/loading'
import Head from 'next/head'

export async function getServerSideProps() {
  const result = await fetch(process.env.apiEndpoint + '/stats?t=' + Date.now())
    .then((res) => res.json())
  return { props: { stats: result.data } }
}

export default function Index({ stats: defaultStats }) {  
  const [stats, setStats] = useState(defaultStats);
  useEffect(() => {
    setInterval(() => {
      fetch(process.env.apiEndpoint + '/stats?t=' + Date.now())
        .then((res) => res.json())
        .then((data) => {
          setStats(prevStats => data.data)
        })
    }, 15000);
  }, [])

  return (
    <div className="index">
      <Head>
        <title>Theta Pizza</title>
      </Head>
      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Network</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">TVL</td><td className="w-1/2">${ formatNumber(stats.network.tvl, 2, 'auto') } ({ (stats.network.tvl_change_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.network.tvl_change_24h), 2, 'auto') })</td></tr>
          <tr><td>Validators</td><td>{ stats.network.validators }</td></tr>
          <tr><td>Guardians</td><td>{ formatNumber(stats.network.guardians , 0) }</td></tr>
          <tr><td>Elites</td><td>{ formatNumber(stats.network.elites, 0) }</td></tr>
          <tr><td>Active Wallets</td><td>{ formatNumber(stats.network.active_wallets, 0) }</td></tr>
          <tr><td>Transactions 24H</td><td>{ formatNumber(stats.network.transactions_24h, 0) }</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Theta</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">Rank</td><td className="w-1/2">{ stats.theta.rank }</td></tr>
          <tr><td>Price</td><td>${ formatNumber(stats.theta.price, 3) } ({ (stats.theta.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.theta.price_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>${ formatNumber(stats.theta.volume_24h , 2, 'auto') } ({ (stats.theta.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.theta.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>${ formatNumber(stats.theta.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.theta.stakes, 2, 'auto') } ({ formatNumber(stats.theta.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.theta.supply, 0, 'auto') } / 1B</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Tfuel</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">Rank</td><td className="w-1/2">{ stats.tfuel.rank }</td></tr>
          <tr><td>Price</td><td>${ formatNumber(stats.tfuel.price, 4) } ({ (stats.tfuel.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tfuel.price_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>${ formatNumber(stats.tfuel.volume_24h , 2, 'auto') } ({ (stats.tfuel.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tfuel.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>${ formatNumber(stats.tfuel.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.tfuel.stakes, 2, 'auto') } ({ formatNumber(stats.tfuel.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.tfuel.supply, 3, 'auto') } / Infinite</td></tr>
          <tr><td>Daily Burnt</td><td>{ formatNumber(stats.tfuel.daily_burnt, 0) }</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Tdrop</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">Rank</td><td className="w-1/2">{ formatNumber(stats.tdrop.rank, 0) }</td></tr>
          <tr><td>Price</td><td>${ formatNumber(stats.tdrop.price, 5) } ({ (stats.tdrop.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tdrop.price_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>${ formatNumber(stats.tdrop.volume_24h , 2, 'auto') } ({ (stats.tdrop.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tdrop.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>${ formatNumber(stats.tdrop.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.tdrop.stakes, 2, 'auto') } ({ formatNumber(stats.tdrop.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.tdrop.supply, 3, 'auto') } / 20B</td></tr>
          <tr><td>Staking APY</td><td>{ formatNumber(stats.tdrop.stakes_apy_percent, 2) + '%' }</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}