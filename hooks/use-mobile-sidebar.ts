import { create } from 'zustand'; 


/**
 * Represents the state and actions of a mobile sidebar.
 */
type MobileSidebarStore = {
    isOpen: boolean; 
    onOpen: () => void; 
    onClose: () => void;
}


/**
 * Custom hook for managing the state of a mobile sidebar.
 * @returns An object with properties and methods for controlling the mobile sidebar state.
 */
export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false, 
    onOpen: () => set({ isOpen: true }), 
    onClose: () => set({ isOpen: false })
}))
