import { useQuery } from '@tanstack/react-query';
import { getMarketData, getGlobalData } from '../services/api';

export const useMarketData = () => {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: getMarketData,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
};

export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: getGlobalData,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 120000,
  });
};
