import { useState } from 'react'
import Scene1, { type SelectedItem } from './components/Scene1'
import Scene2 from './components/Scene2'
import './App.css'

function App() {
  const [scene, setScene] = useState<'select' | 'checkout'>('select')
  const [items, setItems] = useState<SelectedItem[]>([])

  return (
    <div className="app">
      {scene === 'select' ? (
        <Scene1
          onCheckout={(selected) => {
            setItems(selected)
            setScene('checkout')
          }}
        />
      ) : (
        <Scene2
          items={items}
          onBack={() => {
            setItems([])
            setScene('select')
          }}
        />
      )}
    </div>
  )
}

export default App
