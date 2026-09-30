import SpeakButton from './SpeakButton.jsx'
import { useI18n } from '../i18n.js'
import './Learn.css'

export default function SavedPhrasesSheet({ open, phrases, onClose }) {
  const { t } = useI18n()
  if (!open) return null

  return (
    <div className="sheet-root" role="presentation">
      <button
        className="sheet-backdrop"
        type="button"
        aria-label={t('close')}
        onClick={onClose}
      />
      <section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-phrases-title"
      >
        <header className="sheet__header">
          <h2 id="saved-phrases-title" className="sheet__title">
            {t('savedPhrases')}
          </h2>
          <button className="sheet__close" type="button" onClick={onClose}>
            {t('close')}
          </button>
        </header>
        {phrases.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__icon" aria-hidden="true">
              📌
            </p>
            <p className="empty-state__title">{t('savedEmptyTitle')}</p>
            <p className="empty-state__text">{t('savedEmptyText')}</p>
          </div>
        ) : (
          <ul className="phrase-list">
            {phrases.map((phrase) => (
              <li key={phrase.id} className="card">
                <div>
                  <div className="it-line">
                    <p className="card__title">{phrase.it}</p>
                    <SpeakButton text={phrase.it} />
                  </div>
                  {phrase.uk ? <p className="card__subtitle">{phrase.uk}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
