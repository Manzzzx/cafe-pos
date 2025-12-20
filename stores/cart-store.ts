import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
  variant?: {
    size?: string
    temperature?: string
  }
  notes?: string
}

interface CartStore {
  items: CartItem[]
  orderType: "dineIn" | "takeAway"
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateNotes: (id: string, notes: string) => void
  setOrderType: (type: "dineIn" | "takeAway") => void
  clearCart: () => void
  getTotal: () => number
  getTax: () => number
  getGrandTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: "dineIn" as "dineIn" | "takeAway",

      addItem: (item) => {
        const state = get()
        
        // Check if same product with same variant exists
        const existingIndex = state.items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variant?.size === item.variant?.size &&
            i.variant?.temperature === item.variant?.temperature
        )

        if (existingIndex !== -1) {
          // Merge: increment quantity
          const updatedItems = [...state.items]
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + item.quantity,
          }
          set({ items: updatedItems })
        } else {
          // Add new item
          const id = `${item.productId}-${item.variant?.size}-${item.variant?.temperature}-${Date.now()}`
          set({ items: [...state.items, { ...item, id }] })
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      updateNotes: (id, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        }))
      },

      setOrderType: (type) => set({ orderType: type }),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTax: () => {
        return get().getTotal() * 0.05
      },

      getGrandTotal: () => {
        return get().getTotal() + get().getTax()
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    }
  )
)