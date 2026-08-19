import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import type { PopularPlaceItem } from '../../data/popularPlacesDefaults';
import { CheckCircle2, Loader2, Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const emptyForm: Partial<PopularPlaceItem> = {
  id: '',
  name: '',
  district: '',
  districtSlug: '',
  image: '',
  images: [],
  description: '',
  overview: '',
  highlights: [],
  bestTimeToVisit: 'October to March',
  category: 'Popular Attraction',
};

const AdminPopularPlaces = () => {
  const { popularPlaces, updatePopularPlaces } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PopularPlaceItem | null>(null);
  const [formData, setFormData] = useState<Partial<PopularPlaceItem>>(emptyForm);
  const [highlightsInput, setHighlightsInput] = useState('');
  const [galleryInputs, setGalleryInputs] = useState<string[]>([]);
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
    setHighlightsInput('');
    setGalleryInputs([]);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PopularPlaceItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setHighlightsInput((item.highlights || []).join('\n'));
    setGalleryInputs(item.images || [item.image]);
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

  const addGalleryImageInput = () => {
    setGalleryInputs([...galleryInputs, '']);
  };

  const updateGalleryImageInput = (index: number, val: string) => {
    const updated = [...galleryInputs];
    updated[index] = val;
    setGalleryInputs(updated);
  };

  const removeGalleryImageInput = (index: number) => {
    setGalleryInputs(galleryInputs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const parsedHighlights = highlightsInput
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const cleanGallery = galleryInputs
        .map(url => url.trim())
        .filter(Boolean);

      const mainImg = formData.image || cleanGallery[0] || '';
      const finalGallery = Array.from(new Set([mainImg, ...cleanGallery])).filter(Boolean);
      const targetSlug = (formData.districtSlug || (formData.district || '').replace(/district/i, '').trim()).toLowerCase();

      if (editingItem) {
        const targetId = editingItem.id || editingItem.name;
        const updatedItem: PopularPlaceItem = {
          id: editingItem.id || `${(formData.name || 'place').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: formData.name || '',
          district: formData.district || '',
          districtSlug: targetSlug,
          image: mainImg,
          images: finalGallery,
          description: formData.description || '',
          overview: formData.overview || formData.description || '',
          highlights: parsedHighlights,
          bestTimeToVisit: formData.bestTimeToVisit || 'October to March',
          category: formData.category || 'Popular Attraction',
          rating: formData.rating || 4.8
        };
        const updatedList = popularPlaces.map(g => (g.id === targetId || g.name === editingItem.name) ? updatedItem : g);
        await updatePopularPlaces(updatedList);
        showToast(`'${updatedItem.name}' updated successfully!`);
      } else {
        const newSlug = (formData.name || 'place').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newItem: PopularPlaceItem = {
          id: newSlug,
          name: formData.name || '',
          district: formData.district || '',
          districtSlug: targetSlug,
          image: mainImg,
          images: finalGallery,
          description: formData.description || '',
          overview: formData.overview || formData.description || '',
          highlights: parsedHighlights,
          bestTimeToVisit: formData.bestTimeToVisit || 'October to March',
          category: formData.category || 'Popular Attraction',
          rating: 4.8
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
        title="Popular Places & Attractions Manager"
        description="Edit titles, text descriptions, showcase photos, image galleries, and district linkages for site attractions."
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
              <div className="w-20 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )
          },
          {
            header: 'Place Name',
            accessor: (item) => (
              <div>
                <span className="font-semibold text-white block">{item.name}</span>
                <span className="text-xs text-white/40">{item.category || 'Attraction'}</span>
              </div>
            )
          },
          { header: 'District', accessor: 'district' },
          {
            header: 'Gallery Count',
            accessor: (item) => (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 text-[#EAB308]">
                <ImageIcon size={12} />
                {(item.images || [item.image]).length} Photos
              </span>
            )
          },
          {
            header: 'Page Link',
            accessor: (item) => (
              <Link
                to={`/places/${item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
              >
                View Live <ExternalLink size={12} />
              </Link>
            )
          },
        ]}
      />

      {/* Edit / Add Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit '${editingItem.name}'` : 'Add New Place / Attraction'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

          {/* Place Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Attraction / Place Name"
              placeholder="e.g. Bodh Gaya"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <AdminInput
              label="Category / Tagline"
              placeholder="e.g. UNESCO World Heritage Site"
              value={formData.category || ''}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          {/* District Name & District Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="District Display Name"
              placeholder="e.g. Gaya District"
              value={formData.district || ''}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
              required
            />
            <AdminInput
              label="District Key / Slug (for page link)"
              placeholder="e.g. gaya (or nalanda, patna, vaishali)"
              value={formData.districtSlug || ''}
              onChange={e => setFormData({ ...formData, districtSlug: e.target.value })}
            />
          </div>

          {/* Main Showcase Image */}
          <AdminImageUpload
            label="Main Showcase Photo (Cover Image)"
            value={formData.image || ''}
            onChange={val => setFormData({ ...formData, image: val })}
            required
          />

          {/* Multi-Image Gallery */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={14} className="text-[#EAB308]" />
                Additional Gallery Photos
              </label>
              <button
                type="button"
                onClick={addGalleryImageInput}
                className="text-xs font-bold text-black bg-[#EAB308] hover:bg-yellow-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add Photo URL
              </button>
            </div>

            {galleryInputs.length === 0 ? (
              <p className="text-xs text-white/40 font-light">
                No additional gallery photos added yet. Click &quot;Add Photo URL&quot; to attach extra images for this place.
              </p>
            ) : (
              <div className="space-y-2">
                {galleryInputs.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/photo.jpg or /src/assets/..."
                      value={imgUrl}
                      onChange={e => updateGalleryImageInput(idx, e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#EAB308]"
                    />
                    {imgUrl && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={imgUrl} alt="gallery preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryImageInput(idx)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Short Card Description */}
          <AdminTextarea
            label="Short Description (Shown on Cards)"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={2}
          />

          {/* Full Overview & History */}
          <AdminTextarea
            label="Detailed Overview & History (Shown on Full Page)"
            placeholder="Write full background, historical significance, and spiritual importance..."
            value={formData.overview || ''}
            onChange={e => setFormData({ ...formData, overview: e.target.value })}
            rows={5}
          />

          {/* Key Highlights & Best Time to Visit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AdminTextarea
                label="Key Highlights (One point per line)"
                placeholder={`Mahabodhi Temple Complex\nSacred Bodhi Tree\n80-Foot Buddha Statue`}
                value={highlightsInput}
                onChange={e => setHighlightsInput(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <AdminInput
                label="Best Time to Visit"
                placeholder="e.g. October to March"
                value={formData.bestTimeToVisit || ''}
                onChange={e => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {editingItem ? 'Save Attraction Changes' : 'Create Attraction'}
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
