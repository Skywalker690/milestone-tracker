import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Milestones from './components/Milestones';
import { Milestone, ViewState, CreateMilestoneRequest, UpdateMilestoneRequest } from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

const ProtectedApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch milestones
  const fetchMilestones = async () => {
    try {
      setDataLoading(true);
      const data = await api.request<Milestone[]>('/milestones');
      setMilestones(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMilestones();
    }
  }, [isAuthenticated]);

  const handleCreate = async (data: CreateMilestoneRequest) => {
    await api.request('/milestones', { method: 'POST', body: data });
    await fetchMilestones();
  };

  const handleUpdate = async (id: number, data: UpdateMilestoneRequest) => {
    await api.request(`/milestones/${id}`, { method: 'PUT', body: data });
    await fetchMilestones();
  };

  const handleDelete = async (id: number) => {
    await api.request(`/milestones/${id}`, { method: 'DELETE' });
    await fetchMilestones();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {currentView === ViewState.DASHBOARD ? (
        <Dashboard milestones={milestones} />
      ) : (
        <Milestones 
          milestones={milestones}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isLoading={dataLoading}
        />
      )}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
};

export default App;