import { useCallback } from 'react';

interface UrlState {
  tab?: string;
  search?: string;
  type?: string;
  country?: string;
  sort?: string;
  page?: number;
  company?: number;
  collection?: string;
}

export function useUrlState() {
  const getStateFromUrl = useCallback((): UrlState => {
    const params = new URLSearchParams(window.location.search);
    const state: UrlState = {};

    const tab = params.get('tab');
    if (tab) state.tab = tab;

    const search = params.get('search');
    if (search) state.search = search;

    const type = params.get('type');
    if (type) state.type = type;

    const country = params.get('country');
    if (country) state.country = country;

    const sort = params.get('sort');
    if (sort) state.sort = sort;

    const page = params.get('page');
    if (page) state.page = parseInt(page, 10);

    const company = params.get('company');
    if (company) state.company = parseInt(company, 10);

    const collection = params.get('collection');
    if (collection) state.collection = collection;

    return state;
  }, []);

  const setUrlState = useCallback((state: UrlState) => {
    const params = new URLSearchParams();

    if (state.tab && state.tab !== 'landscape') params.set('tab', state.tab);
    if (state.search) params.set('search', state.search);
    if (state.type && state.type !== 'All') params.set('type', state.type);
    if (state.country && state.country !== 'All') params.set('country', state.country);
    if (state.sort && state.sort !== 'name') params.set('sort', state.sort);
    if (state.page && state.page > 1) params.set('page', state.page.toString());
    if (state.company) params.set('company', state.company.toString());
    if (state.collection) params.set('collection', state.collection);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, []);

  const getShareableUrl = useCallback((state: UrlState): string => {
    const params = new URLSearchParams();

    if (state.tab && state.tab !== 'landscape') params.set('tab', state.tab);
    if (state.search) params.set('search', state.search);
    if (state.type && state.type !== 'All') params.set('type', state.type);
    if (state.country && state.country !== 'All') params.set('country', state.country);
    if (state.sort && state.sort !== 'name') params.set('sort', state.sort);
    if (state.company) params.set('company', state.company.toString());

    const queryString = params.toString();
    return queryString
      ? `${window.location.origin}${window.location.pathname}?${queryString}`
      : `${window.location.origin}${window.location.pathname}`;
  }, []);

  const copyShareableUrl = useCallback(async (state: UrlState): Promise<boolean> => {
    const url = getShareableUrl(state);
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }, [getShareableUrl]);

  return {
    getStateFromUrl,
    setUrlState,
    getShareableUrl,
    copyShareableUrl,
  };
}

export default useUrlState;
