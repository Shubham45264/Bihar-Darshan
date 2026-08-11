import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import type { PopularPlaceItem } from '../../data/popularPlacesDefaults';
import { CheckCircle2, Loader2 } from 'lucide-react';

const emptyForm: Partial<PopularPlaceItem> = {
  id: '',
  name: '',
  district: '',
  image: '',
  description: '',
};

const AdminPopularPlaces = () => {
  const { popularPlaces, updatePopularPlaces } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PopularPlaceItem | null>(null);
  const [formData, setFormData] = useState<Partial<PopularPlaceItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<PopularPlaceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredData = popularPlaces.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PopularPlaceItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: PopularPlaceItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        setIsSaving(true);
        const targetId = itemToDelete.id || itemToDelete.name;
        const updatedList = popularPlaces.filter(g => g.id !== targetId && g.name !== itemToDelete.name);
        await updatePopularPlaces(updatedList);
        showToast(`'${itemToDelete.name}' removed successfully!`);
        setIsDeleteOpen(false);
      } catch (err) {
        console.error('Error deleting place:', err);
        showToast('Failed to delete place. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingItem) {
        const targetId = editingItem.id || editingItem.name;
        const updatedItem: PopularPlaceItem = {
          id: editingItem.id || `${(formData.name || 'place').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          name: formData.name || '',
          district: formData.district || '',
          image: formData.image || '',
          description: formData.description || '',
        };
        const updatedList = popularPlaces.map(g => (g.id === targetId || g.name === editingItem.name) ? updatedItem : g);
        await updatePopularPlaces(updatedList);
        showToast(`'${updatedItem.name}' updated successfully!`);
      } else {
        const newSlug = (formData.name || 'place').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newItem: PopularPlaceItem = {
          id: `${newSlug}-${Date.now()}`,
          name: formData.name || '',
          district: formData.district || '',
          image: formData.image || '',
          description: formData.description || '',
        };
        await updatePopularPlaces([...popularPlaces, newItem]);
        showToast(`'${newItem.name}' added successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving place:', err);
      showToast('Failed to save place. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#EAB308] text-black px-5 py-3 rounded-xl font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminTable
        title="Popular Places Showcase"
        description="Choose which destination cards are showcased on the homepage under 'Popular Places You Must Visit'."
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
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )
          },
          { header: 'Place Name', accessor: 'name', className: 'font-semibold text-white' },
          { header: 'District', accessor: 'district' },
          {
            header: 'Description',
            accessor: (item) => (
              <span className="line-clamp-1 max-w-md text-white/50">{item.description}</span>
            )
          },
        ]}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Featured Place' : 'Add Featured Place'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Name"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <AdminInput
              label="District Name"
              placeholder="e.g. Gaya District"
              value={formData.district || ''}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
              required
            />
          </div>

          <AdminImageUpload
            label="Showcase Image"
            value={formData.image || ''}
            onChange={val => setFormData({ ...formData, image: val })}
            required
          />

          <AdminTextarea
            label="Short Description"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#EAB308] transition-colors flex items-center gap-2 disabled:opacity-50">
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {editingItem ? 'Save Changes' : 'Add Place'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminDeleteConfirm
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  );
};

export default AdminPopularPlaces;
