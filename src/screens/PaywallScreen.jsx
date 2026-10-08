import { useI18n } from '../i18n.js'
import { FREE_DAYS_MAX } from '../progress.js'
import { isNativeBillingReady } from '../billing/purchases.js'
import './Lesson.css'
import './PaywallScreen.css'

export default function PaywallScreen({
  isPremium,
  busy,
  onPurchase,
  onRestore,
  onDevUnlock,
  onBack,
}) {
  const { t } = useI18n()
  const storeReady = isNativeBillingReady()

  return (
    <main className="day paywall">
      <header className="day__top">
        <button className="back-btn" type="button" onClick={onBack}>
          {t('back')}
        </button>
      </header>
      <span className="badge">{t('paywall.badge')}</span>
      <h1 className="paywall__title">{t('paywall.title')}</h1>
      <p className="paywall__lead">
        {t('paywall.lead', { free: FREE_DAYS_MAX })}
      </p>
      <ul className="paywall__perks">
        <li>{t('paywall.perkDays')}</li>
        <li>{t('paywall.perkReview')}</li>
        <li>{t('paywall.perkOffline')}</li>
      </ul>
      {isPremium ? (
        <p className="paywall__ok" role="status">
          {t('paywall.active')}
        </p>
      ) : (
        <>
          <button
            className="btn-primary"
            type="button"
            disabled={busy}
            onClick={onPurchase}
          >
            {busy ? t('paywall.busy') : t('paywall.cta')}
          </button>
          <button
            className="chip-btn paywall__restore"
            type="button"
            disabled={busy}
            onClick={onRestore}
          >
            {t('paywall.restore')}
          </button>
          {!storeReady ? (
            <p className="paywall__hint">{t('paywall.webHint')}</p>
          ) : null}
          {import.meta.env.DEV ? (
            <button
              className="chip-btn"
              type="button"
              disabled={busy}
              onClick={onDevUnlock}
            >
              {t('paywall.devUnlock')}
            </button>
          ) : null}
        </>
      )}
    </main>
  )
}
