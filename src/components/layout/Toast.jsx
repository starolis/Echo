import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div role="alert" aria-live="assertive" aria-atomic="true" className={`fixed bottom-4 right-4 px-5 py-3 rounded-xl shadow-2xl z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white text-sm font-medium`}>
      {toast.msg}
    </div>
  );
}
