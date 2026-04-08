import { useI18n } from '../../shared/i18n'

interface ChairAreaProps {
  onClickBackpack: () => void
}

export function ChairArea({ onClickBackpack }: ChairAreaProps): JSX.Element {
  const { t } = useI18n()

  return (
    <div className="chair-area">
      <div className="chair">
        <div className="chair-back" />
        <div className="chair-seat" />
        <div className="chair-legs">
          <div className="chair-leg chair-leg--fl" />
          <div className="chair-leg chair-leg--fr" />
        </div>

        {/* Backpack hanging on chair */}
        <div className="backpack" onClick={onClickBackpack}>
          <div className="backpack-flap" />
          <div className="backpack-buckle" />
          <span className="backpack-label">{t.backpack}</span>
        </div>
      </div>
    </div>
  )
}
