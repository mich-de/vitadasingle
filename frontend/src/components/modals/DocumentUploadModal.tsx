import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';
import { FaRegFilePdf, FaRegFileWord, FaRegFileExcel, FaRegFileImage, FaRegFile } from 'react-icons/fa6';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/apiService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    type: 'pdf',
    category: 'personal',
    tags: '',
    file: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FaRegFilePdf className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FaRegFileWord className="text-blue-500" size={24} />;
      case 'xlsx':
        return <FaRegFileExcel className="text-green-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaRegFileImage className="text-purple-500" size={24} />;
      case 'txt':
        return <FaRegFile className="text-gray-500" size={24} />;
      default:
        return <FaRegFile className="text-gray-500" size={24} />;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file
      }));
      setFileName(file.name);

      // Auto-detect file type
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const typeMap: Record<string, string> = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'xls': 'xlsx',
        'xlsx': 'xlsx',
        'jpg': 'jpg',
        'jpeg': 'jpg',
        'png': 'png',
        'txt': 'txt'
      };

      if (typeMap[extension]) {
        setFormData(prev => ({
          ...prev,
          type: typeMap[extension]
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t('documents.errors.nameRequired');
    }
    if (!formData.file) {
      newErrors.file = t('documents.errors.fileRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      // In a real app, we would upload the file to a server
      // For this demo, we'll just simulate an upload by creating a document entry
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const newDocument = {
        name: formData.file ? `${formData.name || formData.file.name.split('.').slice(0, -1).join('.')}.${formData.file.name.split('.').pop()}` : formData.name,
        type: formData.type,
        category: formData.category,
        size: formData.file ? formData.file.size : 0,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        tags: tagsArray,
        shared: false
      };

      await apiService.createDocumento(newDocument);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      setErrors({ submit: 'Failed to upload document. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('documents.uploadDocument')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? t('documents.uploading') : t('documents.upload')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('documents.name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.name ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('documents.type')}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="pdf">PDF</option>
              <option value="doc">Word Document</option>
              <option value="xlsx">Excel Spreadsheet</option>
              <option value="jpg">Image (JPG)</option>
              <option value="png">Image (PNG)</option>
              <option value="txt">Text File</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('documents.category')}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="personal">Personal</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="medical">Medical</option>
              <option value="contracts">Contracts</option>
              <option value="taxes">Taxes</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('documents.tags')} ({t('documents.commaSeparated')})
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('documents.file')} *
          </label>
          <div className={`border-2 border-dashed ${errors.file ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg p-6 text-center`}>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {!fileName ? (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center">
                  <MdOutlineDriveFolderUpload className="text-text-secondary-light dark:text-text-secondary-dark" size={24} />
                </div>
                <p className="text-text-primary-light dark:text-text-primary-dark font-medium">
                  {t('documents.dragAndDrop')}
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                  {t('documents.orClickToUpload')}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                  className="mt-2"
                >
                  {t('documents.browseFiles')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {getFileIcon(formData.type)}
                <span className="text-text-primary-light dark:text-text-primary-dark">{fileName}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, file: null }));
                    setFileName('');
                  }}
                  className="ml-2"
                >
                  {t('common.change')}
                </Button>
              </div>
            )}
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default DocumentUploadModal;