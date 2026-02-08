import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import DashboardHeader from '../components/DashboardHeader';
import ModuleCard from '../components/ModuleCard';
import ModuleSkeleton from '../components/ModuleSkeleton';
import CreateModuleModal from '../components/CreateModuleModal';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

import { getModules, createModule } from '../lib/api';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await getModules();
      setModules(data);
    } catch (error) {
      toast.error('Failed to fetch modules');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleCreateModule = async (newModuleData) => {
    try {
      let payload;
      
      if (newModuleData.file) {
        payload = new FormData();
        payload.append('title', newModuleData.title);
        payload.append('description', newModuleData.description);
        payload.append('file', newModuleData.file);
        // We don't send originalContent text if we have a file, or we could send it as description
      } else {
        payload = {
          title: newModuleData.title,
          description: newModuleData.description,
          originalContent: newModuleData.originalContent || newModuleData.description
        };
      }
      
      const createdModule = await createModule(payload);
      setModules([createdModule, ...modules]);
      toast.success('Module created successfully');
    } catch (error) {
      toast.error('Failed to create module');
      console.error(error);
    }
  };

  const handleDeleteModule = async (id) => {
    try {
      await deleteModule(id);
      setModules(modules.filter(m => m._id !== id));
      toast.success('Module deleted successfully');
    } catch (error) {
      toast.error('Failed to delete module');
      console.error(error);
    }
  };

  const handleRegenerateModule = (id) => {
    setModules(modules.map(m => 
      m._id === id ? { ...m, status: 'processing' } : m
    ));
    toast.info('Regenerating module assets...');
    
    // Simulate regeneration
    setTimeout(() => {
      setModules(prev => prev.map(m => 
        m._id === id ? { ...m, status: 'completed' } : m
      ));
      toast.success('Module regeneration complete');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Toaster position="bottom-right" theme={theme} />
      <DashboardHeader 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onCreateClick={() => setIsModalOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Modules</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage and track your learning content.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              <Filter size={20} />
            </button>
            
            <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <ModuleSkeleton key={i} />
            ))}
          </div>
        ) : modules.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {modules.map(module => (
              <ModuleCard 
                key={module._id || module.id} 
                module={module} 
                onDelete={handleDeleteModule}
                onRegenerate={handleRegenerateModule}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Plus}
            title="No modules yet"
            description="Create your first learning module to get started with your personalized learning journey."
            action={
              <Button onClick={() => setIsModalOpen(true)}>
                Create Module
              </Button>
            }
          />
        )}
      </main>

      <CreateModuleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onGenerate={handleCreateModule}
      />
    </div>
  );
}
