export function WindowCurtain(): JSX.Element {
  return (
    <>
      {/* Window */}
      <div className="window-frame">
        <div className="window-cross-h" />
        <div className="window-cross-v" />
      </div>

      {/* Curtains */}
      <div className="curtain curtain--left">
        <div className="curtain-tie" />
      </div>
      <div className="curtain curtain--right">
        <div className="curtain-tie" />
      </div>
    </>
  )
}
