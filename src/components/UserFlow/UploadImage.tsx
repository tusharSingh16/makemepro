import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/trainer-dashboard/ui/button';
import { Check, Upload } from 'lucide-react';

interface Prop {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
}

const UploadImage: React.FC<Prop> = ({ imageUrl, setImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Reset the upload state
      setSignedUrl(null);
      setImageUrl('');
      setIsUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImageUrl(response.data.imageUrl);
      const response2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-temp?imageUrl=${response.data.imageUrl}`);
      if (!response2.ok) throw new Error('Failed to fetch signed URL');
      const data = await response2.json();
      setSignedUrl(data.signedUrl);
      setIsUploaded(true);
      
      // Clear the preview URL after successful upload
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file: ' + error);
      setIsUploaded(false);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-start p-3 rounded-md border border-gray-300 shadow-sm bg-white w-full">
      <p className='text-lg font-bold'>Upload Image</p>
      <br />
      <div className="w-full flex flex-col gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 text-sm cursor-pointer border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || loading}
            className="w-fit flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </>
            )}
          </Button>
          {isUploaded && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span>Image uploaded successfully!</span>
            </div>
          )}
        </div>
      </div>
      {(previewUrl || signedUrl) && (
        <div className="mt-3 w-full">
          <p className="text-sm text-gray-600 mb-2">
            {signedUrl ? 'Uploaded Image:' : 'Preview:'}
          </p>
          <div className="flex justify-center">
            <Image 
              src={signedUrl || previewUrl || ''} 
              alt={signedUrl ? "Uploaded" : "Preview"} 
              height={100} 
              width={150} 
              className="rounded-md shadow-sm" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
