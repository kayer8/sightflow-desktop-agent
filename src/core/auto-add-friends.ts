export interface AutoAddFriendsSettings {
  enabled: boolean
  phonesJson: string
  intervalSeconds: number
}

const PHONE_PATTERN = /^\+?\d{7,15}$/
const MIN_INTERVAL_SECONDS = 20

export function parseAutoAddPhones(phonesJson: string): string[] {
  try {
    const parsed = JSON.parse(phonesJson) as { phones?: unknown } | unknown[]
    const rawPhones = Array.isArray(parsed) ? parsed : parsed?.phones
    if (!Array.isArray(rawPhones)) return []

    return Array.from(new Set(
      rawPhones
        .filter((phone): phone is string => typeof phone === 'string')
        .map((phone) => phone.trim())
        .filter((phone) => PHONE_PATTERN.test(phone))
    ))
  } catch {
    return []
  }
}

export function getTestAutoAddPhone(phonesJson: string): string | null {
  return parseAutoAddPhones(phonesJson)[0] || null
}

export function normalizeAutoAddFriendsSettings(raw: Partial<AutoAddFriendsSettings> | undefined): AutoAddFriendsSettings {
  const legacyIntervalMinutes = (raw as Partial<AutoAddFriendsSettings> & { intervalMinutes?: unknown } | undefined)
    ?.intervalMinutes
  const intervalSeconds = Number(
    raw?.intervalSeconds ?? (legacyIntervalMinutes === undefined ? undefined : Number(legacyIntervalMinutes) * 60)
  )
  return {
    enabled: raw?.enabled === true,
    phonesJson: typeof raw?.phonesJson === 'string' ? raw.phonesJson : '{"phones":[]}',
    intervalSeconds: Number.isFinite(intervalSeconds)
      ? Math.max(MIN_INTERVAL_SECONDS, Math.floor(intervalSeconds))
      : MIN_INTERVAL_SECONDS
  }
}

export const AUTO_ADD_FRIENDS_MIN_INTERVAL_SECONDS = MIN_INTERVAL_SECONDS
