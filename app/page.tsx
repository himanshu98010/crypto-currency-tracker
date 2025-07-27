"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, RefreshCw, Calculator, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
}

interface CurrencyRates {
  [key: string]: number
}

const currencies = [
  // Major Currencies
  { code: "USD", symbol: "$", name: "US Dollar", region: "North America" },
  { code: "EUR", symbol: "€", name: "Euro", region: "Europe" },
  { code: "GBP", symbol: "£", name: "British Pound", region: "Europe" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", region: "Asia" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", region: "Europe" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", region: "North America" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", region: "Oceania" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", region: "Oceania" },

  // Asian Currencies
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", region: "Asia" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", region: "Asia" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", region: "Asia" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", region: "Asia" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", region: "Asia" },
  { code: "THB", symbol: "฿", name: "Thai Baht", region: "Asia" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", region: "Asia" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", region: "Asia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", region: "Asia" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", region: "Asia" },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar", region: "Asia" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", region: "Asia" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", region: "Asia" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", region: "Asia" },
  { code: "NPR", symbol: "Rs", name: "Nepalese Rupee", region: "Asia" },

  // Middle East & Africa
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", region: "Middle East" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", region: "Middle East" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", region: "Middle East" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", region: "Middle East" },
  { code: "BHD", symbol: "د.ب", name: "Bahraini Dinar", region: "Middle East" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial", region: "Middle East" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar", region: "Middle East" },
  { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound", region: "Middle East" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", region: "Middle East" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", region: "Middle East" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial", region: "Middle East" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound", region: "Africa" },
  { code: "ZAR", symbol: "R", name: "South African Rand", region: "Africa" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", region: "Africa" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", region: "Africa" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", region: "Africa" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham", region: "Africa" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar", region: "Africa" },

  // European Currencies
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", region: "Europe" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", region: "Europe" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", region: "Europe" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", region: "Europe" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", region: "Europe" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", region: "Europe" },
  { code: "RON", symbol: "lei", name: "Romanian Leu", region: "Europe" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev", region: "Europe" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna", region: "Europe" },
  { code: "RSD", symbol: "дин", name: "Serbian Dinar", region: "Europe" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", region: "Europe" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", region: "Europe" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble", region: "Europe" },
  { code: "ISK", symbol: "kr", name: "Icelandic Krona", region: "Europe" },

  // Latin American Currencies
  { code: "MXN", symbol: "$", name: "Mexican Peso", region: "Latin America" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", region: "Latin America" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", region: "Latin America" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", region: "Latin America" },
  { code: "COP", symbol: "$", name: "Colombian Peso", region: "Latin America" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", region: "Latin America" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso", region: "Latin America" },
  { code: "BOB", symbol: "Bs", name: "Bolivian Boliviano", region: "Latin America" },
  { code: "PYG", symbol: "₲", name: "Paraguayan Guarani", region: "Latin America" },
  { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolívar", region: "Latin America" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal", region: "Latin America" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón", region: "Latin America" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso", region: "Latin America" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar", region: "Latin America" },
]

// Mock exchange rates (in a real app, fetch from an API)
const mockExchangeRates: CurrencyRates = {
  // Major Currencies
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110,
  CHF: 0.92,
  CAD: 1.25,
  AUD: 1.35,
  NZD: 1.45,

  // Asian Currencies
  CNY: 6.45,
  KRW: 1180,
  INR: 74.5,
  SGD: 1.35,
  HKD: 7.8,
  THB: 33.2,
  MYR: 4.15,
  IDR: 14250,
  PHP: 50.8,
  VND: 23100,
  TWD: 28.5,
  PKR: 155,
  BDT: 85.2,
  LKR: 200,
  NPR: 119,

  // Middle East & Africa
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.3,
  BHD: 0.38,
  OMR: 0.38,
  JOD: 0.71,
  LBP: 1507,
  ILS: 3.25,
  TRY: 8.45,
  IRR: 42000,
  EGP: 15.7,
  ZAR: 14.8,
  NGN: 411,
  KES: 108,
  GHS: 6.1,
  MAD: 9.2,
  TND: 2.8,

  // European Currencies
  NOK: 8.6,
  SEK: 8.9,
  DKK: 6.3,
  PLN: 3.9,
  CZK: 21.5,
  HUF: 295,
  RON: 4.2,
  BGN: 1.66,
  HRK: 6.4,
  RSD: 100,
  UAH: 27.3,
  RUB: 74.2,
  BYN: 2.5,
  ISK: 129,

  // Latin American Currencies
  MXN: 20.1,
  BRL: 5.2,
  ARS: 98.5,
  CLP: 710,
  COP: 3650,
  PEN: 3.6,
  UYU: 43.8,
  BOB: 6.9,
  PYG: 6850,
  VES: 4.18,
  GTQ: 7.7,
  CRC: 620,
  DOP: 56.8,
  JMD: 146,
}

// Mock crypto data with realistic prices
const initialCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250,
    change24h: 2.5,
    marketCap: 847000000000,
    volume24h: 28000000000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2650,
    change24h: -1.2,
    marketCap: 318000000000,
    volume24h: 15000000000,
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    price: 315,
    change24h: 0.8,
    marketCap: 47000000000,
    volume24h: 1200000000,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 98,
    change24h: 4.2,
    marketCap: 42000000000,
    volume24h: 2100000000,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.52,
    change24h: -2.1,
    marketCap: 18000000000,
    volume24h: 450000000,
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    price: 37,
    change24h: 1.8,
    marketCap: 14000000000,
    volume24h: 380000000,
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function CryptoTracker() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialCryptoData)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [converterAmount, setConverterAmount] = useState("1")
  const [converterFrom, setConverterFrom] = useState("bitcoin")
  const [converterTo, setConverterTo] = useState("USD")

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prevData) =>
        prevData.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change24h: crypto.change24h + (Math.random() - 0.5) * 0.5,
        })),
      )
      setLastUpdated(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number, currency: string) => {
    const rate = mockExchangeRates[currency]
    const convertedPrice = price * rate
    const currencyInfo = currencies.find((c) => c.code === currency)

    if (currency === "JPY" || currency === "CNY") {
      return `${currencyInfo?.symbol}${convertedPrice.toFixed(0)}`
    }
    return `${currencyInfo?.symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatMarketCap = (marketCap: number, currency: string) => {
    const rate = mockExchangeRates[currency]
    const convertedCap = marketCap * rate
    const currencyInfo = currencies.find((c) => c.code === currency)

    if (convertedCap >= 1e12) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e12).toFixed(2)}T`
    } else if (convertedCap >= 1e9) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e9).toFixed(2)}B`
    } else if (convertedCap >= 1e6) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e6).toFixed(2)}M`
    }
    return `${currencyInfo?.symbol}${convertedCap.toFixed(2)}`
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setCryptoData((prevData) =>
      prevData.map((crypto) => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.05), // ±2.5% change
        change24h: (Math.random() - 0.5) * 10, // Random change between -5% and +5%
      })),
    )
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const calculateConversion = () => {
    const fromCrypto = cryptoData.find((c) => c.id === converterFrom)
    if (!fromCrypto) return "0"

    const amount = Number.parseFloat(converterAmount) || 0
    const cryptoValue = fromCrypto.price * amount
    const rate = mockExchangeRates[converterTo]
    const convertedValue = cryptoValue * rate

    const currencyInfo = currencies.find((c) => c.code === converterTo)
    return `${currencyInfo?.symbol}${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Crypto Tracker</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Real-time cryptocurrency prices and conversion
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">
                        {currency.symbol} {currency.code}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">{currency.region}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ThemeToggle />

            <Button onClick={refreshData} disabled={isLoading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>

        {/* Crypto Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cryptoData.map((crypto) => (
            <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg card-title">{crypto.name}</CardTitle>
                    <CardDescription className="text-sm font-mono font-medium">{crypto.symbol}</CardDescription>
                  </div>
                  <Badge
                    variant={crypto.change24h >= 0 ? "default" : "destructive"}
                    className="flex items-center gap-1 badge"
                  >
                    {crypto.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {crypto.change24h.toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold tabular-nums">{formatPrice(crypto.price, selectedCurrency)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Market Cap: {formatMarketCap(crypto.marketCap, selectedCurrency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    24h Volume: {formatMarketCap(crypto.volume24h, selectedCurrency)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Currency Converter */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 card-title">
              <Calculator className="w-5 h-5" />
              Currency Converter
            </CardTitle>
            <CardDescription className="font-medium">Convert cryptocurrency to fiat currency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(e.target.value)}
                  placeholder="1"
                  className="font-medium"
                />
              </div>
              <div>
                <Label htmlFor="from" className="font-medium">
                  From
                </Label>
                <Select value={converterFrom} onValueChange={setConverterFrom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoData.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <span className="font-medium">
                          {crypto.symbol} - {crypto.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="to" className="font-medium">
                To
              </Label>
              <Select value={converterTo} onValueChange={setConverterTo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="font-medium">
                        {currency.symbol} {currency.code} - {currency.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Converted Amount:</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                {calculateConversion()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
