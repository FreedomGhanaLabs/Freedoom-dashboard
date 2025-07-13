<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction, ActionResult } from '@sveltejs/kit';
  import { page } from '$app/stores';
  import type { SupportTicket, Message } from '$lib/ticketStore';
  import { addMessage, updateTicket } from '$lib/ticketStore';
  import { formatDistanceToNow } from 'date-fns';

  export let data: { ticket: SupportTicket };
  let newMessage = '';
  let closingNotes = '';
  let isSending = false;
  let errorMessage = '';

  type ActionData = { success: boolean; ticket?: SupportTicket; message?: string };

  const handleMessageSubmit: SubmitFunction = () => {
    isSending = true;
    errorMessage = '';
    return async ({ result, update }) => {
      if (result.type === 'success') {
        const actionData = result.data as ActionData;
        if (actionData?.success) {
          const newMessageData: Message = {
            sender: 'admin',
            senderId: 'current_admin_id',
            message: newMessage,
            attachments: [],
            createdAt: new Date().toISOString(),
            readAt: null,
            _id: crypto.randomUUID()
          };
          addMessage(data.ticket._id, newMessageData);
          if (actionData.ticket) {
            updateTicket(data.ticket._id, actionData.ticket);
          }
          newMessage = '';
          errorMessage = actionData.message || '';
        }
      } else if (result.type === 'failure') {
        const actionData = result.data as ActionData;
        errorMessage = actionData?.message || 'Failed to send message';
      } else if (result.type === 'error') {
        errorMessage = result.error?.message || 'An unexpected error occurred';
      }
      isSending = false;
      await update({ reset: false, invalidateAll: false });
    };
  };

  const handleCloseSubmit: SubmitFunction = () => {
    isSending = true;
    errorMessage = '';
    return async ({ result, update }) => {
      if (result.type === 'success') {
        const actionData = result.data as ActionData;
        if (actionData?.success && actionData.ticket) {
          updateTicket(data.ticket._id, actionData.ticket);
          errorMessage = actionData.message || '';
          closingNotes = '';
        }
      } else if (result.type === 'failure') {
        const actionData = result.data as ActionData;
        errorMessage = actionData?.message || 'Failed to close ticket';
      } else if (result.type === 'error') {
        errorMessage = result.error?.message || 'An unexpected error occurred';
      }
      isSending = false;
      await update({ reset: false, invalidateAll: false });
    };
  };

  const handleStatusSubmit: SubmitFunction = () => {
    isSending = true;
    errorMessage = '';
    return async ({ result, update }) => {
      if (result.type === 'success') {
        const actionData = result.data as ActionData;
        if (actionData?.success && actionData.ticket) {
          updateTicket(data.ticket._id, actionData.ticket);
          errorMessage = actionData.message || '';
        }
      } else if (result.type === 'failure') {
        const actionData = result.data as ActionData;
        errorMessage = actionData?.message || 'Failed to reopen ticket';
      } else if (result.type === 'error') {
        errorMessage = result.error?.message || 'An unexpected error occurred';
      }
      isSending = false;
      await update({ reset: false, invalidateAll: false });
    };
  };
</script>

