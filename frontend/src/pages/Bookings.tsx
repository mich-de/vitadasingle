import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../hooks/useBookings';
import { Plus, Search, Calendar, User, Home, Trash2, Edit, MoreVertical, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Booking } from '../types/entities/booking';
import BookingFormModal from '../components/modals/BookingFormModal';

const Bookings = () => {
  const { t } = useLanguage();
  const { bookings, loading, error, createBooking, updateBooking, deleteBooking, fetchBookings } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddBooking = () => {
    setSelectedBooking(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = (booking: Booking) => {
    if (isEditing && selectedBooking) {
      updateBooking({ ...booking, id: selectedBooking.id });
    } else {
      createBooking(booking);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('bookings.confirmDelete'))) {
      deleteBooking(id);
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`bookings.status.${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'confirmed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('bookings.loading')}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span>{t(error)}</span>
        </div>
        <button 
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('bookings.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('bookings.dataLoadedFrom') }}
          ></p>
        </div>
        <button 
          onClick={handleAddBooking}
          className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          {t('bookings.addBooking')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('bookings.totalBookings')}
          </h3>
          <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {filteredBookings.length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('bookings.pending')}
          </h3>
          <p className="text-2xl font-bold text-yellow-500">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('bookings.confirmed')}
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={16} />
          <input
            type="text"
            placeholder={t('bookings.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark"
        >
          <option value="all">{t('bookings.allStatuses')}</option>
          <option value="pending">{t('bookings.status.pending')}</option>
          <option value="confirmed">{t('bookings.status.confirmed')}</option>
          <option value="completed">{t('bookings.status.completed')}</option>
          <option value="cancelled">{t('bookings.status.cancelled')}</option>
        </select>
      </div>

      {/* Lista prenotazioni */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {t('bookings.title')} ({filteredBookings.length})
          </h2>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('bookings.noBookings', 'Nessuna prenotazione trovata')}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {searchTerm || statusFilter !== 'all' ? 'Prova a modificare i filtri di ricerca.' : 'Aggiungi la tua prima prenotazione.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button 
                onClick={handleAddBooking}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90"
              >
                <Plus size={16} />
                Aggiungi prenotazione
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border-light/30 dark:divide-border-dark/30">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                      <User size={16} className="text-primary-light dark:text-primary-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                          {booking.guestName} - {booking.propertyName}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{booking.checkIn} → {booking.checkOut}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Home size={14} />
                          <span>{t(`properties.type.${(booking.propertyType || '').toLowerCase()}`)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditBooking(booking)}
                      className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors"
                    >
                      <Edit size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 pl-13 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="flex items-center gap-2">
                    
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Totale:</span>
                    <span>{booking.totalAmount} €</span>
                  </div>
                </div>
                
                {booking.notes && (
                  <p className="mt-2 pl-13 text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                    {booking.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        booking={selectedBooking}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Bookings;
