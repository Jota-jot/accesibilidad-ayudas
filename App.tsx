import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { AidDetailPage } from '@/pages/AidDetailPage';
import { AuthPage } from '@/pages/AuthPage';
import { SavedAidsPage } from '@/pages/SavedAidsPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import type { SearchCriteria } from '@/types';

interface PageState {
  page: string;
  params?: Record<string, unknown>;
}

function AppContent() {
  const { loading } = useAuth();
  const [pageState, setPageState] = useState<PageState>({ page: 'home' });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);

  // Hash-based routing for deep links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const [page, ...rest] = hash.split('/');
        if (page === 'ayuda' && rest[0]) {
          setPageState({ page: 'aid-detail', params: { slug: rest[0] } });
        } else if (page === 'buscar') {
          setPageState({ page: 'search' });
        } else if (page === 'admin') {
          setPageState({ page: 'admin' });
        } else if (page === 'guardadas') {
          setPageState({ page: 'saved' });
        } else if (page === 'alertas') {
          setPageState({ page: 'alerts' });
        } else if (page === 'perfil') {
          setPageState({ page: 'profile' });
        } else if (page === 'login') {
          setPageState({ page: 'login' });
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (page: string, params?: Record<string, unknown>) => {
    // Update hash for deep-linkable pages
    const hashMap: Record<string, string> = {
      'aid-detail': params?.slug ? `ayuda/${params.slug}` : '',
      search: 'buscar',
      admin: 'admin',
      saved: 'guardadas',
      alerts: 'alertas',
      profile: 'perfil',
      login: 'login',
    };
    if (hashMap[page]) {
      window.location.hash = hashMap[page];
    } else if (page === 'home') {
      window.location.hash = '';
    }
    setPageState({ page, params });
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    navigate('search');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 animate-fade-in">Cargando...</p>
        </div>
      </div>
    );
  }

  const { page, params } = pageState;
  const pageKey = page + (typeof params?.slug === 'string' ? params.slug : '');

  return (
    <Layout currentPage={page} onNavigate={navigate}>
      <div key={pageKey} className="animate-fade-in">
        {page === 'home' && <HomePage onSearch={handleSearch} onNavigate={navigate} />}
        {page === 'search' && (
          <SearchPage initialCriteria={searchCriteria} onNavigate={navigate} />
        )}
        {page === 'aid-detail' && typeof params?.slug === 'string' && (
          <AidDetailPage slug={params.slug} onNavigate={navigate} />
        )}
        {page === 'login' && <AuthPage onNavigate={navigate} />}
        {page === 'saved' && <SavedAidsPage onNavigate={navigate} />}
        {page === 'alerts' && <AlertsPage onNavigate={navigate} />}
        {page === 'profile' && <ProfilePage onNavigate={navigate} />}
        {page === 'admin' && <AdminPage onNavigate={navigate} />}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
