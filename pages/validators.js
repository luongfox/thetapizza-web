import { formatNumber, accountUrl } from '../fixtures/utils'
import Head from 'next/head'

export async function getServerSideProps() {
  const validatorResult = await fetch(process.env.apiEndpoint + '/stake/validators?&t=' + Date.now())
    .then((res) => res.json())
  const accountResult = await fetch(process.env.apiEndpoint + '/accounts?&t=' + Date.now())
    .then((res) => res.json())
  return { props: { validators: validatorResult.data, accounts: accountResult.data } }
}

export default function Transactions({ validators, accounts }) {
  return (
    <div className="transactions">
      <Head>
        <title>Validators</title>
      </Head>

      <div className="mt-6 mb-2">Validators: { validators.length }</div>
      
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-slate-300">
            <th className="col-id w-7/12 border p-1 text-center">Name</th>
            <th className="border w-5/12 p-1 text-center">Amount (Theta)</th>
          </tr>
        </thead>
        { validators.map((validator) => (
        <tbody key={ validator.holder }>
          <tr>
            <td className="auto-trim border p-1 text-center text-blue-500"><a href={ accountUrl(validator.holder) }>{ accounts[validator.holder] ? accounts[validator.holder].name : validator.holder }</a></td>
            <td className="auto-trim border p-1 text-center">{ formatNumber(validator.amount, 0) }</td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  )
}
