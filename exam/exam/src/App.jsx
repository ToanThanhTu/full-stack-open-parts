import { useState } from 'react'
import Hello from './components/Hello'

function App() {
  // const list = [{m: 'Hei'}, {m:'Hey'}, {m:'Hi'}]
  const [x, setX] = useState(1)
  return (
    <button onClick={() => setX(x+5)}>
      press
      <Hello />
    </button>
  )

  // list.map(elem =>
  //   <div key={elem.m}> {elem.m} </div>
  // )
}

export default App
