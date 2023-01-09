export default function SearchForm({ params, setParams, setFormIsVisible }) {
  const doSearch = () => {
    const data = new FormData(document.querySelector('form'));
    setParams({
      date: data.get('date'),
      type: data.get('type'),
      account: data.get('account') ? data.get('account') : data.get('account2'),
      currency: data.get('currency'),
      sort: data.get('sort')
    })
    setFormIsVisible(false)

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      'event': 'search',
      'search_term': 'transactions'
    })
  }
  return (
    <div className="fixed z-10 overflow-y-auto top-0 w-full left-0" id="searchFormModel">
      <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75"/>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <form>
              <div className="filter grid gap-2 grid-cols-2 grid-rows-3 my-3">
                <input type="text" name="account" className="form-input" placeholder="Search by address"/>
                <select className="border form-select" name="date" defaultValue={params.date}>
                  <option value="">Date</option>
                  <option value="1D">24 hours</option>
                  <option value="3D">3 days</option>
                  <option value="7D">7 days</option>
                  <option value="14D">14 days</option>
                  <option value="30D">30 Days</option>
                </select>

                <select className="border" name="type" defaultValue={params.type}>
                  <option value="">Type</option>
                  <option value="transfer">Transfer</option>
                  <option value="stake">Stake</option>
                  <option value="withdraw">Withdrawn</option>
                </select>

                <select className="border" name="account2" defaultValue={params.account}>
                  <option value="">Account</option>
                  <option value="thetalab">ThetaLabs</option>
                  <option value="exchange">Exchanges</option>
                  <option value="validator">Validators</option>
                </select>

                <select className="border" name="currency" defaultValue={params.currency}>
                  <option value="">Currency</option>
                  <option value="theta">Theta</option>
                  <option value="tfuel">Tfuel</option>
                  <option value="tdrop">Tdrop</option>
                </select>

                <select className="border" name="sort" defaultValue={params.sort}>
                  <option value="date">Sort By Date</option>
                  <option value="amount">Sort By Amount</option>
                </select>
              </div>
            </form>
          </div>
          <div className="bg-gray-200 px-4 py-3 text-right">
            <button type="button" className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2" onClick={() => setFormIsVisible(false)}><i className="fas fa-times"></i> Cancel</button>
            <button type="button" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2" onClick={() => doSearch()}><i className="fas fa-plus"></i> Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}