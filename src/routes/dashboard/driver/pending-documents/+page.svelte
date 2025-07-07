<!-- src/routes/admin/pending-documents/+page.svelte -->
<script lang="ts">
  import Clock from 'lucide-svelte/icons/clock';
  
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
	import { BadgeCheck, BadgeX, Briefcase, Eye, FileText, Mail, Phone, Search, User } from '@lucide/svelte';
	import { Filter } from 'lucide-svelte';
  
  export let data;
  
  let searchTerm = '';
  let selectedDocType = 'all';
  /**
	 * @type {{ documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null}
	 */
  let selectedDocument: { documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null = null;
  let showModal = false;
  let showRejectModal = false;
  let rejectComments = '';
  let approveComments = '';
  
  // Document type mapping for better display
  const docTypeLabels = {
    driverLicense: 'Driver License',
    ghanaCard: 'Ghana Card',
    profilePicture: 'Profile Picture',
    motorcycleImage: 'Motorcycle Image',
    addressProof: 'Address Proof'
  };

  const docTypeColors = {
    driverLicense: 'bg-blue-100 text-blue-800',
    ghanaCard: 'bg-green-100 text-green-800',
    profilePicture: 'bg-purple-100 text-purple-800',
    motorcycleImage: 'bg-orange-100 text-orange-800',
    addressProof: 'bg-red-100 text-red-800'
  };

  // Get documents from the data prop
  $: pendingDocuments = data.pendingDocumentVerifications || [];
  $: pendingCount = pendingDocuments.length;

  // Filter documents based on search and document type
  $: filteredDocuments = pendingDocuments.filter((/** @type {{ driverName: string; driverEmail: string; documentType: string; }} */ doc: { driverName: string; driverEmail: string; documentType: string; }) => {
    const matchesSearch = doc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.driverEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedDocType === 'all' || doc.documentType === selectedDocType;
    return matchesSearch && matchesType;
  });

  // Get unique document types for filter
  $: documentTypes = [...new Set(pendingDocuments.map((doc: { documentType: keyof typeof docTypeLabels }) => doc.documentType))] as (keyof typeof docTypeLabels)[];

  /**
	 * @param {string | number | Date} dateString
	 */
  function formatDate(dateString: string | number | Date) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
	 * @param {{ documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null} document
	 */
  function handleViewDocument(document: { documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null) {
    selectedDocument = document;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedDocument = null;
  }

  function handleReject(document: { documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null) {
    selectedDocument = document;
    showRejectModal = true;
    rejectComments = '';
  }

  function closeRejectModal() {
    showRejectModal = false;
    selectedDocument = null;
    rejectComments = '';
  }

  function handleApprove(document: { documentType: string | number; driverName: any; documentUrl: any; documentId: any; driverId: any; } | null) {
    selectedDocument = document;
    approveComments = '';
  }
</script>

<svelte:head>
  <title>Pending Document Verifications - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen w-[70vw] mx-auto bg-white rounded-3xl p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Document Verifications</h1>
          <p class="text-gray-600 mt-1">Review and approve pending driver documents</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
           <Clock  class='text-orange-600'/>
            <span class="text-orange-600 font-medium">{pendingCount} Pending</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative ">
           <Search class='absolute top-3 left-3 text-gray-400 size-5'/>
            <input
              type="text"
              placeholder="Search by driver name or email..."
              bind:value={searchTerm}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:none "
            />
          </div>
        </div>
        <div class="sm:w-64">
          <div class="relative">
            <Filter class='absolute top-3 left-2 text-gray-400 size-5' />
            <select
              bind:value={selectedDocType}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Document Types</option>
              {#each documentTypes as type}
                <option value={type}>{docTypeLabels[type]}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each filteredDocuments as document, index}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <!-- Document Type Badge -->
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-2xl text-[0.9rem] font-medium {docTypeColors[document.documentType as keyof typeof docTypeColors]}">
                {docTypeLabels[document.documentType as keyof typeof docTypeLabels]}
              </span>
             <FileText class='text-gray-400' />
            </div>

            <!-- Driver Info -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center space-x-3">
                <User class='size-5 text-gray-400' />
                <span class="font-medium text-gray-900">{document.driverName}</span>
              </div>
              <div class="flex items-center space-x-3">
                <Mail class='size-5 text-gray-400'/>
                <span class="text-sm text-gray-600">{document.driverEmail}</span>
              </div>
              <div class="flex items-center space-x-3">
               <Phone class='size-5 text-gray-400'/>
                <span class="text-sm text-gray-600">{document.driverPhone}</span>
              </div>
              <div class="flex items-center space-x-3">
               <Briefcase class='size-5 text-gray-400'/>
                <span class="text-sm text-gray-600">{formatDate(document.uploadedAt)}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                on:click={() => handleViewDocument(document)}
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
              >
               <Eye class='size-5 text-gray-500' />
                <span>View</span>
              </button>
              
              <form method="POST" action="?/approve" use:enhance class="flex-1">
                <input type="hidden" name="documentId" value={document.documentId} />
                <input type="hidden" name="documentType" value={document.documentType} />
                <input type="hidden" name="driverId" value={document.driverId} />
                <button
                  type="submit"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                 <BadgeCheck class='size-5 text-white' />
                  <span>Approve</span>
                </button>
              </form>
              
              <button
                on:click={() => handleReject(document)}
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <BadgeX class='size-5 text-white' />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if filteredDocuments.length === 0}
      <div class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p class="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    {/if}
  </div>
</div>

<!-- Document Viewer Modal -->

{#if showModal && selectedDocument}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" on:click={closeModal}>
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {docTypeLabels[selectedDocument.documentType as keyof typeof docTypeLabels]} - {selectedDocument.driverName}
          </h3>
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button
            on:click={closeModal}
            class="text-gray-400 hover:text-gray-600"
          >
            <FileText class=' size-6 text-gray-500' />
          </button>
        </div>
      </div>
      <div class="p-6">
        {#if selectedDocument.documentUrl}
          <div class="space-y-4">
            <img
              src={selectedDocument.documentUrl}
              alt={docTypeLabels[selectedDocument.documentType as keyof typeof docTypeLabels]}
              class="w-full rounded-lg border border-gray-200"
            />
            <div class="flex space-x-3">
              <form method="POST" action="?/approve" use:enhance class="flex-1">
                <input type="hidden" name="documentId" value={selectedDocument.documentId} />
                <input type="hidden" name="documentType" value={selectedDocument.documentType} />
                <input type="hidden" name="driverId" value={selectedDocument.driverId} />
                <button
                  type="submit"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Approve Document
                </button>
              </form>
              <button
                on:click={() => handleReject(selectedDocument)}
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reject Document
              </button>
            </div>
          </div>
        {:else}
          <div class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-gray-600">Document preview not available</p>
            <div class="flex space-x-3 mt-6">
              <form method="POST" action="?/approve" use:enhance class="flex-1">
                <input type="hidden" name="documentId" value={selectedDocument.documentId} />
                <input type="hidden" name="documentType" value={selectedDocument.documentType} />
                <input type="hidden" name="driverId" value={selectedDocument.driverId} />
                <button
                  type="submit"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Approve Document
                </button>
              </form>
              <button
                on:click={() => handleReject(selectedDocument)}
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reject Document
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Reject Modal with Comments -->
{#if showRejectModal && selectedDocument}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" on:click={closeRejectModal}>
    <div class="bg-white rounded-xl max-w-md w-full" on:click|stopPropagation>
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Reject Document
          </h3>
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button
            on:click={closeRejectModal}
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <form method="POST" action="?/reject" use:enhance on:submit={closeRejectModal}>
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Are you sure you want to reject this {docTypeLabels[selectedDocument.documentType as keyof typeof docTypeLabels]} for {selectedDocument.driverName}?
          </p>
          
          <div class="mb-4">
            <label for="rejectComments" class="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              id="rejectComments"
              name="comments"
              bind:value={rejectComments}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Provide reason for rejection..."
            ></textarea>
          </div>

          <input type="hidden" name="documentId" value={selectedDocument.documentId} />
          <input type="hidden" name="documentType" value={selectedDocument.documentType} />
          <input type="hidden" name="driverId" value={selectedDocument.driverId} />
          
          <div class="flex space-x-3">
            <button
              type="button"
              on:click={closeRejectModal}
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reject Document
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}