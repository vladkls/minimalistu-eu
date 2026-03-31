"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { BookingModal } from "./BookingModal";

const BookingModalContext = createContext<{ openModal: () => void }>({
  openModal: () => {},
});

export function useBookingModal() {
  return useContext(BookingModalContext);
}

export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);

  return (
    <BookingModalContext.Provider value={{ openModal }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingModalContext.Provider>
  );
}
