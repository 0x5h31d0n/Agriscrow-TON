import TonWeb from 'tonweb';

export const TON_CONFIG = {
  isTestnet: true,
  testnetEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  mainnetEndpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: '9c0d76a8b59d1687c9bd75be3b6e59ae304f20ac9cb70c384d393266e83c4369'
};

export const getTonWeb = () => {
  const endpoint = TON_CONFIG.isTestnet ? TON_CONFIG.testnetEndpoint : TON_CONFIG.mainnetEndpoint;
  return new TonWeb(new TonWeb.HttpProvider(endpoint, { apiKey: TON_CONFIG.apiKey }));
};

export async function getTonPrice(): Promise<number> {
  try {
    const response = await fetch('http://localhost:5000/api/ton-price');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('TON price data:', data);
    return data.price;
  } catch (error) {
    console.error('Failed to fetch TON price:', error);
    throw error;
  }
}