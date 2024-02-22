import { create } from 'zustand'; 


/**
 * Represents the state of a card modal.
 */
type CardModalStore = {
    id?: string; // The id of the card to display in the modal.
    isOpen: boolean;  // Whether the modal is open or not.
    onOpen: (id: string) => void;  // Function to open the modal.
    onClose: () => void; // Function to close the modal.
}



/**
 * Custom hook for managing a card modal.
 * @returns An object containing the state and functions for managing the card modal.
 */
export const useCardModal = create<CardModalStore>((set) => ({
    id: undefined,
    isOpen: false, 
    onOpen: (id: string) => set({ isOpen: true, id }), // Open the modal and set the id.
    onClose: () => set({ isOpen: false, id: undefined }) // Close the modal and reset the id.
}))
