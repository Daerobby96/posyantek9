'use client'

import { CartItem, Product } from './types'

const CART_KEY = 'posyantek_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const cart = getCart()
  const existing = cart.find((item) => item.product.id === product.id)

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ product, quantity })
  }

  saveCart(cart)
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.product.id !== productId)
  saveCart(cart)
  return cart
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const item = cart.find((i) => i.product.id === productId)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      return removeFromCart(productId)
    }
  }
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0)
}
