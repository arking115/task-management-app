import { createPortal } from 'react-dom';
import React from 'react';

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

export default ModalPortal;
