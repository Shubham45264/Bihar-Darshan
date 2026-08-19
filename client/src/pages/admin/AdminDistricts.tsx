import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImagePreview, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import { Plus, Trash2, LayoutList, Info, Plane, SunSnow, MapPin } from 'lucide-react';
import type { District } from '../../data/districtsData';

const emptyForm: Partial<District> = {
  name: '',
  image: '',
  tagline: '',
  introduction: '',
  richHistory: '',
  topTouristAttraction: { name: '', details: '' },
  howToReach: { air: '', rail: '', road: '' },
  whyInTouristList: [''],
  seasonalVisit: [],
  topAttractions: [],
};

const AdminDistricts = () => {
  const {
    districts,
    createDistrictDetail,
    updateDistrictDetail,
    deleteDistrictDetail,
    popularPlaces,
    updatePopularPlaces
  } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Partial<District>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'transport' | 'seasons' | 'attractions'>('basic');

  const filteredData = districts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tagline && item.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      whyInTouristList: item.whyInTouristList?.length ? item.whyInTouristList : [''],
      topAttractions: item.topAttractions || [],
      seasonalVisit: item.seasonalVisit || []
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete && itemToDelete.id) {
      try {
        await deleteDistrictDetail(itemToDelete.id);
        setIsDeleteOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete district.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        if (!editingItem.id) throw new Error('Cannot update: Missing district ID.');
        await updateDistrictDetail(editingItem.id, formData);
      } else {
        await createDistrictDetail(formData);
      }

      // Sync topAttractions to popularPlaces
      if (formData.topAttractions && formData.topAttractions.length > 0) {
        const distName = formData.name || 'Bihar';
        const distSlug = distName.toLowerCase().replace(/district/i, '').trim();

        const updatedPlaces = [...popularPlaces];
        let hasChanges = false;

        formData.topAttractions.forEach((att: any) => {
          if (!att || !att.name) return;
          const normName = att.name.toLowerCase().trim();
          const existingIdx = updatedPlaces.findIndex(p => p.name.toLowerCase().trim() === normName);

          if (existingIdx >= 0) {
            updatedPlaces[existingIdx] = {
              ...updatedPlaces[existingIdx],
              image: att.image || updatedPlaces[existingIdx].image,
              description: att.description || updatedPlaces[existingIdx].description,
              district: updatedPlaces[existingIdx].district || `${distName} District`,
              districtSlug: updatedPlaces[existingIdx].districtSlug || distSlug,
            };
            hasChanges = true;
          } else {
            const newSlug = att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            updatedPlaces.push({
              id: newSlug,
              name: att.name,
              district: `${distName.replace(/district/i, '').trim()} District`,
              districtSlug: distSlug,
              image: att.image || '/src/assets/bihar-heritage.png',
              images: [att.image || '/src/assets/bihar-heritage.png'],
              description: att.description || '',
              overview: att.description || '',
              bestTimeToVisit: 'October to March',
              rating: 4.8,
              category: 'District Attraction'
            });
            hasChanges = true;
          }
        });

        if (hasChanges) {
          await updatePopularPlaces(updatedPlaces);
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save district.');
    }
  };

  const handleArrayStringChange = (index: number, value: string, arrayName: 'whyInTouristList') => {
    const newArray = [...(formData[arrayName] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayStringItem = (arrayName: 'whyInTouristList') => {
    setFormData({ ...formData, [arrayName]: [...(formData[arrayName] || []), ''] });
  };

  const removeArrayStringItem = (index: number, arrayName: 'whyInTouristList') => {
    const newArray = [...(formData[arrayName] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  return (
    <div className="space-y-6">
      <AdminTable
        title="Districts"
        description="Manage the 38 districts of Bihar and their detailed profiles."
        data={filteredData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        columns={[
          {
            header: 'Image',
            accessor: (item) => (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )
          },
          { header: 'District Name', accessor: 'name', className: 'font-semibold text-white' },
          { header: 'Tagline', accessor: 'tagline', className: 'text-white/60 text-sm hidden md:table-cell' },
        ]}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit ${editingItem.name}` : 'Add District'}
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'basic', label: 'Basic Info', icon: Info },
              { id: 'content', label: 'Content', icon: LayoutList },
              { id: 'transport', label: 'Transport', icon: Plane },
              { id: 'seasons', label: 'Seasons', icon: SunSnow },
              { id: 'attractions', label: 'Attractions', icon: MapPin },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#EAB308] text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6 min-w-0">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 min-h-[400px]">

              {/* TAB 1: BASIC */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-fade-in">
                  <AdminInput
                    label="District Name"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <AdminInput
                    label="Tagline"
                    value={formData.tagline || ''}
                    onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  />
                  <AdminImageUpload
                    label="Cover Image"
                    value={formData.image || ''}
                    onChange={val => setFormData({ ...formData, image: val })}
                    required
                  />
                </div>
              )}

              {/* TAB 2: CONTENT */}
              {activeTab === 'content' && (
                <div className="space-y-4 animate-fade-in">
                  <AdminTextarea
                    label="Introduction"
                    value={formData.introduction || ''}
                    onChange={e => setFormData({ ...formData, introduction: e.target.value })}
                    rows={4}
                  />
                  <AdminTextarea
                    label="Rich History"
                    value={formData.richHistory || ''}
                    onChange={e => setFormData({ ...formData, richHistory: e.target.value })}
                    rows={4}
                  />

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-white/70">Why it should be in your tourist list</label>
                      <button type="button" onClick={() => addArrayStringItem('whyInTouristList')} className="text-xs flex items-center gap-1 text-[#EAB308] hover:text-[#D4A017]">
                        <Plus size={14} /> Add Point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.whyInTouristList || []).map((point, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => handleArrayStringChange(index, e.target.value, 'whyInTouristList')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#EAB308]/50 focus:ring-1 focus:ring-[#EAB308]/50"
                          />
                          <button type="button" onClick={() => removeArrayStringItem(index, 'whyInTouristList')} className="p-2 text-white/40 hover:text-red-400 bg-white/5 rounded-lg border border-white/10">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TRANSPORT */}
              {activeTab === 'transport' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                    <h4 className="text-white font-medium mb-2">Top Tourist Attraction (Main)</h4>
                    <AdminInput
                      label="Attraction Name"
                      value={formData.topTouristAttraction?.name || ''}
                      onChange={e => setFormData({
                        ...formData,
                        topTouristAttraction: { ...(formData.topTouristAttraction || { name: '', details: '' }), name: e.target.value }
                      })}
                    />
                    <AdminTextarea
                      label="Attraction Details"
                      value={formData.topTouristAttraction?.details || ''}
                      onChange={e => setFormData({
                        ...formData,
                        topTouristAttraction: { ...(formData.topTouristAttraction || { name: '', details: '' }), details: e.target.value }
                      })}
                      rows={2}
                    />
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4 mt-4">
                    <h4 className="text-white font-medium mb-2">How to Reach</h4>
                    <AdminTextarea
                      label="By Air"
                      value={formData.howToReach?.air || ''}
                      onChange={e => setFormData({
                        ...formData,
                        howToReach: { ...(formData.howToReach || { air: '', rail: '', road: '' }), air: e.target.value }
                      })}
                      rows={2}
                    />
                    <AdminTextarea
                      label="By Rail"
                      value={formData.howToReach?.rail || ''}
                      onChange={e => setFormData({
                        ...formData,
                        howToReach: { ...(formData.howToReach || { air: '', rail: '', road: '' }), rail: e.target.value }
                      })}
                      rows={2}
                    />
                    <AdminTextarea
                      label="By Road"
                      value={formData.howToReach?.road || ''}
                      onChange={e => setFormData({
                        ...formData,
                        howToReach: { ...(formData.howToReach || { air: '', rail: '', road: '' }), road: e.target.value }
                      })}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SEASONS */}
              {activeTab === 'seasons' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Seasonal Visits</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        seasonalVisit: [...(formData.seasonalVisit || []), { season: 'New Season', months: '', weather: '', whyVisit: '' }]
                      })}
                      className="text-xs flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-white hover:bg-white/20"
                    >
                      <Plus size={14} /> Add Season
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(formData.seasonalVisit || []).map((season, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 relative group">
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...(formData.seasonalVisit || [])];
                            newArr.splice(index, 1);
                            setFormData({ ...formData, seasonalVisit: newArr });
                          }}
                          className="absolute top-3 right-3 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <AdminInput
                            label="Season Name (e.g. Winter)"
                            value={season.season}
                            onChange={(e) => {
                              const newArr = [...(formData.seasonalVisit || [])];
                              newArr[index].season = e.target.value;
                              setFormData({ ...formData, seasonalVisit: newArr });
                            }}
                          />
                          <AdminInput
                            label="Months"
                            value={season.months}
                            onChange={(e) => {
                              const newArr = [...(formData.seasonalVisit || [])];
                              newArr[index].months = e.target.value;
                              setFormData({ ...formData, seasonalVisit: newArr });
                            }}
                          />
                        </div>
                        <AdminInput
                          label="Weather"
                          value={season.weather}
                          onChange={(e) => {
                            const newArr = [...(formData.seasonalVisit || [])];
                            newArr[index].weather = e.target.value;
                            setFormData({ ...formData, seasonalVisit: newArr });
                          }}
                        />
                        <div className="mt-3">
                          <AdminTextarea
                            label="Why Visit (Details)"
                            value={season.whyVisit}
                            onChange={(e) => {
                              const newArr = [...(formData.seasonalVisit || [])];
                              newArr[index].whyVisit = e.target.value;
                              setFormData({ ...formData, seasonalVisit: newArr });
                            }}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    {(!formData.seasonalVisit || formData.seasonalVisit.length === 0) && (
                      <p className="text-white/40 text-sm text-center py-8 border border-white/5 border-dashed rounded-xl">No seasons added. Click 'Add Season' to begin.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: ATTRACTIONS */}
              {activeTab === 'attractions' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Top Attractions Grid</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        topAttractions: [...(formData.topAttractions || []), { name: 'New Attraction', image: '', description: '' }]
                      })}
                      className="text-xs flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-white hover:bg-white/20"
                    >
                      <Plus size={14} /> Add Attraction
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(formData.topAttractions || []).map((attr, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 relative group">
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...(formData.topAttractions || [])];
                            newArr.splice(index, 1);
                            setFormData({ ...formData, topAttractions: newArr });
                          }}
                          className="absolute top-3 right-3 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <AdminInput
                            label="Attraction Name"
                            value={attr.name}
                            onChange={(e) => {
                              const newArr = [...(formData.topAttractions || [])];
                              newArr[index].name = e.target.value;
                              setFormData({ ...formData, topAttractions: newArr });
                            }}
                          />
                          <AdminImageUpload
                            label="Attraction Image"
                            value={attr.image}
                            onChange={(val) => {
                              const newArr = [...(formData.topAttractions || [])];
                              newArr[index].image = val;
                              setFormData({ ...formData, topAttractions: newArr });
                            }}
                            required
                          />
                        </div>
                        <AdminTextarea
                          label="Description"
                          value={attr.description}
                          onChange={(e) => {
                            const newArr = [...(formData.topAttractions || [])];
                            newArr[index].description = e.target.value;
                            setFormData({ ...formData, topAttractions: newArr });
                          }}
                          rows={3}
                        />
                      </div>
                    ))}
                    {(!formData.topAttractions || formData.topAttractions.length === 0) && (
                      <p className="text-white/40 text-sm text-center py-8 border border-white/5 border-dashed rounded-xl">No attractions added. Click 'Add Attraction' to begin.</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#D4A017] transition-colors">
                {editingItem ? 'Save Changes' : 'Add District'}
              </button>
            </div>
          </form>
        </div>
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

export default AdminDistricts;
