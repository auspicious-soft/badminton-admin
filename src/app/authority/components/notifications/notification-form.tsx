"use client";
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { CrossIcon, EditIcon } from '@/utils/svgicons';
import { generateSignedUrlForBanners, deleteFileFromS3 } from '@/actions';
import { getImageClientS3URL } from '@/config/axios';
import { toast } from 'sonner';
import { validateImageFile } from '@/utils/fileValidation';
import { updateAdminSettings, getAdminSettings, getAllUsersForNotification, postNotification } from '@/services/admin-services';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { components, MultiValue, OptionProps } from 'react-select';
import UserProfile2 from "@/assets/images/images.png";
import { getProfileImageUrl } from "@/utils";

const Select = dynamic(() => import('react-select'), { ssr: false });

interface NotificationData {
  title: string;
  text: string;
  specificUsers: string[];
}

interface OptionType {
  value: string;
  label: string;
  profile?: string;
}

interface BannerImage {
  id: string;
  url: string;
  key: string;
  file?: File;
}

interface Template {
  Title: string;
  Description: string;
}

const NotificationForm = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: '',
    text: '',
    specificUsers: []
  });
  const { data: session } = useSession();
  const userRole = (session as any)?.user?.role;
  const [isUploading, setIsUploading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const templateSelectRef = useRef<any>(null);

  // Fetch existing admin settings including banners
  const { data: adminSettings, mutate: mutateAdminSettings, isLoading: isLoadingSettings } = useSWR(
    '/admin/admin-settings',
    getAdminSettings
  );
  const { data: userData } = useSWR(
    '/admin/custome-notification',
    getAllUsersForNotification
  );
  // Fetch templates
  const { data: templateData } = useSWR(
    '/admin/get-templates',
    getAllUsersForNotification
  );

  // Convert banner keys to BannerImage objects
  const banners: BannerImage[] = (adminSettings?.data?.data?.banners || []).map((key: string, index: number) => ({
    id: `${index}`,
    url: getImageClientS3URL(key),
    key: key
  }));

  const people = userData?.data?.data;
  // Convert people array to react-select options
  const userOptions: OptionType[] = people?.map(person => ({
    value: person._id,
    label: person.fullName,
    profile: person.profilePic !== null
                          ? getProfileImageUrl(person.profilePic)
                          : person.profilePic || UserProfile2
  })) || [];

  const templateOptions: OptionType[] = templateData?.data?.data?.map((template: Template) => ({
    value: template.Title,
    label: template.Title
  })) || [];

  // Custom Option component to display profile picture and name
  const CustomOption = ({ children, ...props }: OptionProps<OptionType>) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.profile && (
          <Image
            src={props.data.profile}
            alt={`${props.data.label} profile`}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
        )}
        <span>{children}</span>
      </div>
    </components.Option>
  );

  // Custom MultiValueLabel component to display profile picture and name in selected chips
  const CustomMultiValueLabel = ({ children, ...props }: any) => (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-2">
        {props.data.profile && (
          <Image
            src={props.data.profile}
            alt={`${props.data.label} profile`}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
        )}
        <span>{children}</span>
      </div>
    </components.MultiValueLabel>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      const selectedTemplate = templateData?.data?.data?.find((template: Template) => template.Title === selectedOption.value);
      if (selectedTemplate) {
        setFormData(prev => ({
          ...prev,
          title: selectedTemplate.Title,
          text: selectedTemplate.Description
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        text: ''
      }));
    }
  };

  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
    const recipients = selectedOptions?.map(option => option.value);
    setFormData(prev => ({
      ...prev,
      specificUsers: recipients
    }));
  };

  const removeRecipient = (name: string) => {
    setFormData(prev => ({
      ...prev,
      specificUsers: prev.specificUsers.filter(recipient => recipient !== name)
    }));
  };

  const uploadBannerToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      const { signedUrl, key } = await generateSignedUrlForBanners(
        fileName,
        file.type
      );

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

    const validation = validateImageFile(file, 5);
    if (!validation.isValid) {
      toast.error(validation.error);
      e.target.value = '';
      return;
    }

    try {
      const imageKey = await uploadBannerToS3(file);
      const currentBanners = adminSettings?.data?.data?.banners || [];
      const updatedBanners = [...currentBanners, imageKey];
      await updateAdminSettings({ banners: updatedBanners });
      await mutateAdminSettings();
      toast.success('Banner uploaded successfully');
    } catch (error) {
      console.error('Error uploading banner:', error);
    }

    e.target.value = '';
  };

  const handleDeleteBanner = async (bannerId: string) => {
    const banner = banners.find(b => b.id === bannerId);
    if (!banner) return;

    try {
      await deleteFileFromS3(banner.key);
      const currentBanners = adminSettings?.data?.data?.banners || [];
      const updatedBanners = currentBanners.filter((key: string) => key !== banner.key);
      await updateAdminSettings({ banners: updatedBanners });
      await mutateAdminSettings();
      toast.success('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await postNotification("/admin/custome-notification", formData);
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message);
        setFormData({
          title: '',
          text: '',
          specificUsers: []
        });
        if (templateSelectRef.current) {
          templateSelectRef.current.clearValue();
        }
        setIsCheck(false);
      } else {
        toast.error("Failed to create notification");
      }
    } catch (error) {
      toast.error("Failed to create notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid (title, text, and specific users when checkbox is checked)
  const isFormValid = formData.title.trim() !== '' && 
                     formData.text.trim() !== '' && 
                     (!isCheck || (isCheck && formData.specificUsers.length > 0));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-[20px]">
        <div className={`w-full ${userRole === 'employee' ? 'md:w-full' : 'md:w-[60%]'}`}>
          <h1 className="text-[#10375c] text-3xl font-semibold mb-[20px]">Notifications</h1>
          <div className="bg-white rounded-lg shadow-md px-[20px] pt-[20px] pb-[30px] mb-[15px]">
            <form onSubmit={handleSubmit}>
             {userRole === "employee" &&  <div className="flex flex-col gap-[10px] mb-[20px]">
                <label htmlFor="template" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                  Select Template
                </label>
                <Select
                  ref={templateSelectRef}
                  options={templateOptions}
                  onChange={handleTemplateChange}
                  isClearable
                  className="w-full text-black/60 text-xs font-medium"
                  classNamePrefix="react-select"
                  placeholder="Select a template..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '44px',
                      border: '1px solid #e6e6e6',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#e6e6e6',
                      },
                      padding: '2px',
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '8px',
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
                  }}
                />
              </div>
}
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
                  placeholder="Text here..."
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
                  placeholder="Text here..."
                  rows={4}
                  className="w-full px-[15px] pt-2.5 pb-[60px] bg-white rounded-[20px] border border-[#e6e6e6] text-black/60 text-xs font-medium"
                  required
                />
              </div>

              <div className="mb-[20px]">
                <div className="flex items-center mb-[20px]">
                  <input
                    type="checkbox"
                    id="sendToSpecific"
                    className="mr-2"
                    checked={isCheck}
                    onChange={(e) => setIsCheck(e.target.checked)}
                  />
                  <label htmlFor="sendToSpecific" className="text-black/60 text-xs font-medium">
                    Send to a specific person
                  </label>
                </div>
                {isCheck && (
                  <Select
                    isMulti
                    options={userOptions}
                    value={userOptions?.filter(option => formData.specificUsers.includes(option.value))}
                    onChange={handleRecipientsChange}
                    className="w-full text-black/60 text-xs font-medium"
                    classNamePrefix="react-select"
                    placeholder="Select Name..."
                    components={{ Option: CustomOption, MultiValueLabel: CustomMultiValueLabel }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '44px',
                        border: '1px solid #e6e6e6',
                        boxShadow: 'none',
                        width: '60%',
                        '&:hover': {
                          borderColor: '#e6e6e6',
                        },
                        padding: '2px',
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        width: '40%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? '#e6f7ff' : 'white',
                        color: '#1c2329',
                        '&:active': {
                          backgroundColor: '#e6f7ff',
                        },
                        padding: '8px 12px',
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#1c2329',
                        borderRadius: '5px',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: 'white',
                        padding: '4px 2px 4px 12px',
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: 'white',
                        margin: '4px 5px 4px 0px',
                        '&:hover': {
                          backgroundColor: '#1c2329',
                          color: 'white',
                        },
                      }),
                    }}
                  />
                )}
              </div>

              <button
                type="submit"
                className={`w-full bg-[#10375c] rounded-[5px] px-[27px] py-5 text-white text-sm font-medium font-['Inter'] transition duration-200 ${isSubmitting || !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {userRole !== 'employee' && (
          <div className="w-full md:w-[40%]">
            <h2 className="text-[#10375c] text-3xl font-semibold mb-[20px]">Promotional Banners</h2>
            <div className="bg-white rounded-lg shadow-md p-[20px]">
              <div className="grid grid-cols-2 gap-[15px] mb-[20px]">
                {isLoadingSettings ? (
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
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>No promotional banners uploaded yet.</p>
                    <p className="text-sm">Upload your first banner below!</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="bannerUpload"
                  className={`flex items-center justify-center gap-[10px] w-full h-12 px-5 py-4 bg-[#10375c] rounded-[5px] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        )}
      </div>
    </div>
  );
};

export default NotificationForm;