import { create } from "zustand";

/**
 * Represents the state of a pro modal.
 */
type ProModalStore = {
  isOpen: boolean; // Whether the modal is open or not.
  onOpen: () => void; // Function to open the modal.
  onClose: () => void; // Function to close the modal.
};

/**
 * Custom hook for managing a pro modal.
 * @returns An object containing the state and functions for managing the pro modal.
 */
export const useProModal = create<ProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
