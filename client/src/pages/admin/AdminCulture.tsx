import { useState, useEffect, useCallback } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminSelect, AdminImagePreview, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import type { CultureItem } from '../../data/cultureData';
import { Plus, Trash2, CheckCircle, XCircle, LayoutList, ListChecks, Sparkles } from 'lucide-react';
import { auth } from '../../lib/firebase';

import { useContributions } from '../../data/ContributionContext';
import { API_BASE_URL } from '../../config/api';

const emptyForm: Partial<CultureItem> = {
  title: '',
  type: 'Festival',
  district: '',
  image: '',
  description: '',
  longDescription: '',
  videoUrl: '',
  galleryImages: [],
  extendedDetails: [],
};

const AdminCulture = () => {
  const { culture, refreshCulture, districts } = useAdminData();
  const { cultureSubmissions } = useContributions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CultureItem | null>(null);
  const [formData, setFormData] = useState<Partial<CultureItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<CultureItem | null>(null);

  // Sub-view Tab Control: approved | pending | categories
  const [subView, setSubView] = useState<'approved' | 'pending' | 'categories'>('approved');

  // Database Custom Category Submissions State
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbDiscoverItems, setDbDiscoverItems] = useState<any[]>([]);

  const fetchDiscoverItems = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/discover?status=all`);
      const data = await res.json();
      if (data.success && data.data?.items) {
        setDbDiscoverItems(data.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch discover items:', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/categories?status=all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.categories) {
        setDbCategories(data.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchDiscoverItems();
    fetchCategories();
  }, [fetchDiscoverItems, fetchCategories]);

  const handleDeleteCategory = async (catId: string) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/categories/${catId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const pendingCategoryList = dbCategories.filter(c => c.status === 'PENDING');

  const handleApproveCategory = async (catId: string) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/categories/${catId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Failed to approve category:', err);
    }
  };

  const handleRejectCategory = async (catId: string) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/categories/${catId}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Failed to reject category:', err);
    }
  };

  const mappedDbItems = dbDiscoverItems.map(item => {
    let itemType = item.category || 'Culture';
    if (item.extendedDetails && Array.isArray(item.extendedDetails)) {
      const customCatDetail = item.extendedDetails.find((d: string) => typeof d === 'string' && d.startsWith('Category: '));
      if (customCatDetail) {
        itemType = customCatDetail.replace('Category: ', '').trim();
      }
    }
    return {
      id: item.id,
      title: item.title,
      type: itemType,
      district: item.district || 'Bihar',
      image: item.image,
      description: item.description,
      longDescription: item.longDescription,
      videoUrl: item.videoUrl,
      galleryImages: item.galleryImages,
      extendedDetails: item.extendedDetails,
      submittedBy: item.author || 'User',
      status: item.status || 'APPROVED'
    };
  });

  const allCultureItems = [...mappedDbItems, ...culture, ...cultureSubmissions];
  
  // Deduplicate items by ID
  const uniqueItemsMap = new Map();
  allCultureItems.forEach(item => {
    if (!uniqueItemsMap.has(item.id)) {
      uniqueItemsMap.set(item.id, item);
    }
  });
  const mergedCultureList = Array.from(uniqueItemsMap.values()) as CultureItem[];

  // Filter items by status
  const approvedItems = mergedCultureList.filter(item => (item as any).status === 'APPROVED' || !(item as any).status);
  const pendingContentItems = mergedCultureList.filter(item => (item as any).status === 'PENDING');

  const activeDataList = subView === 'approved' ? approvedItems : pendingContentItems;

  const filteredData = activeDataList.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategoryData = dbCategories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/discover/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchDiscoverItems();
        refreshCulture();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`${API_BASE_URL}/discover/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchDiscoverItems();
        refreshCulture();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: CultureItem) => {
    setEditingItem(item);
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: CultureItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';
        const res = await fetch(`${API_BASE_URL}/discover/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          fetchDiscoverItems();
          refreshCulture();
          setIsDeleteOpen(false);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      const typeUpper = (formData.type || 'FESTIVAL').toUpperCase();
      let categoryMapped = 'FESTIVAL';
      if (['FOOD', 'FESTIVAL', 'CRAFT', 'HERITAGE', 'WILDLIFE'].includes(typeUpper)) {
        categoryMapped = typeUpper;
      }

      const payload = {
        title: formData.title,
        category: categoryMapped,
        image: formData.image,
        description: formData.description,
        longDescription: formData.longDescription || '',
        videoUrl: formData.videoUrl || '',
        galleryImages: formData.galleryImages || [],
        extendedDetails: formData.extendedDetails || [],
        district: formData.district || 'Bihar',
        author: formData.submittedBy || 'Admin',
        status: 'APPROVED',
      };

      let response;
      if (editingItem) {
        response = await fetch(`${API_BASE_URL}/discover/${editingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/discover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        fetchDiscoverItems();
        refreshCulture();
        setIsModalOpen(false);
      } else {
        console.error('Failed to save to database:', await response.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery[index] = value;
    setFormData({ ...formData, galleryImages: newGallery });
  };

  const addGalleryImage = () => {
    setFormData({ ...formData, galleryImages: [...(formData.galleryImages || []), ''] });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: newGallery });
  };

  return (
    <div className="space-y-6">
      {/* Sub-view switcher */}
      <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setSubView('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${subView === 'approved' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'}`}
        >
          <LayoutList size={18} /> Discover Database ({approvedItems.length})
        </button>

        <button
          onClick={() => setSubView('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition relative ${subView === 'pending' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'}`}
        >
          <ListChecks size={18} /> Pending Submissions
          {pendingContentItems.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingContentItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubView('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition relative ${subView === 'categories' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'}`}
        >
          <Sparkles size={18} /> Category Approvals
          {pendingCategoryList.length > 0 && (
            <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingCategoryList.length}
            </span>
          )}
        </button>
      </div>

      {subView === 'categories' ? (
        <AdminTable
          title="Category Approvals"
          description="Review and approve user-suggested custom categories for the Discover page."
          data={filteredCategoryData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          columns={[
            {
              header: 'Cover Photo',
              accessor: (item) => (
                <div className="w-14 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                  <img src={item.image || '/images/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )
            },
            { header: 'Category Name', accessor: 'title', className: 'font-bold text-white text-base' },
            { header: 'Description', accessor: (item) => item.description || 'No description provided', className: 'text-gray-300 text-sm max-w-xs truncate' },
            { header: 'District', accessor: (item) => item.district || 'BIHAR' },
            {
              header: 'Status',
              accessor: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  item.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.status || 'PENDING'}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  {item.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleApproveCategory(item.id)}
                      className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-green-500/20 cursor-pointer"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  {item.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleRejectCategory(item.id)}
                      className="flex items-center gap-1.5 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-yellow-500/20 cursor-pointer"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(item.id)}
                    className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            }
          ]}
        />
      ) : (
        <AdminTable
          title={subView === 'approved' ? "Culture & Discover Items" : "Pending Discover Submissions"}
          description={subView === 'approved' ? "Manage approved festivals, foods, and arts of Bihar." : "Review user-submitted festivals and foods of Bihar."}
          data={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAdd={subView === 'approved' ? handleAdd : undefined}
          onEdit={subView === 'approved' ? handleEdit : undefined}
          onDelete={subView === 'approved' ? handleDeleteClick : undefined}
          columns={[
            {
              header: 'Image',
              accessor: (item) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )
            },
            { header: 'Title', accessor: 'title', className: 'font-semibold text-white' },
            { header: 'Type / Category', accessor: 'type', className: 'font-semibold text-amber-400' },
            { header: 'District', accessor: 'district' },
            { header: 'Submitted By', accessor: (item) => item.submittedBy || 'User', className: 'text-xs text-gray-300' },
            {
              header: 'Status',
              accessor: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  item.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.status || 'PENDING'}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (item) => {
                if (subView === 'pending') {
                  return (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-green-500/20 cursor-pointer"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  );
                }
                return null;
              }
            }
          ]}
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Culture Item' : 'Add Culture Item'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Title"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <AdminSelect
              label="Type"
              value={formData.type || 'Festival'}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="Festival">Festival</option>
              <option value="Food">Food</option>
              <option value="Craft">Craft</option>
              <option value="Heritage">Heritage</option>
              <option value="Wildlife">Wildlife</option>
            </AdminSelect>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="District"
              value={formData.district || ''}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
              required
            >
              <option value="">Select a District</option>
              {districts.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </AdminSelect>
            <AdminImageUpload
              label="Thumbnail Image"
              value={formData.image || ''}
              onChange={val => setFormData({ ...formData, image: val })}
              required
            />
          </div>

          {/* ROW 4 */}
          <AdminTextarea
            label="Short Description"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
          />

          <AdminTextarea
            label="Long Description / Details"
            value={formData.longDescription || ''}
            onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
            rows={5}
            placeholder="Add rich historical context or details to show on details page"
          />

          <AdminInput
            label="Video Embed URL (Optional)"
            value={formData.videoUrl || ''}
            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="e.g. https://www.youtube.com/embed/XXXXXX"
          />

          {/* ROW 5: Gallery */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex justify-between items-center mb-4 mt-2">
              <label className="block text-sm font-medium text-white/70">Gallery Image URLs</label>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {(formData.galleryImages || []).map((url, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 relative group">
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-3 right-3 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="w-full">
                    <AdminImageUpload
                      label={`Gallery Image ${index + 1}`}
                      value={url}
                      onChange={(val) => handleGalleryChange(index, val)}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addGalleryImage}
                className="mt-2 text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Plus size={16} /> Add Gallery Image
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#EAB308] transition-colors">
              {editingItem ? 'Save Changes' : 'Add Item'}
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

export default AdminCulture;
