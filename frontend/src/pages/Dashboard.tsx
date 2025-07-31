import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { HeroSection } from '../components/dashboard/HeroSection';
import { AlertTriangle, PiggyBank, Building, Car, CheckCircle, FileText, Home, Users, BarChart3 } from 'lucide-react';
import { apiService } from '../services/apiService';
import type { DashboardStats, Deadline, Expense, Event } from '../types';

const Dashboard = () => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summaryData, deadlinesData, expensesData, eventsData] = await Promise.all([
        apiService.getDashboardSummary(),
        apiService.getScadenze(), 
        apiService.getSpese(),
        apiService.getEventi(),
      ]);

      setDashboardData(summaryData);
      setUpcomingDeadlines(deadlinesData.filter(d => !d.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5));
      setRecentExpenses(expensesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
      setUpcomingEvents(eventsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5));
      
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
      setError('Impossibile caricare i dati della dashboard dal database JSON');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-150px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          Caricamento dashboard dal database JSON...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">Errore: </strong>
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header con indicazione fonte dati */}
      <HeroSection lastUpdated={dashboardData?.lastActivity} />

      {/* Stats Cards Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard 
            title={t('dashboard.urgentDeadlines')}
            value={dashboardData?.urgentDeadlinesCount?.toString() || '0'}
            icon={AlertTriangle}
            iconColor="text-red-500 dark:text-red-400"
            description={t('dashboard.next30days')}
          />
          <DashboardCard 
            title={t('dashboard.currentMonthExpenses')}
            value={formatCurrency(dashboardData?.currentMonthExpenses || 0)}
            icon={PiggyBank}
            iconColor="text-green-500 dark:text-green-400"
            description={t('dashboard.totalForMonth')}
          />
          <DashboardCard 
            title={t('dashboard.myProperties')}
            value={dashboardData?.propertyCount?.toString() || '0'}
            icon={Building}
            iconColor="text-purple-500 dark:text-purple-400"
            description={`${t('dashboard.value')}: ${formatCurrency(dashboardData?.totalPropertyValue || 0)}`}
          />
          <DashboardCard 
            title={t('dashboard.myVehicles')}
            value={dashboardData?.vehicleCount?.toString() || '0'}
            icon={Car}
            iconColor="text-yellow-500 dark:text-yellow-400"
            description={`${t('dashboard.value')}: ${formatCurrency(dashboardData?.totalVehicleValue || 0)}`}
          />
        </div>
      </section>

      {/* Detailed Lists Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Upcoming Deadlines List Card */}
        <div className="bg-card-light dark:bg-card-dark p-5 sm:p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              🗓️ {t('dashboard.upcomingDeadlinesList')}
            </h2>
            <a href="/deadlines" className="text-sm text-primary-light dark:text-primary-dark hover:underline">
              {t('dashboard.viewAll')}
            </a>
          </div>
          {upcomingDeadlines.length > 0 ? (
            <ul className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysRemaining = getDaysRemaining(deadline.dueDate);
                let urgencyColor = 'text-green-500 dark:text-green-400';
                if (daysRemaining <= 7 && daysRemaining > 3) urgencyColor = 'text-yellow-500 dark:text-yellow-400';
                if (daysRemaining <= 3) urgencyColor = 'text-red-500 dark:text-red-400';
                if (daysRemaining < 0) urgencyColor = 'text-red-600 dark:text-red-500 font-semibold';

                return (
                  <li key={deadline.id} className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {formatDate(deadline.dueDate)} - {deadline.category}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${urgencyColor} ml-2`}>
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)}g fa` : `${daysRemaining}g`}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {t('dashboard.noUrgentDeadlines')}
              </p>
            </div>
          )}
        </div>

        {/* Recent Expenses List Card */}
        <div className="bg-card-light dark:bg-card-dark p-5 sm:p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              💰 {t('dashboard.recentExpenses')}
            </h2>
            <a href="/expenses" className="text-sm text-primary-light dark:text-primary-dark hover:underline">
              {t('dashboard.viewAll')}
            </a>
          </div>
          {recentExpenses.length > 0 ? (
            <ul className="space-y-3">
              {recentExpenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                      {expense.description}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {formatDate(expense.date)} - {t(`expenses.category.${expense.category.toLowerCase().replace(/\s&\s/g, '').replace(/\s/g, '')}`)}
                    </p>
                  </div>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark ml-2">
                    {formatCurrency(expense.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {t('dashboard.noExpenses')}
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events List Card */}
        <div className="bg-card-light dark:bg-card-dark p-5 sm:p-6 rounded-xl shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              🎉 {t('dashboard.upcomingEvents')}
            </h2>
            <a href="/events" className="text-sm text-primary-light dark:text-primary-dark hover:underline">
              {t('dashboard.viewAll')}
            </a>
          </div>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-3">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-center p-3 bg-background-light dark:bg-background-dark rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg flex flex-col items-center justify-center mr-4">
                    <span className="text-sm font-bold text-primary-light dark:text-primary-dark">{new Date(event.date).getDate()}</span>
                    <span className="text-xs text-primary-light/80 dark:text-primary-dark/80">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {event.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                {t('dashboard.noEvents')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Summary Stats */}
      <section>
        <div className="bg-gradient-to-r from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/10 dark:to-secondary-dark/10 p-5 sm:p-6 rounded-xl shadow-soft">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            📊 Riepilogo generale
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <FileText className="mx-auto text-blue-500 mb-2" size={24} />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Documenti</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">In archivio</p>
            </div>
            <div>
              <Home className="mx-auto text-purple-500 mb-2" size={24} />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Proprietà</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                {dashboardData?.propertyCount || 0}
              </p>
            </div>
            <div>
              <Users className="mx-auto text-green-500 mb-2" size={24} />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Contatti</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">Disponibili</p>
            </div>
            <div>
              <BarChart3 className="mx-auto text-orange-500 mb-2" size={24} />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Totale patrimonio</p>
              <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                {formatCurrency(dashboardData?.totalPropertyValue || 0)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;