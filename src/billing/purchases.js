import { Capacitor } from '@capacitor/core'

export const ENTITLEMENT_ID = import.meta.env.VITE_RC_ENTITLEMENT || 'premium'
export const PRODUCT_ID = import.meta.env.VITE_RC_PRODUCT_ID || 'italian_tracker_pro'

let configured = false

function apiKey() {
  const platform = Capacitor.getPlatform()
  if (platform === 'ios') return import.meta.env.VITE_RC_APPLE_API_KEY || ''
  if (platform === 'android') return import.meta.env.VITE_RC_GOOGLE_API_KEY || ''
  return import.meta.env.VITE_RC_TEST_API_KEY || ''
}

export function isNativeBillingReady() {
  return Capacitor.isNativePlatform() && Boolean(apiKey())
}

export async function initPurchases() {
  if (!isNativeBillingReady()) {
    configured = false
    return { configured: false }
  }
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  await Purchases.configure({ apiKey: apiKey() })
  configured = true
  return { configured: true }
}

function hasEntitlement(customerInfo) {
  return Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID])
}

export async function getPremiumEntitlement() {
  if (!configured) return false
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const { customerInfo } = await Purchases.getCustomerInfo()
  return hasEntitlement(customerInfo)
}

export async function purchasePremium() {
  if (!configured) {
    const error = new Error('STORE_UNAVAILABLE')
    error.code = 'STORE_UNAVAILABLE'
    throw error
  }
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const offerings = await Purchases.getOfferings()
  const pkg =
    offerings.current?.availablePackages?.find(
      (item) => item.product?.identifier === PRODUCT_ID,
    ) ?? offerings.current?.availablePackages?.[0]
  if (!pkg) {
    const error = new Error('NO_PACKAGE')
    error.code = 'NO_PACKAGE'
    throw error
  }
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
  return hasEntitlement(customerInfo)
}

export async function restorePremium() {
  if (!configured) {
    const error = new Error('STORE_UNAVAILABLE')
    error.code = 'STORE_UNAVAILABLE'
    throw error
  }
  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  const { customerInfo } = await Purchases.restorePurchases()
  return hasEntitlement(customerInfo)
}
