<script lang="ts">
    
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { QRCodeImage } from 'svelte-qrcode-image';
  
    interface Props {
      inputText: string;
      saveQRCode: () => void;
    }
  
    let { inputText, saveQRCode }: Props = $props();
  </script>
  
  <div class="mt-6 flex flex-col items-center justify-center space-y-4">
    <Dialog.Root>
      <Dialog.Trigger>
        <div class="cursor-pointer rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
          <p>Click for your Auth QR code</p>
        </div>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Your QR Code</Dialog.Title>
          <Dialog.Description>
            <div class="mt-4 flex justify-center">
              <QRCodeImage
                text={inputText}
                displayClass="h-96 w-96 rounded-md"
              />
            </div>
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </div>