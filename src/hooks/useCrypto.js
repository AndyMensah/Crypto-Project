import axios from "axios";
import { useEffect, useState } from "react";

export function useCryptos(type) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        let url =
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=6&sparkline=false";

        if (type === "gainers") {
          url += "&order=gecko_desc";
        } else if (type === "new") {
          url += "&order=market_cap_desc&category=recently_added";
        } else {
          url += "&order=market_cap_desc";
        }

        const response = await axios.get(url);
        setCryptos(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        setCryptos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, [type]);

  return { cryptos, loading, error };
}
