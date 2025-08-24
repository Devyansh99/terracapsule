// Country Information API utilities
export interface CountryInfo {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population: number;
  area: number;
  region: string;
  subregion?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  timezones: string[];
  continents: string[];
  latlng: [number, number];
  borders?: string[];
  independent?: boolean;
}

// Cache for country data to avoid repeated API calls
const countryCache = new Map<string, CountryInfo>();

/**
 * Get country information by country code (ISO 3166-1 alpha-2)
 */
export async function getCountryInfo(countryCode: string): Promise<CountryInfo | null> {
  try {
    // Check cache first
    if (countryCache.has(countryCode.toLowerCase())) {
      return countryCache.get(countryCode.toLowerCase()) || null;
    }

    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,capital,population,area,region,subregion,languages,currencies,flag,flags,timezones,continents,latlng,borders,independent`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const countryInfo = Array.isArray(data) ? data[0] : data;

    // Cache the result
    countryCache.set(countryCode.toLowerCase(), countryInfo);
    
    return countryInfo;
  } catch (error) {
    console.warn(`Failed to fetch country info for ${countryCode}:`, error);
    return null;
  }
}

/**
 * Get country information by name
 */
export async function getCountryByName(countryName: string): Promise<CountryInfo | null> {
  try {
    const cacheKey = `name_${countryName.toLowerCase()}`;
    
    if (countryCache.has(cacheKey)) {
      return countryCache.get(cacheKey) || null;
    }

    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,capital,population,area,region,subregion,languages,currencies,flag,flags,timezones,continents,latlng,borders,independent`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const countryInfo = Array.isArray(data) ? data[0] : data;

    countryCache.set(cacheKey, countryInfo);
    
    return countryInfo;
  } catch (error) {
    console.warn(`Failed to fetch country info for ${countryName}:`, error);
    return null;
  }
}

/**
 * Format population number with proper units
 */
export function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)}B`;
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
}

/**
 * Format area with proper units
 */
export function formatArea(area: number): string {
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(1)}M km²`;
  } else if (area >= 1000) {
    return `${(area / 1000).toFixed(0)}K km²`;
  }
  return `${area.toLocaleString()} km²`;
}

/**
 * Get primary language from languages object
 */
export function getPrimaryLanguage(languages?: { [key: string]: string }): string {
  if (!languages) return 'N/A';
  const languageValues = Object.values(languages);
  return languageValues[0] || 'N/A';
}

/**
 * Get primary currency from currencies object
 */
export function getPrimaryCurrency(currencies?: { [key: string]: { name: string; symbol: string } }): string {
  if (!currencies) return 'N/A';
  const currencyValues = Object.values(currencies);
  const currency = currencyValues[0];
  return currency ? `${currency.name} (${currency.symbol})` : 'N/A';
}

/**
 * Country code mapping for common variations
 */
export const COUNTRY_CODE_MAP: { [key: string]: string } = {
  'United States': 'US',
  'United States of America': 'US',
  'USA': 'US',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Russia': 'RU',
  'Russian Federation': 'RU',
  'China': 'CN',
  'South Korea': 'KR',
  'North Korea': 'KP',
  'Vietnam': 'VN',
  'Iran': 'IR',
  'Syria': 'SY',
  'Bolivia': 'BO',
  'Venezuela': 'VE',
  'Tanzania': 'TZ',
  'Moldova': 'MD',
  'Laos': 'LA',
  'Brunei': 'BN',
  'Macedonia': 'MK',
};

/**
 * Get country code from country name
 */
export function getCountryCode(countryName: string): string {
  return COUNTRY_CODE_MAP[countryName] || countryName.substring(0, 2).toUpperCase();
}
