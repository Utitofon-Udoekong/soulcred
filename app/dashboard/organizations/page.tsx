'use client';

import { useWeb3 } from '@/app/providers/Web3Provider';
import { useEffect, useState } from 'react';
import { usePendingVerificationRequests } from '@/app/hooks/usePendingVerificationRequests';
import { useOrganizationDetails } from '@/app/hooks/useOrganizationDetails';

function RequestActionModal({
  isOpen,
  onClose,
  onSubmit,
  actionType,
  loading,
  hint
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
  actionType: 'approve' | 'reject';
  loading: boolean;
  hint: string;
}) {
  const [details, setDetails] = useState('');

  // Reset details when modal opens/closes
  useEffect(() => {
    if (isOpen) setDetails('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-[#e5e7eb]">
        <h3 className="text-lg font-semibold text-[#111418] mb-2">
          {actionType === 'approve' ? 'Approve Verification Request' : 'Reject Verification Request'}
        </h3>
        <p className="text-[#637488] text-sm mb-4">{hint}</p>
        <textarea
          className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
          placeholder={actionType === 'approve' ? 'e.g. Verified employment from Jan 2022 to Dec 2023.' : 'e.g. Insufficient evidence for claimed experience.'}
          value={details}
          onChange={e => setDetails(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#637488] hover:text-[#111418]"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(details)}
            disabled={!details.trim() || loading}
            className={`px-4 py-2 rounded ${!details.trim() || loading ? 'bg-[#f0f2f4] text-[#637488] cursor-not-allowed' : actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {loading ? (actionType === 'approve' ? 'Approving...' : 'Rejecting...') : (actionType === 'approve' ? 'Approve' : 'Reject')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrganizationPage() {
  const { 
    address, 
    registerOrganization,
    approveVerificationRequest,
    rejectVerificationRequest
  } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [modalRequestId, setModalRequestId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the new hook for organization details
  const { data: details, isLoading: loading, error: detailsError } = useOrganizationDetails(address || undefined);

  // Use the new hook for pending requests
  const { data: pendingRequests = [], isLoading: loadingRequests } = usePendingVerificationRequests();

  // Enhanced validation helper with regex
  const validateFields = (name: string, email: string, website: string) => {
    if (!name.trim()) return "Name is required";
    // Email regex: basic RFC 5322 compliant
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) return "Please enter a valid email address";
    // Website regex: requires http(s):// or www. and a domain
    const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
    if (!website.trim() || !websiteRegex.test(website)) return "Please enter a valid website URL (e.g. https://example.com)";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    // Frontend validation
    const errorMsg = validateFields(formData.name, formData.email, formData.website);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await registerOrganization(formData.name, formData.email, formData.website);
      // Query will refetch automatically on event
    } catch (err: unknown) {
      console.error('Error registering organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to register organization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (action: 'approve' | 'reject', requestId: number) => {
    setModalAction(action);
    setModalRequestId(requestId);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setModalRequestId(null);
    setModalLoading(false);
  };

  const handleApproveRequest = (requestId: number) => {
    openModal('approve', requestId);
  };

  const handleRejectRequest = (requestId: number) => {
    openModal('reject', requestId);
  };

  const handleModalSubmit = async (details: string) => {
    if (!modalRequestId || !modalAction) return;
    setModalLoading(true);
    setError(null);
    try {
      if (modalAction === 'approve') {
        await approveVerificationRequest(modalRequestId, details);
      } else {
        await rejectVerificationRequest(modalRequestId, details);
      }
      // Refresh pending requests
      closeModal();
    } catch (err: unknown) {
      setModalLoading(false);
      console.error('Error handling request:', err);
      setError(err instanceof Error ? err.message : 'Failed to process request');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1978e5]"></div>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {detailsError.toString()}
        </div>
      </div>
    );
  }

  if (!details || !details.exists) {
    return (
      <div className=" p-6">
        <h1 className="text-2xl font-bold text-[#111418] mb-6">Register Organization</h1>
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#111418] mb-2 font-medium">Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-[#111418] mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                placeholder="Enter organization email"
              />
            </div>
            <div>
              <label className="block text-[#111418] mb-2 font-medium">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                required
                className="w-full bg-[#f0f2f4] border-none rounded px-3 py-2 text-[#111418] focus:outline-none focus:ring-2 focus:ring-[#1978e5]"
                placeholder="Enter organization website"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 rounded ${
                submitting
                  ? 'bg-[#f0f2f4] text-[#637488] cursor-not-allowed'
                  : 'bg-[#1978e5] hover:bg-[#1978e5]/90 text-white'
              }`}
            >
              {submitting ? 'Registering...' : 'Register Organization'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Use details for status rendering
  const status = {
    name: details?.name || '',
    email: details?.email || '',
    website: details?.website || '',
    isVerified: details?.isVerified || false,
    verificationTimestamp: details?.verificationTimestamp || 0,
    lastUpdateTimestamp: details?.lastUpdateTimestamp || 0,
    exists: details?.exists || false,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#111418] mb-8">Organization Dashboard</h1>
      {/* Organization Status */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-6 mx-auto mb-6">
        <div className="flex items-center mb-4">
          <span className={`w-3 h-3 rounded-full mr-2 ${status.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span className="text-[#111418] font-semibold text-lg">{status.name}</span>
          {status.isVerified ? (
            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded bg-[#e6f4ea] text-[#1e7e34]">Verified</span>
          ) : (
            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded bg-[#fffbe6] text-[#bfa800]">Pending</span>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-[#637488]">Email</dt>
          <dd className="text-[#111418] break-all">{status.email}</dd>
          <dt className="text-[#637488]">Website</dt>
          <dd>
            <a href={status.website} target="_blank" rel="noopener noreferrer" className="text-[#1978e5] hover:underline break-all">
              {status.website}
            </a>
          </dd>
          <dt className="text-[#637488]">Last Updated</dt>
          <dd className="text-[#111418]">{new Date(status.lastUpdateTimestamp * 1000).toLocaleString()}</dd>
          {status.isVerified && (
            <>
              <dt className="text-[#637488]">Verified On</dt>
              <dd className="text-[#111418]">{new Date(status.verificationTimestamp * 1000).toLocaleString()}</dd>
            </>
          )}
        </dl>
      </div>
      {/* Pending Verification Requests */}
      {status.isVerified && (
        <div className="bg-white rounded-lg border border-[#e5e7eb] overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#111418] mb-4">Pending Verification Requests</h2>
            {loadingRequests ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1978e5]"></div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <p className="text-[#637488] text-center py-4">No pending verification requests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e5e7eb]">
                  <thead className="bg-[#f0f2f4]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#637488] uppercase">Resume ID</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#637488] uppercase">Entry ID</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#637488] uppercase">Details</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#637488] uppercase">User</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#637488] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#e5e7eb]">
                    {pendingRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-2 text-[#111418]">{request.resumeId}</td>
                        <td className="px-4 py-2 text-[#111418]">{request.entryId}</td>
                        <td className="px-4 py-2 text-[#637488]">{request.details}</td>
                        <td className="px-4 py-2 text-[#637488] break-all">{request.user}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="px-3 py-1 bg-[#e6f4ea] hover:bg-[#c3e6cb] text-[#1e7e34] rounded text-xs mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-3 py-1 bg-[#fff0f0] hover:bg-[#ffd6d6] text-[#d32f2f] rounded text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <RequestActionModal
            isOpen={modalOpen}
            onClose={closeModal}
            onSubmit={handleModalSubmit}
            actionType={modalAction || 'approve'}
            loading={modalLoading}
            hint={modalAction === 'approve' ? 'Describe what you verified about this entry. For example: "Verified employment from Jan 2022 to Dec 2023."' : 'State the reason for rejection. For example: "Insufficient evidence for claimed experience."'}
          />
        </div>
      )}
    </div>
  );
} 