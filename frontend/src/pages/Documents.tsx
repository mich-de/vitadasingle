import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDocuments } from '../hooks/useDocuments';
import {
  FileText,
  Upload,
  Search,
  Download,
  Share,
  Edit3,
  FolderOpen,
  HardDrive,
  MoreVertical,
  Filter,
  Trash2,
} from 'lucide-react';
import { FaRegFilePdf, FaRegFileWord, FaRegFileExcel } from 'react-icons/fa6';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import DocumentUploadModal from '../components/modals/DocumentUploadModal';

interface Document {
  id: string;
  name: string;
  size: number; // in bytes
  category: 'personal' | 'financial' | 'legal' | 'medical' | 'contracts' | 'taxes' | 'insurance' | 'other';
  dateModified: string;
  dateCreated: string;
  tags?: string[];
  shared?: boolean;
  file?: string;
  type?: string;
}

const Documents = () => {
  const { t } = useLanguage();
  const { documents, loading, error, fetchDocuments, deleteDocument } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    await deleteDocument(documentToDelete);
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return `0 ${t('documents.fileSize.bytes')}`;
    const k = 1024;
    const sizes = [t('documents.fileSize.bytes'), t('documents.fileSize.kb'), t('documents.fileSize.mb'), t('documents.fileSize.gb')];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dates.locale'), {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return (
        <div style={{ width: '20px', height: '20px' }}>
          <FaRegFilePdf size={20} className="text-red-500" />
        </div>
      );
    } else if (extension === 'docx' || extension === 'doc') {
      return (
        <div style={{ width: '20px', height: '20px' }}>
          <FaRegFileWord size={20} className="text-blue-500" />
        </div>
      );
    } else if (extension === 'xlsx' || extension === 'xls') {
      return (
        <div style={{ width: '20px', height: '20px' }}>
          <FaRegFileExcel size={20} className="text-green-500" />
        </div>
      );
    }
    return (
      <div style={{ width: '20px', height: '20px' }}>
        <FileIcon extension={extension} {...defaultStyles[extension as keyof typeof defaultStyles]} />
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'financial': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'legal': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'medical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'contracts': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'taxes': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'insurance': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30';
      case 'other': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`);
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
      }
    });

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const storageLimit = 5 * 1024 * 1024 * 1024; // 5GB limit
  const usagePercentage = (totalSize / storageLimit) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('documents.loading')}
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
          onClick={fetchDocuments}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {t('documents.title')}
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
              dangerouslySetInnerHTML={{ __html: t('documents.dataSource') }}
            ></p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
            <Upload size={16} />
            {t('documents.addNew')}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('documents.summary.totalDocuments')}
            </h3>
            <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
              {documents.length}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('documents.summary.totalSize')}
            </h3>
            <p className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">
              {formatFileSize(totalSize)}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('documents.summary.personal')}
            </h3>
            <p className="text-2xl font-bold text-accent-light dark:text-accent-dark">
              {documents.filter(doc => doc.category === 'personal').length}
            </p>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('documents.storageUsage')}</h3>
            <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              {formatFileSize(totalSize)} / {formatFileSize(storageLimit)}
            </span>
          </div>
          <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-2.5">
            <div 
              className="bg-primary-light dark:bg-primary-dark h-2.5 rounded-full"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="text"
              placeholder={t('documents.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark outline-none transition-shadow"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark outline-none transition-shadow"
            >
              <option value="all">{t('documents.filterByCategory')}</option>
              {Object.keys(t('categories', { returnObjects: true })).map(cat => (
                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark outline-none transition-shadow"
            >
              <option value="date">{t('documents.sortBy')}: {t('documents.sort.date')}</option>
              <option value="name">{t('documents.sortBy')}: {t('documents.sort.name')}</option>
              <option value="size">{t('documents.sortBy')}: {t('documents.sort.size')}</option>
            </select>
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('documents.table.name')}</th>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('documents.table.type')}</th>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('documents.table.category')}</th>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('documents.table.dateModified')}</th>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('documents.table.size')}</th>
                  <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark text-right">{t('documents.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(document.name)}
                        <span className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                          {document.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {document.type ? document.type.toUpperCase() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(document.category)}`}>
                        {getCategoryLabel(document.category)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {formatDate(document.dateModified)}
                    </td>
                    <td className="p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors" title={t('documents.actions.download')}>
                          <Download size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                        </button>
                        <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors" title={t('documents.actions.share')}>
                          <Share size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                        </button>
                        <button className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors" title={t('documents.actions.edit')}>
                          <Edit3 size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(document.id)}
                          className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded transition-colors" 
                          title={t('documents.actions.delete')}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
            <FolderOpen size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('documents.noDocuments')}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {t('documents.noDocumentsMessage')}
            </p>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('documents.uploadFirst')}
            </button>
          </div>
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('documents.deleteTitle')}
        message={t('documents.deleteMessage')}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchDocuments}
      />
    </>
  );
};

export default Documents;
