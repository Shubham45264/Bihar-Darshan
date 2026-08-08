import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import type { PersonalityItem } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminSelect, AdminImagePreview, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import { CheckCircle, XCircle, LayoutList, ListChecks } from 'lucide-react';
import { auth } from '../../lib/firebase';

const emptyForm: Partial<PersonalityItem> = {
  name: '',
  category: 'Historical',
  district: '',
  description: '',
  imageUrl: '',
  fullBio: '',
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminPersonalities = () => {
  const { personalities, refreshPersonalities } = useAdminData();
  const { personalitySubmissions } = useContributions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonalityItem | null>(null);
  const [formData, setFormData] = useState<Partial<PersonalityItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<PersonalityItem | null>(null);

  // Sub-view tab control
  const [subView, setSubView] = useState<'approved' | 'pending'>('approved');

  // Filter items by status
  const approvedItems = personalities.filter((p: any) => p.status === 'APPROVED' || !p.status);
  const pendingItems = [...personalities.filter((p: any) => p.status === 'PENDING'), ...personalitySubmissions];

  const activeDataList = subView === 'approved' ? approvedItems : pendingItems;

  const filteredData = activeDataList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`http://localhost:5000/api/v1/culture/personalities/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        refreshPersonalities();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
      const res = await fetch(`http://localhost:5000/api/v1/culture/personalities/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        refreshPersonalities();
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

  const handleEdit = (item: PersonalityItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: PersonalityItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';
        const res = await fetch(`http://localhost:5000/api/v1/culture/personalities/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          refreshPersonalities();
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

      const payload = {
        name: formData.name,
        category: formData.category,
        district: formData.district || 'Bihar',
        description: formData.description,
        imageUrl: formData.imageUrl,
        fullBio: formData.fullBio || '',
        author: (formData as any).submittedBy || 'Admin',
        status: 'APPROVED', // Admin created items are auto-approved
      };

      let response;
      if (editingItem) {
        response = await fetch(`http://localhost:5000/api/v1/culture/personalities/${editingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://localhost:5000/api/v1/culture/personalities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        refreshPersonalities();
        setIsModalOpen(false);
      } else {
        console.error('Failed to save personality to database:', await response.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-view switcher */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setSubView('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${subView === 'approved' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'
            }`}
        >
          <LayoutList size={18} /> Personalities Database ({approvedPersonalities.length})
        </button>
        <button
          onClick={() => setSubView('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition relative ${subView === 'pending' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'
            }`}
        >
          <ListChecks size={18} /> Pending Submissions
          {pendingPersonalities.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingPersonalities.length}
            </span>
          )}
        </button>
      </div>

      <AdminTable
        title={subView === 'approved' ? "Famous Personalities" : "Pending Personality Submissions"}
        description={subView === 'approved' ? "Manage famous and historical figures of Bihar." : "Review user-submitted personalities of Bihar."}
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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 shrink-0 border border-white/10">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )
          },
          { header: 'Name', accessor: 'name', className: 'font-semibold text-white' },
          { header: 'Category', accessor: 'category' },
          { header: 'District', accessor: 'district' },
          {
            header: 'Actions',
            accessor: (item) => {
              if (subView === 'pending') {
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-green-500/20"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20"
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Personality' : 'Add Personality'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Name"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <AdminSelect
              label="Category"
              value={formData.category || 'Historical'}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="Historical">Historical</option>
              <option value="Literature">Literature</option>
              <option value="Arts & Cinema">Arts & Cinema</option>
              <option value="Politician">Politician</option>
              <option value="Sports">Sports</option>
            </AdminSelect>
          </div>

          <AdminSelect
            label="Associated District"
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
            label="Portrait Image"
            value={formData.imageUrl || ''}
            onChange={val => setFormData({ ...formData, imageUrl: val })}
            required
          />

          <AdminTextarea
            label="Biography / Description (Short Summary)"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
          />

          <div className="pt-4 mt-2 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Detailed Content (Read Bio)</h3>
            <AdminTextarea
              label="Full Biography (Optional)"
              value={formData.fullBio || ''}
              onChange={e => setFormData({ ...formData, fullBio: e.target.value })}
              rows={8}
              placeholder="Leave empty to fall back to the short summary when the user clicks 'Read Bio'"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#EAB308] transition-colors">
              {editingItem ? 'Save Changes' : 'Add Personality'}
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

export default AdminPersonalities;
