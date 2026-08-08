import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminSelect, AdminImagePreview, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import type { GalleryItem } from '../../data/galleryData';

const emptyForm: Partial<GalleryItem> = {
  id: 0,
  title: '',
  category: 'Heritage',
  image: '',
  location: '',
  photographer: '',
  mediaType: 'photo',
  aspectRatio: 'landscape',
  likes: 0,
  views: 0,
  comments: 0,
};

const AdminGallery = () => {
  const { gallery, updateGallery } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const filteredData = gallery.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: GalleryItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      updateGallery(gallery.filter(g => g.id !== itemToDelete.id));
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateGallery(gallery.map(g => g.id === editingItem.id ? { ...g, ...formData as GalleryItem } : g));
    } else {
      updateGallery([{ ...formData as GalleryItem, id: Date.now() }, ...gallery]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AdminTable
        title="Media Gallery"
        description="Manage images shown in the global gallery section."
        data={filteredData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        columns={[
          {
            header: 'Preview',
            accessor: (item) => (
              <div className="w-20 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )
          },
          { header: 'Title', accessor: 'title', className: 'font-semibold text-white' },
          { header: 'Category', accessor: 'category' },
          { header: 'Location', accessor: 'location' },
        ]}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Media' : 'Add Media'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Title"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <AdminSelect
              label="Category"
              value={formData.category || 'Heritage'}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="Heritage">Heritage</option>
              <option value="Nature">Nature</option>
              <option value="Culture">Culture</option>
              <option value="Spiritual">Spiritual</option>
              <option value="Wildlife">Wildlife</option>
            </AdminSelect>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Location"
              value={formData.location || ''}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <AdminInput
              label="Photographer (Optional)"
              value={formData.photographer || ''}
              onChange={e => setFormData({ ...formData, photographer: e.target.value })}
            />
          </div>

          <AdminImageUpload
            label="Image"
            value={formData.image || ''}
            onChange={val => setFormData({ ...formData, image: val })}
            required
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#EAB308] transition-colors">
              {editingItem ? 'Save Changes' : 'Add Media'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminDeleteConfirm
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || ''}
      />
    </div>
  );
};

export default AdminGallery;
