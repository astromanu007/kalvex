export const PATTERNS = {
  indianPhone: /(\+91|0)?[6-9]\d{9}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  whatsapp: /wa\.me\/|whatsapp\.com/gi,
  social: /(instagram\.com|facebook\.com|t\.me|linkedin\.com|twitter\.com|x\.com)\//gi,
  upi: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}/g,
}

export function scanForContactInfo(text: string): { hasContactInfo: boolean; matchedPattern?: string; match?: string } {
  for (const [patternName, regex] of Object.entries(PATTERNS)) {
    const matches = text.match(regex)
    if (matches && matches.length > 0) {
      return {
        hasContactInfo: true,
        matchedPattern: patternName,
        match: matches[0],
      }
    }
  }
  return { hasContactInfo: false }
}
