import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export const useCampaigns = (endpoint = '/campaigns/feed') => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCampaigns = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      const response = await apiClient.get(`${endpoint}?page=${pageNum}&limit=5`);
      
      const fetchedCampaigns = response.data.data.campaigns || [];
      
      if (append) {
        setCampaigns(prev => [...prev, ...fetchedCampaigns]);
      } else {
        setCampaigns(fetchedCampaigns);
      }
      
      setHasMore(fetchedCampaigns.length === 5);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [endpoint]);

  useEffect(() => {
    setPage(1);
    fetchCampaigns(1, false);
  }, [fetchCampaigns]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCampaigns(nextPage, true);
    }
  };

  return { campaigns, loading, error, hasMore, loadMore, loadingMore };
};
