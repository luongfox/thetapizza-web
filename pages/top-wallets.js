import { formatNumber, accountUrl } from '../fixtures/utils'
import Head from 'next/head'
import { useState } from 'react'

export async function getServerSideProps(context) {
  const params = { currency: 'theta' }
  if (context.query.currency) {
    params.currency = context.query.currency
  }
  const thetaWalletsResult = await fetch(process.env.apiEndpoint + '/top-wallets?currency=theta&t=' + Date.now())
    .then((res) => res.json())
  const tfuelWalletsResult = await fetch(process.env.apiEndpoint + '/top-wallets?currency=tfuel&t=' + Date.now())
    .then((res) => res.json())
  const accountResult = await fetch(process.env.apiEndpoint + '/accounts?&t=' + Date.now())
    .then((res) => res.json())
  const wallets = params.currency === 'tfuel' ? tfuelWalletsResult.data : thetaWalletsResult.data
  return { props: { thetaWallets: thetaWalletsResult.data, tfuelWallets: tfuelWalletsResult.data, accounts: accountResult.data, wallets, params } }
}

export default function Transactions({ thetaWallets, tfuelWallets, accounts, wallets: defaultWallets, params: defaultParams }) {
  const [params, setParams] = useState(defaultParams)
  const [wallets, setWallets] = useState(defaultWallets)

  const handleCurrencyChange = (event) => {
    setParams(prevParams => ({ ...prevParams, currency: event.target.value }))
    if (event.target.value == 'theta') {
      setWallets(prevWallets => thetaWallets);
    } else if (event.target.value == 'tfuel') {
      setWallets(prevWallets => tfuelWallets);
    }
  }

  return (
    <div className="transactions">
      <Head>
        <title>Top Wallets</title>
      </Head>

      <div className="mt-6 mb-2"><input type="radio" name="currency" value="theta" checked={ params.currency === 'theta' } onChange={handleCurrencyChange} id="thetaCurrency" className="ml-2"/> <label for="thetaCurrency">Theta</label> <input type="radio" name="currency" value="tfuel" checked={ params.currency === 'tfuel' } onChange={handleCurrencyChange} id="tfuelCurrency" className="ml-2"/> <label for="tfuelCurrency">Tfuel</label></div>
      
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-slate-300">
            <th className="col-id w-7/12 border p-1 text-center">Name</th>
            <th className="border w-5/12 p-1 text-center capitalize">Amount ({ params.currency })</th>
          </tr>
        </thead>
        { wallets.map((wallet) => (
        <tbody key={ wallet.holder }>
          <tr>
            <td className="auto-trim border p-1 text-center text-blue-500"><a href={ accountUrl(wallet.address) }>{ accounts[wallet.address] ? accounts[wallet.address].name : wallet.address }</a></td>
            <td className="auto-trim border p-1 text-center">{ formatNumber(wallet.balance, 0) }</td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  )
}
