import React from 'react'
import ReactDOM from 'react-dom/client'

function PanelWindow(): JSX.Element {
  return <div>Panel Window</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PanelWindow />
  </React.StrictMode>
)
