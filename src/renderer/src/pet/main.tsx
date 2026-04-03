import React from 'react'
import ReactDOM from 'react-dom/client'

function PetWindow(): JSX.Element {
  return <div>Pet Window</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PetWindow />
  </React.StrictMode>
)
