import { useEffect, useMemo, useState } from 'react'
import './App.css'

const Cart = () => {
    const [cart, setCart] = useState(null)
    const [itemsById, setItemsById] = useState({})
    const [quantities, setQuantities] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            const [cartResponse, itemsResponse] = await Promise.all([
                fetch('http://localhost:3000/cart'),
                fetch('http://localhost:3000/items'),
            ])

            if (!cartResponse.ok || !itemsResponse.ok) {
                throw new Error('Unable to load cart.')
            }

            const cartData = await cartResponse.json()
            const items = await itemsResponse.json()

            const index = {}
            items.forEach((item) => {
                index[item.id] = item
            })

            const quantityMap = {}
            cartData.items.forEach((entry) => {
                quantityMap[entry.id] = entry.quantity
            })

            setItemsById(index)
            setQuantities(quantityMap)
            setCart(cartData)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const total = useMemo(() => {
        if (!cart) return 0

        return cart.items.reduce((sum, entry) => {
            const item = itemsById[entry.itemId]
            if (!item) return sum
            return sum + Number(item.price) * Number(entry.quantity)
        }, 0)
    }, [cart, itemsById])

    const updateQuantity = async (cartItemId) => {
        const quantity = Number(quantities[cartItemId])
        if (!quantity || quantity < 1) {
            console.error('Invalid quantity:', quantity)
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/cart/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            })

            if (!response.ok) {
                throw new Error('Unable to update cart item.')
            }

            await loadData()
        } catch (err) {
            console.error('Error updating cart item:', err)
        }
    }

    const removeItem = async (cartItemId) => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${cartItemId}`, {
                method: 'DELETE',
            })

            if (!response.ok && response.status !== 204) {
                throw new Error('Unable to remove cart item.')
            }

            await loadData()
        } catch (err) {
            console.error('Error removing cart item:', err)
        }
    }

    return (
        <div className="cart">
            <h1>Cart</h1>
            <p>View and manage your cart items here.</p>

            {loading && <p>Loading cart...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <div className="cart-items">
                    {cart?.items?.length === 0 && <p>Your cart is empty.</p>}

                    {cart?.items?.map((entry) => {
                        const item = itemsById[entry.itemId]

                        return (
                            <div className="cart-item" key={entry.id}>
                                <img src={item?.image_url} alt={item?.name || 'Cart item'} className="item-image" />
                                <div className="cart-item-content">
                                    <h2>{item?.name || `Item ${entry.itemId}`}</h2>
                                    <p>Price: ${Number(item?.price || 0).toFixed(2)}</p>

                                    <div className="item-actions">
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[entry.id] ?? entry.quantity}
                                            onChange={(event) =>
                                                setQuantities((prev) => ({
                                                    ...prev,
                                                    [entry.id]: event.target.value,
                                                }))
                                            }
                                        />
                                        <button onClick={() => updateQuantity(entry.id)}>Update</button>
                                        <button onClick={() => removeItem(entry.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <h2>Total: ${total.toFixed(2)}</h2>
        </div>
    )
}

export default Cart