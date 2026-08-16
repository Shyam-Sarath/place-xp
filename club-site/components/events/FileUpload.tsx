"use client"

import { useState, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UploadCloud, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  eventId: string;
  userId: string;
}

export function FileUpload({ eventId, userId }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  // Strongly typed event handler for TypeScript
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSuccess(false); // Reset success state if they pick a new file
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setSuccess(false);

    try {
      // 1. Clean filename and generate path
      const fileExt = file.name.split('.').pop();
      const filePath = `${eventId}/${userId}_${Date.now()}.${fileExt}`;

      // 2. Upload to Supabase Storage Bucket
      const { error: storageError } = await supabase.storage
        .from('presentations')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 3. Track submission in Database
      const { error: dbError } = await supabase
        .from('event_submissions')
        .insert([{ 
          event_id: eventId, 
          user_id: userId, 
          file_path: filePath 
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      setFile(null); // Clear the file input after successful upload
      
      // Reset the actual input element's value
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-xl bg-white/5 backdrop-blur-sm shadow-sm">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <UploadCloud className="w-5 h-5" /> Submit Presentation
      </h3>
      <p className="text-sm text-gray-500">Accepted formats: .pdf, .ppt, .pptx</p>
      
      <input 
        type="file" 
        accept=".pdf,.ppt,.pptx" 
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {success && (
        <p className="text-green-600 text-sm flex items-center gap-1 mt-2">
          <CheckCircle className="w-4 h-4" /> Successfully uploaded!
        </p>
      )}
    </div>
  );
}