import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [weNeed, setWeNeed] = useState(0)
  const [youPay, setYouPay] = useState(0)
  const [ccBills, setCcBills] = useState({})
  const [error, setError] = useState(false)
  const [funFact, setFunFact] = useState('')

  const handleSubmit = async (e) => {
    setError(false)
    setFunFact('')
    setCcBills({})
    let leftover = youPay - weNeed
    let bills = {}
    let denominations = [100, 33, 21, 7, 3, 1]

    if (+youPay > +weNeed) {
      for (let bill of denominations) {
        while (leftover >= bill) {
          if (bills[bill]) {
            bills[bill] += 1
          } else {
            bills[bill] = 1
          }
          leftover = (leftover - bill)
        }
      }
      setCcBills(bills)
    } else if (youPay === weNeed) {
      try {
        e.preventDefault()
        let fact = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en')
        setFunFact(fact.data.text)

      } catch (error) {
        e.preventDefault()
      }
    } else {
      setError(true)
    }
    e.preventDefault()
  }

  return (
    <div className="App">
      <img src={logo} alt="Crave logo" />
      <div >Elevating expectations for food delivery.</div>
      <strong><div>www.cravedelivery.com</div></strong>
      <form className='form' onSubmit={handleSubmit}>
        <div className='field'><p>We need</p> <input placeholder='We need' type="number" onChange={(e) => setWeNeed(e.target.value)} /></div>
        <div className='field'><p>You pay</p> <input placeholder='You pay' type="number" onChange={(e) => setYouPay(e.target.value)} /></div>
        <button type='submit'>Calculate Change</button>
      </form>
      {Object.keys(ccBills).length !== 0 && <div className='change-wrapper'>
        <div>Your change will be:</div>
        <div className="bills-wrapper">
          {Object.keys(ccBills).map((bill) => {
            return (
              <div className='bill-container' key={bill}>
                <div className='bill'>{ccBills[bill]}</div>
                <div>{bill} CC</div>
              </div>
            )
          })}
        </div>
      </div>}
      {error && <div className='error-wrapper'>
        <strong>
          <div className='title'>Your payment is not enough</div>
        </strong>
        <div >Please pay a higher amount</div>
      </div>}
      {funFact.length ? <div className='change-wrapper'>
        <strong> <div className='title'>You paid the exact amount</div></strong>
        <div>Here's a fun fact for you:</div>
        <div className='funFact'>{funFact}</div>
      </div> : ''}
    </div>
  );
}

export default App;
