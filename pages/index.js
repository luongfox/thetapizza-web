import { useState, useEffect } from 'react'
import { formatNumber } from '../fixtures/utils'
import { THETAPIZZA_API_ENDPOINT } from '../fixtures/constants'

export default function Index() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(prevLoading => true);
    fetch(THETAPIZZA_API_ENDPOINT + '/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(prevStats => data.data)
        setLoading(prevLoading => false);
      })
  }, [])

  if (!stats.network) {
    return (
      <div role="status">
        <svg className="mx-auto w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
    )
  }

  return (
    <div className="index">
      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Network</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">TVL</td><td className="w-1/2">{ formatNumber(stats.network.tvl, 2, 'auto') } ({ (stats.network.tvl_change_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.network.tvl_change_24h), 2, 'auto') })</td></tr>
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
          <tr><td>Price</td><td>{ formatNumber(stats.theta.price, 3) } ({ (stats.theta.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(stats.theta.price_change_percent_24h, 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>{ formatNumber(stats.theta.volume_24h , 2, 'auto') } ({ (stats.theta.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.theta.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>{ formatNumber(stats.theta.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.theta.stakes, 2, 'auto') } ({ formatNumber(stats.theta.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.theta.supply, 0) }</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Tfuel</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">Rank</td><td className="w-1/2">{ stats.tfuel.rank }</td></tr>
          <tr><td>Price</td><td>{ formatNumber(stats.tfuel.price, 3) } ({ (stats.tfuel.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(stats.tfuel.price_change_percent_24h, 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>{ formatNumber(stats.tfuel.volume_24h , 2, 'auto') } ({ (stats.tfuel.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tfuel.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>{ formatNumber(stats.tfuel.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.tfuel.stakes, 2, 'auto') } ({ formatNumber(stats.tfuel.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.tfuel.supply, 0) }</td></tr>
          <tr><td>Daily Burnt</td><td>{ formatNumber(stats.tfuel.daily_burnt, 0) }</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-3">
        <h2 className="bg-slate-300 leading-relaxed pl-2">Tdrop</h2>
        <table className="table-fixed w-full border-separate border-spacing-1">
          <tbody>
          <tr><td className="w-1/2">Rank</td><td className="w-1/2">{ stats.tdrop.rank }</td></tr>
          <tr><td>Price</td><td>{ formatNumber(stats.tdrop.price, 4) } ({ (stats.tdrop.price_change_percent_24h >= 0 ? '+' : '-') + formatNumber(stats.tdrop.price_change_percent_24h, 2) + '%' })</td></tr>
          <tr><td>Volume 24H</td><td>{ formatNumber(stats.tdrop.volume_24h , 2, 'auto') } ({ (stats.tdrop.volume_change_percent_24h >= 0 ? '+' : '-') + formatNumber(Math.abs(stats.tdrop.volume_change_percent_24h), 2) + '%' })</td></tr>
          <tr><td>Maket cap</td><td>{ formatNumber(stats.tdrop.market_cap, 2, 'auto') }</td></tr>
          <tr><td>Stakes</td><td>{ formatNumber(stats.tdrop.stakes, 2, 'auto') } ({ formatNumber(stats.tdrop.stakes_percent, 2) + '%' })</td></tr>
          <tr><td>Supply</td><td>{ formatNumber(stats.tdrop.supply, 3, 'auto') } ({ formatNumber(stats.tdrop.supply_percent, 2) + '%' })</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}