// Stock Price Service using Alpha Vantage API
// Free tier: 5 API calls per minute, 500 calls per day

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: Date
}

export interface StockHistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CompanyInfo {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  marketCap: number
  peRatio: number
  dividendYield: number
}

export class StockService {
  private apiKey: string
  private baseUrl = 'https://www.alphavantage.co/query'
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 60000 // 1 minute cache

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_KEY || 'demo'
  }

  private async fetchWithCache(url: string): Promise<any> {
    const cached = this.cache.get(url)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Check for API error messages
      if (data['Error Message']) {
        throw new Error(data['Error Message'])
      }

      if (data['Note']) {
        // Rate limit message
        throw new Error('API rate limit reached. Please try again later.')
      }

      this.cache.set(url, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('Stock API error:', error)
      throw error
    }
  }

  async getCurrentPrice(symbol: string): Promise<StockQuote | null> {
    try {
      const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      const data = await this.fetchWithCache(url)

      const quote = data['Global Quote']
      if (!quote || Object.keys(quote).length === 0) {
        return null
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: new Date(quote['07. latest trading day'])
      }
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error)
      return null
    }
  }

  async getHistoricalData(
    symbol: string,
    period: '1M' | '3M' | '6M' | '1Y' | 'ALL' = '1Y'
  ): Promise<StockHistoricalData[]> {
    try {
      const url = `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKey}`
      const data = await this.fetchWithCache(url)

      const timeSeries = data['Time Series (Daily)']
      if (!timeSeries) {
        return []
      }

      const now = new Date()
      const cutoffDate = new Date()

      switch (period) {
        case '1M':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case '3M':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case '6M':
          cutoffDate.setMonth(now.getMonth() - 6)
          break
        case '1Y':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
        case 'ALL':
          cutoffDate.setFullYear(1900) // Get everything
          break
      }

      const historicalData: StockHistoricalData[] = []
      for (const [date, values] of Object.entries(timeSeries)) {
        const dataDate = new Date(date)
        if (dataDate >= cutoffDate) {
          historicalData.push({
            date,
            open: parseFloat((values as any)['1. open']),
            high: parseFloat((values as any)['2. high']),
            low: parseFloat((values as any)['3. low']),
            close: parseFloat((values as any)['4. close']),
            volume: parseInt((values as any)['5. volume'])
          })
        }
      }

      return historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      return []
    }
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo | null> {
    try {
      const url = `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`
      const data = await this.fetchWithCache(url)

      if (!data.Symbol) {
        return null
      }

      return {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description || '',
        sector: data.Sector || 'N/A',
        industry: data.Industry || 'N/A',
        marketCap: parseInt(data.MarketCapitalization || '0'),
        peRatio: parseFloat(data.PERatio || '0'),
        dividendYield: parseFloat(data.DividendYield || '0') * 100
      }
    } catch (error) {
      console.error(`Error fetching company info for ${symbol}:`, error)
      return null
    }
  }

  async searchSymbol(query: string): Promise<Array<{ symbol: string; name: string }>> {
    try {
      const url = `${this.baseUrl}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.apiKey}`
      const data = await this.fetchWithCache(url)

      const matches = data.bestMatches || []
      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name']
      })).slice(0, 10) // Return top 10 matches
    } catch (error) {
      console.error('Error searching symbols:', error)
      return []
    }
  }

  // Get multiple stock quotes at once (batch operation)
  async getBatchQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    const quotes = new Map<string, StockQuote>()

    // Batch requests with delay to respect rate limits (5 per minute)
    for (let i = 0; i < symbols.length; i++) {
      const quote = await this.getCurrentPrice(symbols[i])
      if (quote) {
        quotes.set(symbols[i], quote)
      }

      // Add delay between requests (12 seconds for 5 requests per minute)
      if (i < symbols.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 12000))
      }
    }

    return quotes
  }
}

// Singleton instance
export const stockService = new StockService()
