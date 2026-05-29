import { useEffect, useState, useCallback } from 'react';

interface FreighterWallet {
  publicKey: string;
  isConnected: boolean;
}

export function useFreighter() {
  const [wallet, setWallet] = useState<FreighterWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Freighter is available
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        // @ts-ignore - Freighter is injected into window
        if (typeof window !== 'undefined' && window.freighter) {
          // @ts-ignore
          const publicKey = await window.freighter.getPublicKey();
          if (publicKey) {
            setWallet({
              publicKey,
              isConnected: true,
            });
          }
        }
      } catch (err) {
        console.error('Freighter check failed:', err);
        setError('Freighter wallet not found');
      } finally {
        setLoading(false);
      }
    };

    checkFreighter();
  }, []);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // @ts-ignore
      if (!window.freighter) {
        throw new Error('Freighter wallet not installed');
      }

      // @ts-ignore
      const publicKey = await window.freighter.getPublicKey();
      
      if (!publicKey) {
        throw new Error('Failed to get public key from Freighter');
      }

      setWallet({
        publicKey,
        isConnected: true,
      });

      return publicKey;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setError(null);
  }, []);

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!wallet?.isConnected) {
        throw new Error('Wallet not connected');
      }

      try {
        // @ts-ignore
        const signedXdr = await window.freighter.signTransaction(xdr, {
          networkPassphrase: 'Test SDF Network ; May 28, 2015',
        });
        return signedXdr;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Transaction signing failed';
        setError(errorMessage);
        throw err;
      }
    },
    [wallet]
  );

  return {
    wallet,
    loading,
    error,
    connect,
    disconnect,
    signTransaction,
    isConnected: wallet?.isConnected || false,
    publicKey: wallet?.publicKey || null,
  };
}
