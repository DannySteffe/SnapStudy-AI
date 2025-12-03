import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bell, Shield, Download, Trash2, Moon, Sun, Save, AlertTriangle, LogOut, Settings as SettingsIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/Navbar';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Mock User Data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    notifications: {
      email: true,
      progress: true,
      streak: true,
      quiz: false
    }
  });

  const handleSave = () => {
    setIsDirty(false);
    toast.success("Settings saved successfully!");
  };

  const handleExport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Preparing your data export...',
      success: 'Data exported successfully!',
      error: 'Failed to export data'
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      setShowDeleteModal(false);
      toast.error("Account deleted (Simulation)");
      // In real app: logout and redirect
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Section */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Account Information</h2>
                      
                      <div className="space-y-6 max-w-lg">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            value={user.name}
                            onChange={(e) => {
                              setUser({...user, name: e.target.value});
                              setIsDirty(true);
                            }}
                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                          <div className="relative">
                            <input 
                              type="email" 
                              value={user.email}
                              disabled
                              className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">Read-only</span>
                          </div>
                        </div>

                        {isDirty && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <Button onClick={handleSave}>
                              <Save size={18} className="mr-2" />
                              Save Changes
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Section */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    {/* Theme */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Appearance</h2>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Theme Mode</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Select your preferred interface theme</div>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                          <button
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={cn(
                              "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
                              theme === 'light' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                          >
                            <Sun size={18} /> Light
                          </button>
                          <button
                            onClick={() => theme === 'light' && toggleTheme()}
                            className={cn(
                              "p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
                              theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                            )}
                          >
                            <Moon size={18} /> Dark
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notifications</h2>
                      <div className="space-y-6">
                        {[
                          { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your account' },
                          { key: 'progress', label: 'Progress Reminders', desc: 'Get reminded to finish started modules' },
                          { key: 'streak', label: 'Streak Alerts', desc: 'Don\'t lose your learning streak!' },
                          { key: 'quiz', label: 'Quiz Summaries', desc: 'Weekly summary of your quiz performance' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{item.label}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</div>
                            </div>
                            <button
                              onClick={() => {
                                setUser({
                                  ...user,
                                  notifications: { ...user.notifications, [item.key]: !user.notifications[item.key] }
                                });
                                toast.success("Preferences updated");
                              }}
                              className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                user.notifications[item.key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                              )}
                            >
                              <div className={cn(
                                "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                user.notifications[item.key] ? "translate-x-6" : "translate-x-0"
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Section */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Data Management</h2>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Download size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">Export Your Data</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Download a copy of your learning history</div>
                          </div>
                        </div>
                        <Button variant="secondary" onClick={handleExport}>
                          Export CSV
                        </Button>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                        <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                          <AlertTriangle size={20} /> Danger Zone
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        maxWidth="max-w-md"
      >
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Trash2 size={24} />
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </p>
        
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Type <span className="text-slate-900 dark:text-white">DELETE</span> to confirm
          </label>
          <input 
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="DELETE"
          />
        </div>

        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setShowDeleteModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'DELETE'}
            className="flex-1"
          >
            Delete Data
          </Button>
        </div>
      </Modal>
    </div>
  );
}
