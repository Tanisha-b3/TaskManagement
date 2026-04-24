// frontend/src/components/Common/Loader.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Loader;