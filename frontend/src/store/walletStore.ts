import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActiveRole = 'client' | 'freelancer';

interface WalletState {
  address: string | null;
  walletName: string | null;
  network: string | null;
  targetNetwork: string;
  activeRole: ActiveRole;
  isClient: boolean;
  isFreelancer: boolean;
  token: string | null;
  setActiveRole: (role: ActiveRole) => void;
  setNetwork: (network: string | null) => void;
  setWalletInfo: (
    address: string,
    isClient?: boolean,
    isFreelancer?: boolean,
    walletName?: string,
    token?: string | null,
    network?: string | null
  ) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      walletName: null,
      network: null,
      targetNetwork: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET',
      activeRole: 'client',
      isClient: true,
      isFreelancer: true,
      token: null,
      setActiveRole: (activeRole) => set({ activeRole }),
      setNetwork: (network) => set({ network }),
      setWalletInfo: (
        address,
        isClient = true,
        isFreelancer = true,
        walletName = 'Freighter',
        token = null,
        network = null
      ) =>
        set({ address, isClient, isFreelancer, walletName, token, network }),
      disconnect: () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
        } catch {
          // ignore network error on logout
        }
        set({
          address: null,
          walletName: null,
          network: null,
          activeRole: 'client',
          isClient: true,
          isFreelancer: true,
          token: null,
        });
      },
    }),
    {
      name: 'trustpay-wallet-storage',
    }
  )
);
