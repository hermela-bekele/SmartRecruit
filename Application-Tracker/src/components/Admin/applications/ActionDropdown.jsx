import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function ActionDropdown({ 
  isOpen, 
  onClose, 
  triggerButton, 
  onStatusChange, 
  onDelete,
  candidateId 
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          triggerButton && !triggerButton.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerButton]);

  if (!isOpen || !triggerButton) return null;

  const buttonRect = triggerButton.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - buttonRect.bottom;
  const shouldShowAbove = spaceBelow < 200;

  const dropdownStyle = {
    position: 'fixed',
    top: shouldShowAbove 
      ? `${buttonRect.top - 200}px` 
      : `${buttonRect.bottom + 8}px`,
    left: `${buttonRect.right - 192}px`,
    zIndex: 1000,
  };

  return createPortal(
    <div 
      ref={dropdownRef}
      className="w-48 bg-white rounded-lg shadow-xl border border-slate-200"
      style={dropdownStyle}
    >
      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
        <button
          onClick={() => onStatusChange(candidateId, "Received")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Received
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "UnderReview")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Under Review
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Shortlisted")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Shortlisted
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Assessment")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Assessment
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Interview")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Interview
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Offer")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Offer
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Hired")}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Hired
        </button>
        <button
          onClick={() => onStatusChange(candidateId, "Reject")}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Reject
        </button>
        <button
          onClick={() => onDelete(candidateId)}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ActionDropdown; 