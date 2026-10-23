import React from 'react';

export const MobileNavigation = ({ isOpen, onClose }) => {
  return (
    <div
      className={`mobile-overlay ${isOpen ? 'active' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    />
  );
};
