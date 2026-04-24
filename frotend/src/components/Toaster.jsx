// frontend/src/components/Common/Toast.jsx
// You can use the shadcn toast system directly
// This is just a wrapper for convenience

import toast from "react-hot-toast";

export const showToast = (message, type = 'default') => {
  toast({
    title: type === 'error' ? 'Error' : 'Success',
    description: message,
    variant: type === 'error' ? 'destructive' : 'default',
  });
};