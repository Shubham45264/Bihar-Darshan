import { useState } from 'react';
import type { SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

interface AdminFormFieldProps {
  label: string;
  error?: string;
  className?: string;
}

export const AdminInput = ({ label, error, className = '', ...props }: AdminFormFieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
    <input
      {...props}
      className={`bg-white/[0.02] border ${error ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-[#EAB308]/50'} rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500/20' : 'focus:ring-[#EAB308]/20'} transition-all w-full`}
    />
    {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
  </div>
);

export const AdminTextarea = ({ label, error, className = '', ...props }: AdminFormFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
    <textarea
      {...props}
      className={`bg-white/[0.02] border ${error ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-[#EAB308]/50'} rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500/20' : 'focus:ring-[#EAB308]/20'} transition-all w-full min-h-[100px] resize-y`}
    />
    {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
  </div>
);

export const AdminSelect = ({ label, error, className = '', children, ...props }: AdminFormFieldProps & SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
    <select
      {...props}
      className={`bg-[#0d0d12] border ${error ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-[#EAB308]/50'} rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500/20' : 'focus:ring-[#EAB308]/20'} transition-all w-full cursor-pointer`}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
  </div>
);

interface AdminImagePreviewProps {
  url: string;
  alt: string;
  className?: string;
}

export const AdminImagePreview = ({ url, alt, className = '' }: AdminImagePreviewProps) => {
  if (!url) return null;
  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 ${className}`}>
      <img src={url} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

interface AdminImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const AdminImageUpload = ({ label, value, onChange, required = false }: AdminImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await uploadToCloudinary(file);
      onChange(res.secure_url);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('Failed to upload image to Cloudinary. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>

      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer min-h-[140px] ${isDragging
            ? 'border-[#EAB308] bg-[#EAB308]/10'
            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
          }
        }}
        onClick={() => {
          if (isUploading) return;
          const inputId = `file-input-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          document.getElementById(inputId)?.click();
        }}
      >
        <input
          id={`file-input-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        {isUploading ? (
          <div className="text-center py-4 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="text-[#EAB308] animate-spin" />
            <p className="text-xs font-semibold text-white">Uploading to Cloudinary...</p>
          </div>
        ) : value ? (
          <div className="relative w-full aspect-video max-h-[160px] rounded-lg overflow-hidden group/img flex items-center justify-center bg-[#07070b]">
            <img src={value} alt={label} className="max-w-full max-h-full object-contain" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
              <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                <Upload size={14} /> Drag image or click to replace
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <Upload size={20} className="text-white/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">Drag & drop image here</p>
            <p className="text-[10px] text-white/40 mt-0.5">or click to browse files (Cloudinary optimized)</p>
          </div>
        )}
      </div>

      <div className="mt-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder={`Or paste ${label.toLowerCase()} Cloudinary URL...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required && !value}
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-[#EAB308]/50 focus:ring-1 focus:ring-[#EAB308]/50"
        />
      </div>
    </div>
  );
};
