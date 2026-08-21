import { useState } from 'react';
import { useAdminData } from '../../data/AdminContext';
import type { ProductItem } from '../../data/AdminContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminInput, AdminTextarea, AdminImageUpload } from '../../components/admin/AdminFormField';
import { AdminDeleteConfirm } from '../../components/admin/AdminDeleteConfirm';
import { LayoutList, ListChecks, CheckCircle, XCircle, Eye, ExternalLink, Mail, Phone, MapPin, Globe, Building2, Info } from 'lucide-react';

const emptyForm: Partial<ProductItem> = {
  businessName: '',
  productName: '',
  category: 'Art & Craft',
  image: '',
  images: [],
  description: '',
  contact: '',
  email: '',
  address: '',
  website: '',
  mapLink: '',
};

const AdminMarketplace = () => {
  const {
    products,
    approveProduct,
    rejectProduct,
    deleteProductDetail,
    updateProductDetail,
    createProductDetail,
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState<Partial<ProductItem>>(emptyForm);
  const [itemToDelete, setItemToDelete] = useState<ProductItem | null>(null);

  // View Details Modal State
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Expired Period Reminder Modal State
  const [isExpiryReminderOpen, setIsExpiryReminderOpen] = useState(false);

  const SUBSCRIPTION_PLANS = [
    { name: '10 Days Free Trial', days: 10, label: '10 Days Free Trial (10 Days - Free)' },
    { name: 'Monthly Plan', days: 30, label: 'Monthly Plan (30 Days - ₹200)' },
    { name: 'Quarterly Plan', days: 90, label: 'Quarterly Plan (90 Days - ₹500)' },
    { name: 'Half-Yearly Plan', days: 180, label: 'Half-Yearly Plan (180 Days - ₹800)' },
    { name: 'Yearly Plan', days: 365, label: 'Yearly Plan (365 Days - ₹1,300)' },
  ];

  const getDaysRemainingInfo = (item: any) => {
    let endDate: Date;
    if (item.freeDisplayEndDate) {
      endDate = new Date(item.freeDisplayEndDate);
    } else if (item.freeDisplayStartDate || item.approvedAt || item.createdAt) {
      const start = new Date(item.freeDisplayStartDate || item.approvedAt || item.createdAt);
      const planDays = item.planDays || 10;
      endDate = new Date(start.getTime() + planDays * 24 * 60 * 60 * 1000);
    } else {
      endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      daysLeft: Math.max(0, daysLeft),
      isExpired: daysLeft <= 0,
      formattedEndDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      currentPlanName: item.planName || (item.planDays ? `${item.planDays} Days Plan` : '10 Days Free Trial')
    };
  };

  const handlePlanChange = async (productId: string | number, planName: string, planDays: number) => {
    try {
      const now = new Date();
      const newEndDate = new Date(now.getTime() + planDays * 24 * 60 * 60 * 1000);
      await updateProductDetail(productId, {
        planName,
        planDays,
        freeDisplayStartDate: now.toISOString(),
        freeDisplayEndDate: newEndDate.toISOString(),
        status: 'APPROVED',
      });
    } catch (err) {
      console.error('Failed to update product plan:', err);
    }
  };

  // Feedback & Action Loading State
  const [approvingId, setApprovingId] = useState<string | number | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState<{
    id: string | number;
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Sub-view Tab Control
  const [subView, setSubView] = useState<'approved' | 'pending'>('approved');

  // Filter items by status
  const approvedItems = products.filter(item => item.status === 'APPROVED' || !item.status);
  const pendingItems = products.filter(item => item.status === 'PENDING');

  const activeDataList = subView === 'approved' ? approvedItems : pendingItems;

  const filteredData = activeDataList.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string | number) => {
    setApprovingId(id);
    setApprovalFeedback(null);
    try {
      const resData = await approveProduct(id);
      const isEmailSent = resData?.data?.emailStatus === 'SENT' || resData?.data?.emailStatus === 'ALREADY_SENT';
      setApprovalFeedback({
        id,
        message: resData?.message || 'Product approved successfully',
        type: isEmailSent ? 'success' : 'warning',
      });
    } catch (e: any) {
      console.error(e);
      setApprovalFeedback({
        id,
        message: e?.message || 'Failed to approve product',
        type: 'error',
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string | number) => {
    try {
      await rejectProduct(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ProductItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: ProductItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteProductDetail(itemToDelete.id);
        setIsDeleteOpen(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateProductDetail(editingItem.id, formData);
      } else {
        await createProductDetail({ ...formData, images: [formData.image || ''], status: 'APPROVED' }); // Admin additions are approved by default
      }
      setIsModalOpen(false);
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
          <LayoutList size={18} /> Marketplace Database ({approvedItems.length})
        </button>
        <button
          onClick={() => setSubView('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition relative ${subView === 'pending' ? 'bg-[#EAB308] text-black' : 'text-white/60 hover:text-white'
            }`}
        >
          <ListChecks size={18} /> Pending Submissions
          {pendingItems.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingItems.length}
            </span>
          )}
        </button>
      </div>

      {approvalFeedback && (
        <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between gap-3 ${
          approvalFeedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : approvalFeedback.type === 'warning'
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <Info size={18} />
            <span>{approvalFeedback.message}</span>
          </div>
          <button onClick={() => setApprovalFeedback(null)} className="text-white/40 hover:text-white">✕</button>
        </div>
      )}

      <AdminTable
        title={subView === 'approved' ? "Marketplace Products" : "Pending Products"}
        description={subView === 'approved' ? "Manage local products and businesses on the marketplace." : "Review user-submitted products."}
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
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>
            )
          },
          { header: 'Product Name', accessor: 'productName', className: 'font-semibold text-white' },
          { header: 'Business', accessor: 'businessName' },
          { header: 'Category', accessor: 'category' },
          {
            header: 'Email Status',
            accessor: (item) => (
              <span className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border ${
                item.approvalEmailSent
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                {item.approvalEmailSent ? '✉️ Email Sent' : '⚠️ Email Not Sent'}
              </span>
            )
          },
          {
            header: 'Display Plan & Counter',
            accessor: (item) => {
              if (item.status !== 'APPROVED' && item.status) return <span className="text-white/30 text-xs">Pending Approval</span>;
              const daysInfo = getDaysRemainingInfo(item);
              return (
                <div className="space-y-1.5 min-w-[170px]">
                  <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border block w-fit ${
                    daysInfo.isExpired
                      ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                  }`}>
                    {daysInfo.isExpired
                      ? '🚨 Free Period Ended (0d)'
                      : `⏳ ${daysInfo.daysLeft} Days Left`}
                  </span>

                  <select
                    value={item.planName || "10 Days Free Trial"}
                    onChange={(e) => {
                      const selected = SUBSCRIPTION_PLANS.find(p => p.name === e.target.value);
                      if (selected) handlePlanChange(item.id, selected.name, selected.days);
                    }}
                    className="bg-[#1a1a24] border border-brand-gold/30 rounded-lg px-2 py-1 text-[11px] text-white font-medium focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <option key={plan.name} value={plan.name}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
          },
          {
            header: 'Actions',
            accessor: (item) => (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { setViewingProduct(item); setIsViewModalOpen(true); }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/15 cursor-pointer"
                >
                  <Eye size={14} /> View Details
                </button>
                {subView === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={approvingId === item.id}
                      className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-green-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle size={14} /> {approvingId === item.id ? 'Approving...' : 'Approve & Send Email'}
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {subView === 'approved' && !item.approvalEmailSent && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={approvingId === item.id}
                    className="flex items-center gap-1.5 bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-brand-gold/30 disabled:opacity-50 cursor-pointer"
                  >
                    ✉️ Send Email
                  </button>
                )}
              </div>
            )
          }
        ]}
      />

      {/* ── VIEW PRODUCT DETAILS MODAL ────────────────────────────────────── */}
      {isViewModalOpen && viewingProduct && (
        <AdminModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setViewingProduct(null); }}
          title={`Review Product Submission: ${viewingProduct.productName}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            {/* Header Status & Action Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  viewingProduct.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : viewingProduct.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {viewingProduct.status || 'PENDING'}
                </span>

                {viewingProduct.status === 'APPROVED' && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    viewingProduct.approvalEmailSent
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {viewingProduct.approvalEmailSent ? '✉️ Approval Email Sent' : '⚠️ Email Not Sent Yet'}
                  </span>
                )}

                <span className="text-white/50 text-xs font-mono">
                  Submitted: {viewingProduct.createdAt ? new Date(viewingProduct.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {viewingProduct.status !== 'APPROVED' ? (
                  <>
                    <button
                      onClick={() => { handleReject(viewingProduct.id); setIsViewModalOpen(false); }}
                      disabled={approvingId === viewingProduct.id}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => { handleApprove(viewingProduct.id); setIsViewModalOpen(false); }}
                      disabled={approvingId === viewingProduct.id}
                      className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-xs font-bold shadow-lg shadow-emerald-500/10 disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle size={15} /> Approve & Send Email
                    </button>
                  </>
                ) : (
                  <>
                    {!viewingProduct.approvalEmailSent && (
                      <button
                        onClick={() => handleApprove(viewingProduct.id)}
                        disabled={approvingId === viewingProduct.id}
                        className="bg-brand-gold/20 border border-brand-gold/30 text-brand-gold px-4 py-2 rounded-xl hover:bg-brand-gold/30 transition-all flex items-center gap-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
                      >
                        ✉️ Send Email
                      </button>
                    )}
                    <button
                      onClick={() => { handleReject(viewingProduct.id); setIsViewModalOpen(false); }}
                      disabled={approvingId === viewingProduct.id}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle size={15} /> Revoke Approval
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Product Preview Banner */}
            <div className="relative h-60 rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <img src={viewingProduct.image} alt={viewingProduct.productName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2.5 py-0.5 rounded-full w-fit mb-2">
                  {viewingProduct.category}
                </span>
                <h2 className="text-2xl font-bold text-white font-serif">{viewingProduct.productName}</h2>
                <p className="text-sm text-brand-gold font-semibold flex items-center gap-1 mt-1">
                  <Building2 size={14} /> {viewingProduct.businessName}
                </p>
              </div>
            </div>

            {/* Contact Information & Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-white/40 text-xs flex items-center gap-1"><Phone size={12} /> Contact Number</span>
                <span className="text-white font-mono text-sm font-semibold">{viewingProduct.contact || 'Not provided'}</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-white/40 text-xs flex items-center gap-1"><Mail size={12} /> Seller Email</span>
                <span className="text-emerald-400 font-mono text-xs font-semibold block truncate">{viewingProduct.email || 'Not provided'}</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-white/40 text-xs flex items-center gap-1"><MapPin size={12} /> Address</span>
                <span className="text-white/90 text-xs block truncate">{viewingProduct.address || 'Not provided'}</span>
              </div>
            </div>

            {/* Links Section */}
            {(viewingProduct.website || viewingProduct.mapLink) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {viewingProduct.website && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-white/40 text-xs block mb-1">Website URL</span>
                    <a href={viewingProduct.website} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline text-xs flex items-center gap-1">
                      <Globe size={14} /> {viewingProduct.website}
                    </a>
                  </div>
                )}
                {viewingProduct.mapLink && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-white/40 text-xs block mb-1">Google Maps Location</span>
                    <a href={viewingProduct.mapLink} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline text-xs flex items-center gap-1">
                      <ExternalLink size={14} /> View Location Map
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Product & Business Description</h4>
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{viewingProduct.description || 'No description provided.'}</p>
            </div>

            {/* Product Gallery Images */}
            {viewingProduct.images && viewingProduct.images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Product Gallery ({viewingProduct.images.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {viewingProduct.images.map((imgUrl, idx) => (
                    <div key={idx} className="h-32 rounded-xl overflow-hidden bg-black/40 border border-white/10 group relative">
                      <img src={imgUrl} alt={`Product Image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <a href={imgUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Product' : 'Add Product'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Product Name *"
              value={formData.productName || ''}
              onChange={e => setFormData({ ...formData, productName: e.target.value })}
              required
            />
            <AdminInput
              label="Business Name *"
              value={formData.businessName || ''}
              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
            <AdminInput
              label="Category *"
              value={formData.category || ''}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <AdminInput
              label="Contact Info *"
              value={formData.contact || ''}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              required
            />
            <AdminInput
              label="Email Address"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <AdminInput
              label="Full Address (Optional)"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
            <AdminInput
              label="Website Link (Optional)"
              value={formData.website || ''}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
            />
            <AdminInput
              label="Google Maps Link (Optional)"
              value={formData.mapLink || ''}
              onChange={e => setFormData({ ...formData, mapLink: e.target.value })}
            />
          </div>

          <AdminImageUpload
            label="Image"
            value={formData.image || ''}
            onChange={val => setFormData({ ...formData, image: val })}
            required
          />

          <AdminTextarea
            label="Description *"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold hover:bg-[#EAB308] transition-colors">
              {editingItem ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminDeleteConfirm
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.productName || ''}
      />

      {/* ── EXPIRED DISPLAY PERIOD REMINDER POPUP MODAL ───────────────────────── */}
      {isExpiryReminderOpen && (
        <AdminModal
          isOpen={isExpiryReminderOpen}
          onClose={() => setIsExpiryReminderOpen(false)}
          title="🚨 Marketplace Display Period Ended - Renewal Required"
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400">
              <Info size={24} className="shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <h4 className="font-bold text-white text-base">Free Trial Display Period Expired</h4>
                <p className="text-white/80">
                  The 10-day free display period has ended for the following marketplace product(s). Select a plan from the dropdown to update and start a new days counter.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {approvedItems
                .filter(p => getDaysRemainingInfo(p).isExpired)
                .map(expProd => {
                  const info = getDaysRemainingInfo(expProd);
                  return (
                    <div key={expProd.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-white text-sm font-serif">{expProd.productName} ({expProd.businessName})</h5>
                        <p className="text-xs text-white/50 font-mono mt-0.5">Category: {expProd.category} | Expired: {info.formattedEndDate}</p>
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full inline-block mt-1.5 animate-pulse">
                          🚨 0 Days Left (Free Period Ended)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={expProd.planName || "10 Days Free Trial"}
                          onChange={(e) => {
                            const selected = SUBSCRIPTION_PLANS.find(sp => sp.name === e.target.value);
                            if (selected) handlePlanChange(expProd.id, selected.name, selected.days);
                          }}
                          className="bg-[#1a1a24] border border-brand-gold/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-brand-gold shadow-md"
                        >
                          {SUBSCRIPTION_PLANS.map(plan => (
                            <option key={plan.name} value={plan.name}>
                              {plan.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              {approvedItems.filter(p => getDaysRemainingInfo(p).isExpired).length === 0 && (
                <p className="text-white/40 text-sm text-center py-6">All approved products have active subscription plans.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setIsExpiryReminderOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#EAB308] text-black font-bold text-xs hover:bg-yellow-400 transition-all shadow-lg"
              >
                Done / Close Reminder
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminMarketplace;
