"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calculator,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

interface CurrencyRates {
  [key: string]: number;
}

const currencies = [
  // Major Currencies
  { code: "USD", symbol: "$", name: "US Dollar", region: "North America" },
  { code: "EUR", symbol: "€", name: "Euro", region: "Europe" },
  { code: "GBP", symbol: "£", name: "British Pound", region: "Europe" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", region: "Asia" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", region: "Europe" },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    region: "North America",
  },
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
  {
    code: "JOD",
    symbol: "د.ا",
    name: "Jordanian Dinar",
    region: "Middle East",
  },
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
  {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    region: "Latin America",
  },
  { code: "ARS", symbol: "$", name: "Argentine Peso", region: "Latin America" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", region: "Latin America" },
  { code: "COP", symbol: "$", name: "Colombian Peso", region: "Latin America" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", region: "Latin America" },
  {
    code: "UYU",
    symbol: "$U",
    name: "Uruguayan Peso",
    region: "Latin America",
  },
  {
    code: "BOB",
    symbol: "Bs",
    name: "Bolivian Boliviano",
    region: "Latin America",
  },
  {
    code: "PYG",
    symbol: "₲",
    name: "Paraguayan Guarani",
    region: "Latin America",
  },
  {
    code: "VES",
    symbol: "Bs.S",
    name: "Venezuelan Bolívar",
    region: "Latin America",
  },
  {
    code: "GTQ",
    symbol: "Q",
    name: "Guatemalan Quetzal",
    region: "Latin America",
  },
  {
    code: "CRC",
    symbol: "₡",
    name: "Costa Rican Colón",
    region: "Latin America",
  },
  {
    code: "DOP",
    symbol: "RD$",
    name: "Dominican Peso",
    region: "Latin America",
  },
  {
    code: "JMD",
    symbol: "J$",
    name: "Jamaican Dollar",
    region: "Latin America",
  },
];

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
};

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
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function CryptoTracker() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialCryptoData);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [converterAmount, setConverterAmount] = useState("1");
  const [converterFrom, setConverterFrom] = useState("bitcoin");
  const [converterTo, setConverterTo] = useState("USD");

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prevData) =>
        prevData.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change24h: crypto.change24h + (Math.random() - 0.5) * 0.5,
        }))
      );
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, currency: string) => {
    const rate = mockExchangeRates[currency];
    const convertedPrice = price * rate;
    const currencyInfo = currencies.find((c) => c.code === currency);

    if (currency === "JPY" || currency === "CNY") {
      return `${currencyInfo?.symbol}${convertedPrice.toFixed(0)}`;
    }
    return `${currencyInfo?.symbol}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (marketCap: number, currency: string) => {
    const rate = mockExchangeRates[currency];
    const convertedCap = marketCap * rate;
    const currencyInfo = currencies.find((c) => c.code === currency);

    if (convertedCap >= 1e12) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e12).toFixed(2)}T`;
    } else if (convertedCap >= 1e9) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e9).toFixed(2)}B`;
    } else if (convertedCap >= 1e6) {
      return `${currencyInfo?.symbol}${(convertedCap / 1e6).toFixed(2)}M`;
    }
    return `${currencyInfo?.symbol}${convertedCap.toFixed(2)}`;
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setCryptoData((prevData) =>
      prevData.map((crypto) => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.05), // ±2.5% change
        change24h: (Math.random() - 0.5) * 10, // Random change between -5% and +5%
      }))
    );
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const calculateConversion = () => {
    const fromCrypto = cryptoData.find((c) => c.id === converterFrom);
    if (!fromCrypto) return "0";

    const amount = Number.parseFloat(converterAmount) || 0;
    const cryptoValue = fromCrypto.price * amount;
    const rate = mockExchangeRates[converterTo];
    const convertedValue = cryptoValue * rate;

    const currencyInfo = currencies.find((c) => c.code === converterTo);
    return `${currencyInfo?.symbol}${convertedValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Crypto Tracker
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Real-time cryptocurrency prices and conversion
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
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
                      <span className="text-xs text-muted-foreground ml-2">
                        {currency.region}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ThemeToggle />

            <Button
              onClick={refreshData}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
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
                    <CardTitle className="text-lg card-title">
                      {crypto.name}
                    </CardTitle>
                    <CardDescription className="text-sm font-mono font-medium">
                      {crypto.symbol}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={crypto.change24h >= 0 ? "default" : "destructive"}
                    className="flex items-center gap-1 badge"
                  >
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {crypto.change24h.toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold tabular-nums">
                    {formatPrice(crypto.price, selectedCurrency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Market Cap:{" "}
                    {formatMarketCap(crypto.marketCap, selectedCurrency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    24h Volume:{" "}
                    {formatMarketCap(crypto.volume24h, selectedCurrency)}
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
            <CardDescription className="font-medium">
              Convert cryptocurrency to fiat currency
            </CardDescription>
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
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">
                Converted Amount:
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                {calculateConversion()}
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
          <br />
        </div>
        <div className="flex items-center justify-center text-white py-4">
          <div className="flex items-center gap-2">
            <span className="text-base mt-1">Made by himanshu ~</span>

            {/* GitHub Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 496 512"
              className="w-7 h-7 cursor-pointer hover:text-gray-500 transition-colors duration-200"
              onClick={() => window.open("https://github.com/himanshu98010")}
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>

            {/* X (Twitter) Icon */}
            <span className="[&>svg]:h-7 [&>svg]:w-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512"
                className="cursor-pointer hover:text-gray-500 transition-colors duration-200"
                onClick={() => window.open("https://x.com/himanshu98010")}
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
