"use client";
import React, { useState } from 'react';
// import Select, { MultiValue } from 'react-select';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { CrossIcon, EditIcon } from '@/utils/svgicons';
import { generateSignedUrlForBanners, deleteFileFromS3 } from '@/actions';
import { getImageClientS3URL } from '@/config/axios';
import { toast } from 'sonner';
import { validateImageFile } from '@/utils/fileValidation';
import { updateAdminSettings, getAdminSettings } from '@/services/admin-services';
import useSWR from 'swr';

const Select = dynamic(() => import('react-select'), { ssr: false });
const MultiValue = dynamic(() => import('react-select'), { ssr: false });

interface NotificationData {
  title: string;
  text: string;
  recipients: string[];
}

interface OptionType {
  value: string;
  label: string;
}

interface BannerImage {
  id: string;
  url: string;
  key: string;
  file?: File;
}

const NotificationForm = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: '',
    text: '',
    recipients: []
  });

  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing admin settings including banners
  const { data: adminSettings, mutate: mutateAdminSettings, isLoading: isLoadingSettings } = useSWR(
    '/admin/admin-settings',
    getAdminSettings
  );

  // Convert banner keys to BannerImage objects
  const banners: BannerImage[] = (adminSettings?.data?.data?.banners || []).map((key: string, index: number) => ({
    id: `${index}`,
    url: getImageClientS3URL(key),
    key: key
  }));

  const people = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sara Williams'];

  // Convert people array to react-select options
  const options: OptionType[] = people.map(person => ({
    value: person,
    label: person
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecipientsChange = (selectedOptions: any) => {
    const recipients = selectedOptions.map(option => option.value);
    setFormData(prev => ({
      ...prev,
      recipients: recipients
    }));
  };

  const removeRecipient = (name: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(recipient => recipient !== name)
    }));
  };

  const uploadBannerToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      // Generate signed URL for S3 upload
      const { signedUrl, key } = await generateSignedUrlForBanners(
        fileName,
        file.type
      );

      // Upload the file to S3
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload banner to S3");
      }

      return key;
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file using our centralized validation
    const validation = validateImageFile(file, 5); // 5MB limit
    if (!validation.isValid) {
      toast.error(validation.error);
      // Reset the input
      e.target.value = '';
      return;
    }

    try {
      const imageKey = await uploadBannerToS3(file);

      // Get current banners and add the new one
      const currentBanners = adminSettings?.data?.data?.banners || [];
      const updatedBanners = [...currentBanners, imageKey];
      console.log('updatedBanners: ', updatedBanners);

      // Update admin settings with new banner array
      const reponse =await updateAdminSettings({ banners: updatedBanners });
      console.log('reponse: ', reponse);

      // Refresh the data
      await mutateAdminSettings();

      toast.success('Banner uploaded successfully');
    } catch (error) {
      console.error('Error uploading banner:', error);
    }

    // Reset input
    e.target.value = '';
  };

  const handleDeleteBanner = async (bannerId: string) => {
    const banner = banners.find(b => b.id === bannerId);
    if (!banner) return;

    try {
      // Delete from S3
      await deleteFileFromS3(banner.key);

      // Get current banners and remove the deleted one
      const currentBanners = adminSettings?.data?.data?.banners || [];
      const updatedBanners = currentBanners.filter((key: string) => key !== banner.key);

      // Update admin settings with updated banner array
      await updateAdminSettings({ banners: updatedBanners });

      // Refresh the data
      await mutateAdminSettings();

      toast.success('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notification Form Submitted:', formData);
  };

  return (
    <div className="w-full">

      <div className="flex flex-col md:flex-row gap-[20px]">
        {/* Left Side - Notification Form */}
        <div className="w-full md:w-[60%]">
      <h1 className="text-[#10375c] text-3xl font-semibold mb-[20px]">Notifications</h1>
          <div className="bg-white rounded-lg shadow-md px-[20px] pt-[20px] pb-[30px] mb-[15px]">

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[10px] mb-[20px]">
            <label htmlFor="title" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
              Enter Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Lorem ipsum Dummy Text here..."
              className="w-full px-[15px] py-2.5 bg-white rounded-[44px] border border-[#e6e6e6] text-black/60 text-xs font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-[10px] mb-[20px]">
            <label htmlFor="text" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
              Enter Your text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="Lorem ipsum Dummy Text here..."
              rows={4}
              className="w-full px-[15px] pt-2.5 pb-[60px] bg-white rounded-[20px] border border-[#e6e6e6] text-black/60 text-xs font-medium "
              required
            />
          </div>

          <div className="mb-[20px]">
            <div className="flex items-center mb-[20px]">
              <input
                type="checkbox"
                id="sendToSpecific"
                className="mr-2"
              />
              <label htmlFor="sendToSpecific" className="text-black/60 text-xs font-medium ">
                Send to a specific person
              </label>
            </div>

            {/* React-Select for multi-select with chips */}
            <Select
              isMulti
              options={options}
              value={options.filter(option => formData.recipients.includes(option.value))}
              onChange={handleRecipientsChange}
              className="w-full  text-black/60 text-xs font-medium "
              classNamePrefix="react-select"
              placeholder="Select Name..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '44px', // Match the rounded style from your input
                  border: '1px solid #e6e6e6',
                  boxShadow: 'none',
                  width:'60%',
                  '&:hover': {
                    borderColor: '#e6e6e6',
                  },
                  padding: '2px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  width:'40%',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? '#e6f7ff' : 'white',
                  color: '#1c2329',
                  '&:active': {
                    backgroundColor: '#e6f7ff',
                  },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#1c2329',
                  borderRadius: '5px',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white',
                  padding: '4px 2px 4px 12px'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  margin:'4px 5px 4px 0px',
                  '&:hover': {
                    backgroundColor: '#1c2329',
                    color: 'white',
                  },
                }),
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#10375c] rounded-[5px] hover:opacity-0.2 px-[27px] py-5 text-white text-sm font-medium font-['Inter'] transition duration-200"
          >
            Send
          </button>
        </form>
          </div>
        </div>

        {/* Right Side - Promotional Banners */}
        <div className="w-full md:w-[40%]">
            <h2 className="text-[#10375c] text-3xl font-semibold mb-[20px]">Promotional Banners</h2>
          <div className="bg-white rounded-lg shadow-md p-[20px]">

            {/* Banner Grid */}
            <div className="grid grid-cols-2 gap-[15px] mb-[20px]">
              {isLoadingSettings ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-[4/3] rounded-[10px] bg-gray-200 animate-pulse"></div>
                ))
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <div key={banner.id} className="relative group">
                    <div className="aspect-[4/3] rounded-[10px] overflow-hidden bg-gray-100">
                      <Image
                        src={banner.url}
                        alt="Promotional Banner"
                        className="w-full h-full object-cover"
                        width={200}
                        height={150}
                      />
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-50"
                      >
                        <CrossIcon />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>No promotional banners uploaded yet.</p>
                  <p className="text-sm">Upload your first banner below!</p>
                </div>
              )}
            </div>

            {/* Upload Banner Button */}
            <div className="relative">
              <label
                htmlFor="bannerUpload"
                className={`flex items-center justify-center gap-[10px] w-full h-12 px-5 py-4 bg-[#10375c] rounded-[5px] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <EditIcon stroke="white" />
                {isUploading ? 'Uploading...' : 'Upload Banner'}
                <input
                  type="file"
                  id="bannerUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;