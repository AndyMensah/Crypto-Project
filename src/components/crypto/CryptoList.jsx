import { useCryptos } from "../hooks/useCrypto";

interface CryptoListProps {
  type: "tradable" | "gainers" | "new";
}

export default function CryptoList({ type }: CryptoListProps) {
  const { cryptos, loading, error } = useCryptos(type);

  if (loading) return <div className="text-gray-400 py-8">Loading...</div>;
  if (error) return <div className="text-red-400 py-8">{error}</div>;

  return (
    <div className="space-y-2">
      {cryptos.map((crypto) => (
        <div
          key={crypto.id}
          className="flex items-center justify-between py-4 px-4 hover:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-white font-semibold">{crypto.name}</p>
              <p className="text-gray-400 text-sm">
                {crypto.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">
              ${crypto.current_price.toLocaleString()}
            </p>
            <p
              className={`text-sm font-semibold ${
                crypto.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {crypto.price_change_percentage_24h >= 0 ? "📈" : "📉"}{" "}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
