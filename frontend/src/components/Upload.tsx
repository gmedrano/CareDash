import React, { useState } from 'react';
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";

interface UploadProps {
  token: string;
}

const Upload: React.FC<UploadProps> = ({ token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log('File uploaded successfully:', response);
        } else {
          console.error('Error uploading file:', xhr.statusText);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        console.error('Error uploading file');
        setUploading(false);
      };

      xhr.open('POST', '/api/upload/');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  return (
    <div>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" onClick={handleUpload} disabled={uploading}>
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
        </button>
        <label htmlFor="modal-toggle" className="close-button" style={{"marginLeft":"5px"}}>Cancel</label>
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
    </div>
  );
};

export default Upload;  