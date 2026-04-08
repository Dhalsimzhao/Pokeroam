import { useState, useEffect } from 'react'
import { useI18n } from '../../shared/i18n'

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
  const { t } = useI18n()
  const [pokeballOpen, setPokeballOpen] = useState(false)

  // Reset open state when a new reward becomes available
  useEffect(() => {
    if (hasDailyReward) setPokeballOpen(false)
  }, [hasDailyReward])

  const handlePokeballClick = (): void => {
    if (hasDailyReward) {
      onClickPokeball()
    } else {
      setPokeballOpen((prev) => !prev)
    }
  }

  const pokeballClass = `desk-object pokeball${
    hasDailyReward ? ' pokeball--wobble' : pokeballOpen ? ' pokeball--open' : ''
  }`

  return (
    <div className="desk">
      <div className="desk-objects">
        {/* Computer / PC */}
        <div className="desk-object computer" onClick={onClickComputer}>
          <div className="monitor">
            <div className="monitor-screen">{t.pc}</div>
          </div>
          <div className="monitor-stand" />
          <span className="desk-object-label">{t.pokemonPC}</span>
        </div>

        {/* Pokédex */}
        <div className="desk-object pokedex-book" onClick={onClickPokedex}>
          <span className="desk-object-label">{t.pokedex}</span>
        </div>

        {/* Poké Ball (daily reward) */}
        <div className={pokeballClass} onClick={handlePokeballClick}>
          <div className="pokeball-top" />
          <div className="pokeball-bottom" />
          <div className="pokeball-line" />
          <div className="pokeball-center" />
          <span className="desk-object-label">{t.dailyReward}</span>
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