<div class=" flex flex-row mx-auto p-6 space-x-3 max-w-7xl">
  <div class="bg-white shadow-xl rounded-lg max-w-4xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Ticket #{data.ticket.ticketNumber}: {data.ticket.subject}
      </h1>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-sm font-semibold 
          {data.ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
           data.ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
           data.ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : 
           'bg-yellow-100 text-yellow-800'}">
          {data.ticket.status}
        </span>
        {#if data.ticket.permissions.canReopen && data.ticket.status === 'closed'}
          <form action="?/updateStatus" method="POST" use:enhance={handleStatusSubmit}>
            <button
              type="submit"
              class="px-3 py-1 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              Reopen Ticket
            </button>
          </form>
        {/if}
      </div>
    </div>

    {#if errorMessage}
      <div class="mb-4 p-3 rounded-lg
        {errorMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
        {errorMessage}
      </div>
    {/if}

    {#if data.ticket.transactionDetails}
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Transaction Details</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p><strong>ID:</strong> {data.ticket.transactionDetails.id}</p>
          <p><strong>Type:</strong> {data.ticket.transactionDetails.type}</p>
          <p><strong>Amount:</strong> {data.ticket.transactionDetails.amount} {data.ticket.transactionDetails.currency}</p>
        </div>
      </div>
    {/if}

    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Description</h2>
      <p class="text-gray-600">{data.ticket.description}</p>
    </div>

    {#if data.ticket.attachments.length > 0}
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Attachments</h2>
        <div class="flex gap-4">
          {#each data.ticket.attachments as attachment}
            <a href={attachment.url} target="_blank" class="text-blue-600 hover:underline">
              {attachment.filename}
            </a>
          {/each}
        </div>
      </div>
    {/if}

    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Messages</h2>
      <div class="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {#each data.ticket.messages as message}
          <div class="flex {message.sender === 'driver' ? 'justify-start' : 'justify-end'}">
            <div class="max-w-[70%] p-4 rounded-lg 
              {message.sender === 'driver' ? 'bg-blue-50' : 'bg-green-50'}">
              <p class="text-sm text-gray-500 mb-1">
                {message.sender} • {formatDistanceToNow(new Date(message.createdAt))} ago
              </p>
              <p>{message.message}</p>
              {#if message.attachments.length > 0}
                <div class="mt-2">
                  {#each message.attachments as attachment}
                    <a href={attachment.url} target="_blank" class="text-blue-600 hover:underline">
                      {attachment.filename}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- {#if data.ticket.permissions.canClose && data.ticket.status !== 'closed'}
      <form action="?/close" method="POST" use:enhance={handleCloseSubmit} class="mt-6">
        <div class="relative">
          <textarea
            name="notes"
            bind:value={closingNotes}
            placeholder="Optional closing notes..."
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            rows="3"
            disabled={isSending}
          ></textarea>
          {#if isSending}
            <div class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
              <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          {/if}
        </div>
        <div class="flex justify-end mt-3 gap-2">
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            Close Ticket
          </button>
        </div>
      </form>
    {/if} -->
    <form action="?/resolve" method="POST" use:enhance={handleMessageSubmit} class="mt-6">
      <div class="relative">
        <textarea
          name="resolution"
          bind:value={newMessage}
          placeholder="Type your resolution message..."
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          rows="4"
          disabled={isSending}
        ></textarea>
        {#if isSending}
          <div class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        {/if}
      </div>
      <div class="flex justify-end mt-3 gap-2">
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!newMessage.trim() || isSending}
        >
          Send Resolution
        </button>
      </div>
    </form>
  </div>

    <div class=" bg-white p-4 space-y-3 flex flex-col max-w-3xl shadow-lg max-h-120  rounded-2xl gap-6 mb-8">
      <div>
        <h2 class="text-lg font-normal text-gray-400 mb-2">Creator</h2>
        <div class="space-y-2">
          <p><strong>Name:</strong> {data.ticket.creator.name}</p>
          <p><strong>Email:</strong> {data.ticket.creator.email}</p>
          <p><strong>User Type:</strong> {data.ticket.creator.userType}</p>
          {#if data.ticket.assignedAdmin}
            <p><strong>Assigned Admin:</strong> {data.ticket.assignedAdmin.email}</p>
          {/if}
        </div>
      </div>

      <div>
        <h2 class="text-lg font-normal text-gray-400 mb-2">Details</h2>
        <div class="space-y-2">
          <p><strong>Category:</strong> {data.ticket.category}</p>
          <p><strong>Subcategory:</strong> {data.ticket.subcategory}</p>
          <p><strong>Priority:</strong> {data.ticket.priority}</p>
          <p><strong>Service Type:</strong> {data.ticket.serviceType}</p>
          <p><strong>Created:</strong> {new Date(data.ticket.createdAt).toLocaleDateString()}</p>
          <p><strong>Updated:</strong> {formatDistanceToNow(new Date(data.ticket.updatedAt))} ago</p>
        </div>
      </div>

    </div>

</div>

