"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ResumeMetadata, EntryType, ResumeEntry, EntryTypeEnum } from "@/app/lib/types";
import { useWeb3 } from "@/app/providers/Web3Provider";

// Add helper functions from create page
const entryTypeToString = (type: EntryTypeEnum): EntryType => {
  const mapping: Record<EntryTypeEnum, EntryType> = {
    [EntryTypeEnum.WORK]: 'work',
    [EntryTypeEnum.EDUCATION]: 'education',
    [EntryTypeEnum.CERTIFICATION]: 'certification',
    [EntryTypeEnum.PROJECT]: 'project',
    [EntryTypeEnum.AWARD]: 'award'
  };
  return mapping[type];
};

// Add new type for file attachments
type FileAttachment = {
  file: File;
  preview?: string;
};

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { getResumeById, saveResume, isLoading: web3Loading } = useWeb3();
  const [resumeMetadata, setResumeMetadata] = useState<ResumeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'edit' | 'preview'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileAttachments, setFileAttachments] = useState<{ [key: string]: FileAttachment[] }>({});
  const [resumeName, setResumeName] = useState('My Professional Resume');
  const [resumeVersion, setResumeVersion] = useState('1.0');

  // Load resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const result = await getResumeById(id);
        if (!result) {
          setError("Resume not found");
          return;
        }
        setResumeMetadata(result);
      } catch (error) {
        console.error("Error fetching resume:", error);
        setError("Failed to load resume. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchResume();
    }
  }, [id, getResumeById]);

  // Add function to handle file uploads
  const handleFileUpload = (entryIndex: number, files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFileAttachments(prev => ({
      ...prev,
      [entryIndex]: [...(prev[entryIndex] || []), ...newFiles]
    }));
  };

  // Modify save function to handle file uploads
  const handleSaveResume = async () => {
    if (!resumeMetadata) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Convert file attachments to IPFS URLs
      const updatedEntries = await Promise.all(resumeMetadata.entries.map(async (entry, index) => {
        const fileAttachmentsForEntry = fileAttachments[index] || [];
        const ipfsUrls = await Promise.all(fileAttachmentsForEntry.map(async (fileAttachment) => {
          // TODO: Implement actual IPFS upload here
          // For now, we'll just use a placeholder
          return `ipfs://${fileAttachment.file.name}`;
        }));

        return {
          ...entry,
          attachments: [...(entry.attachments || []), ...ipfsUrls]
        };
      }));

      const updatedResumeMetadata = {
        ...resumeMetadata,
        entries: updatedEntries
      };
      
      const transactionHash = await saveResume(id, updatedResumeMetadata);
      if (transactionHash) {
        router.push(`/dashboard/resume/${id}`);
      } else {
        setError("Failed to save resume. Please try again.");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setError("Failed to save resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    setCurrentStep('preview');
  };

  // Handle back to edit
  const handleBackToEdit = () => {
    setCurrentStep('edit');
  };

  // Handle cancel
  const handleCancel = () => {
    router.push(`/dashboard/credentials/${id}`);
  };

  if (loading || web3Loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1978e5]"></div>
        <p className="mt-4 text-gray-600">Loading resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!resumeMetadata) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">No resume found for this address.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Edit step
  if (currentStep === 'edit') {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#111418]">Edit Credential</h1>
              <p className="text-[#637488] mt-2">Make changes to your credential</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#f0f2f4] text-[#111418] rounded hover:bg-[#f0f2f4]/90"
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-[#1978e5] text-white rounded hover:bg-[#1978e5]/90"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-[#e5e7eb]">
            <h2 className="text-xl font-semibold mb-6 text-[#111418]">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-2">
                  Resume Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                  placeholder="My Professional Resume"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-2">
                  Resume Version
                </label>
                <input
                  type="text"
                  value={resumeVersion}
                  onChange={(e) => setResumeVersion(e.target.value)}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                  placeholder="1.0"
                />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-[#e5e7eb]">
            <h2 className="text-xl font-semibold mb-6 text-[#111418]">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={resumeMetadata.profile.name}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, name: e.target.value }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Bio
                </label>
                <textarea
                  value={resumeMetadata.profile.bio}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, bio: e.target.value }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  value={resumeMetadata.profile.skills?.join(', ') || ''}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, skills: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                  placeholder="Enter skills separated by commas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resumeMetadata.profile.email}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, email: e.target.value }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resumeMetadata.profile.phone}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, phone: e.target.value }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={resumeMetadata.profile.location}
                  onChange={(e) => setResumeMetadata(prev => ({
                    ...prev!,
                    profile: { ...prev!.profile, location: e.target.value }
                  }))}
                  className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#637488] mb-1">
                  Social Links
                </label>
                <div className="space-y-2">
                  {Object.entries(resumeMetadata.profile.socialLinks || {}).map(([platform, url]) => (
                    <div key={platform} className="flex gap-2">
                      <input
                        type="text"
                        value={platform}
                        onChange={(e) => {
                          const newSocialLinks = { ...(resumeMetadata.profile.socialLinks || {}) };
                          delete newSocialLinks[platform];
                          newSocialLinks[e.target.value] = url;
                          setResumeMetadata(prev => ({
                            ...prev!,
                            profile: { ...prev!.profile, socialLinks: newSocialLinks }
                          }));
                        }}
                        className="w-1/3 bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                        placeholder="Platform"
                      />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newSocialLinks = { ...(resumeMetadata.profile.socialLinks || {}) };
                          newSocialLinks[platform] = e.target.value;
                          setResumeMetadata(prev => ({
                            ...prev!,
                            profile: { ...prev!.profile, socialLinks: newSocialLinks }
                          }));
                        }}
                        className="w-2/3 bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                        placeholder="URL"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newSocialLinks = { ...(resumeMetadata.profile.socialLinks || {}), '': '' };
                      setResumeMetadata(prev => ({
                        ...prev!,
                        profile: { ...prev!.profile, socialLinks: newSocialLinks }
                      }));
                    }}
                    className="text-[#1978e5] hover:text-[#125bb5] text-sm"
                  >
                    + Add Social Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Entries */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-[#e5e7eb]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#111418]">Entries</h2>
              <button
                onClick={() => {
                  const newEntry: ResumeEntry = {
                    id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    type: entryTypeToString(EntryTypeEnum.WORK),
                    title: '',
                    company: '',
                    description: '',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    verified: false,
                    attachments: []
                  };
                  setResumeMetadata(prev => ({
                    ...prev!,
                    entries: [...prev!.entries, newEntry]
                  }));
                }}
                className="px-4 py-2 bg-[#1978e5] text-white rounded hover:bg-[#125bb5]"
              >
                + Add Entry
              </button>
            </div>
            <div className="space-y-6">
              {resumeMetadata.entries.map((entry, index) => (
                <div key={index} className="border-b border-[#e5e7eb] pb-6 last:border-0">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#637488] mb-1">
                        Entry Type
                      </label>
                      <select
                        value={entry.type}
                        onChange={(e) => {
                          const newEntries = [...resumeMetadata.entries];
                          newEntries[index] = { ...entry, type: e.target.value as EntryType };
                          setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                        }}
                        className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                      >
                        <option value={entryTypeToString(EntryTypeEnum.WORK)}>Work Experience</option>
                        <option value={entryTypeToString(EntryTypeEnum.EDUCATION)}>Education</option>
                        <option value={entryTypeToString(EntryTypeEnum.CERTIFICATION)}>Certification</option>
                        <option value={entryTypeToString(EntryTypeEnum.PROJECT)}>Project</option>
                        <option value={entryTypeToString(EntryTypeEnum.AWARD)}>Award</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#637488] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => {
                          const newEntries = [...resumeMetadata.entries];
                          newEntries[index] = { ...entry, title: e.target.value };
                          setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                        }}
                        className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#637488] mb-1">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={entry.company}
                        onChange={(e) => {
                          const newEntries = [...resumeMetadata.entries];
                          newEntries[index] = { ...entry, company: e.target.value };
                          setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                        }}
                        className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#637488] mb-1">
                        Description
                      </label>
                      <textarea
                        value={entry.description}
                        onChange={(e) => {
                          const newEntries = [...resumeMetadata.entries];
                          newEntries[index] = { ...entry, description: e.target.value };
                          setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                        }}
                        className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#637488] mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={entry.startDate}
                          onChange={(e) => {
                            const newEntries = [...resumeMetadata.entries];
                            newEntries[index] = { ...entry, startDate: e.target.value };
                            setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                          }}
                          className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#637488] mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={entry.endDate}
                          onChange={(e) => {
                            const newEntries = [...resumeMetadata.entries];
                            newEntries[index] = { ...entry, endDate: e.target.value };
                            setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                          }}
                          className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#637488] mb-1">
                        Attachments
                      </label>
                      <div className="space-y-2">
                        {/* Existing IPFS URLs */}
                        {entry.attachments?.map((attachment, attachmentIndex) => (
                          <div key={attachmentIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={attachment}
                              onChange={(e) => {
                                const newEntries = [...resumeMetadata.entries];
                                const newAttachments = [...(entry.attachments || [])];
                                newAttachments[attachmentIndex] = e.target.value;
                                newEntries[index] = { ...entry, attachments: newAttachments };
                                setResumeMetadata(prev => ({ ...prev!, entries: newEntries }));
                              }}
                              className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                              placeholder="IPFS URI"
                            />
                          </div>
                        ))}
                        {/* File attachments */}
                        {(fileAttachments[index] || []).map((fileAttachment, fileIndex) => (
                          <div key={fileIndex} className="flex items-center gap-2">
                            <span className="text-sm text-[#637488]">
                              {fileAttachment.file.name}
                            </span>
                            <button
                              onClick={() => {
                                setFileAttachments(prev => ({
                                  ...prev,
                                  [index]: prev[index].filter((_, i) => i !== fileIndex)
                                }));
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {/* File upload input */}
                        <div className="mt-2">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(index, e.target.files)}
                            className="hidden"
                            id={`file-upload-${index}`}
                            multiple
                          />
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="inline-flex items-center px-4 py-2 border border-[#e5e7eb] rounded-md shadow-sm text-sm font-medium text-[#637488] bg-[#f0f2f4] hover:bg-[#e5e7eb] cursor-pointer"
                          >
                            Upload Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview step
  return (
    <div className="min-h-screen bg-[#f0f2f4] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111418]">Preview Resume</h1>
            <p className="text-[#637488] mt-2">Review your changes before saving</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBackToEdit}
              className="px-4 py-2 bg-[#f0f2f4] text-[#111418] rounded hover:bg-[#e5e7eb]"
            >
              Back to Edit
            </button>
            <button
              onClick={handleSaveResume}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#1978e5] text-white rounded hover:bg-[#125bb5] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Basic Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111418]">{resumeName}</h2>
            <p className="text-[#637488]">Version {resumeVersion}</p>
          </div>

          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111418] mb-2">{resumeMetadata.profile.name}</h2>
            <p className="text-[#637488] mb-4">{resumeMetadata.profile.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {resumeMetadata.profile.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#f0f2f4] text-[#111418] text-sm rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-[#637488]">
              {resumeMetadata.profile.email && (
                <div>
                  <span className="font-medium text-[#111418]">Email:</span> {resumeMetadata.profile.email}
                </div>
              )}
              {resumeMetadata.profile.phone && (
                <div>
                  <span className="font-medium text-[#111418]">Phone:</span> {resumeMetadata.profile.phone}
                </div>
              )}
              {resumeMetadata.profile.location && (
                <div>
                  <span className="font-medium text-[#111418]">Location:</span> {resumeMetadata.profile.location}
                </div>
              )}
            </div>
            {Object.entries(resumeMetadata.profile.socialLinks || {}).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(resumeMetadata.profile.socialLinks || {}).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1978e5] hover:underline text-sm"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Entries Section */}
          <div className="space-y-6">
            {resumeMetadata.entries.map((entry, index) => (
              <div key={index} className="border-b border-[#e5e7eb] pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#1978e5]">{entry.type}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#111418]">{entry.title}</h3>
                <p className="text-lg text-[#637488]">{entry.company}</p>
                <p className="text-[#637488]">
                  {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate === 'Present' ? 'Present' : new Date(entry.endDate).toLocaleDateString()}
                </p>
                <p className="mt-2 text-[#637488]">{entry.description}</p>
                {entry.attachments && entry.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-[#637488] mb-2">Attachments:</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.attachments.map((attachment, attachmentIndex) => (
                        <a
                          key={attachmentIndex}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1978e5] hover:underline text-sm"
                        >
                          Attachment {attachmentIndex + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 