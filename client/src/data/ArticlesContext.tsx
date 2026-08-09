import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { TribalArticle } from './tribalArticlesData';
import { auth } from '../lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ArticlesContextValue {
  articles: TribalArticle[];
  addArticle: (article: TribalArticle) => void;
  deleteArticle: (id: string) => void;
  updateArticleStatus: (id: string, status: string) => Promise<void>;
  refreshArticles: () => Promise<void>;
}

const ArticlesContext = createContext<ArticlesContextValue>({
  articles: [],
  addArticle: () => {},
  deleteArticle: () => {},
  updateArticleStatus: async () => {},
  refreshArticles: async () => {},
});

export const ArticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<TribalArticle[]>([]);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tribes/articles`);
      const result = await res.json();
      if (result.success && result.data?.articles) {
        setArticles(result.data.articles);
      }
    } catch (e) {
      console.error('Failed to fetch articles:', e);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const addArticle = useCallback(async (article: TribalArticle) => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_BASE_URL}/tribes/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify(article)
      });
      await fetchArticles();
    } catch (e) {
      console.error('Failed to submit article:', e);
    }
  }, [fetchArticles]);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      const headers: any = {};
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_BASE_URL}/tribes/articles/${id}`, {
        method: 'DELETE',
        headers
      });
      await fetchArticles();
    } catch (e) {
      console.error('Failed to delete article:', e);
    }
  }, [fetchArticles]);

  const updateArticleStatus = useCallback(async (id: string, status: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const action = status === 'APPROVED' ? 'approve' : 'reject';
      await fetch(`${API_BASE_URL}/tribes/articles/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchArticles();
    } catch (e) {
      console.error('Failed to update article status:', e);
    }
  }, [fetchArticles]);

  const refreshArticles = fetchArticles;

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, deleteArticle, updateArticleStatus, refreshArticles }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => useContext(ArticlesContext);
