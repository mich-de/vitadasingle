import { useLanguage } from '../context/LanguageContext';
import { ProfileForm } from '../components/forms/ProfileForm';
import { User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/dashboard"
              className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              <ArrowLeft size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl">
                <User className="text-primary-light dark:text-primary-dark" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {t('profile.title') || 'Il Mio Profilo'}
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {t('profile.subtitle') || 'Gestisci le tue informazioni personali'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft border border-border-light/30 dark:border-border-dark/30 p-6">
            <ProfileForm />
          </div>
        </div>

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              {t('profile.infoBox.title')}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('profile.infoBox.message')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;