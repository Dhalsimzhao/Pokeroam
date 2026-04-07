interface DeskAreaProps {
  onClickComputer: () => void
  onClickPokedex: () => void
  onClickPokeball: () => void
  hasDailyReward: boolean
}

export function DeskArea({
  onClickComputer,
  onClickPokedex,
  onClickPokeball,
  hasDailyReward
}: DeskAreaProps): JSX.Element {
  return (
    <div className="desk">
      <div className="desk-objects">
        {/* Computer / PC */}
        <div className="desk-object computer" onClick={onClickComputer}>
          <div className="monitor">
            <div className="monitor-screen">PC</div>
          </div>
          <div className="monitor-stand" />
          <span className="desk-object-label">Pokemon PC</span>
        </div>

        {/* Pokédex */}
        <div className="desk-object pokedex-book" onClick={onClickPokedex}>
          <span className="desk-object-label">Pokedex</span>
        </div>

        {/* Poké Ball (daily reward) */}
        <div
          className={`desk-object pokeball${hasDailyReward ? ' pokeball--bounce' : ''}`}
          onClick={onClickPokeball}
        >
          <div className="pokeball-top" />
          <div className="pokeball-bottom" />
          <div className="pokeball-line" />
          <div className="pokeball-center" />
          <span className="desk-object-label">Daily Reward</span>
        </div>
      </div>

      {/* Desk surface and legs */}
      <div className="desk-surface" />
      <div className="desk-legs">
        <div className="desk-leg desk-leg--left" />
        <div className="desk-leg desk-leg--right" />
      </div>
    </div>
  )
}
