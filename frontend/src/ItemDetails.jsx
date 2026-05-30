import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './App.css'

const ItemDetails = () => {
    const { itemId } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadItem = async () => {
            try {
                const response = await fetch(`http://localhost:3000/items/${itemId}`)
                if (!response.ok) {
                    throw new Error('Product not found.')
                }
                const data = await response.json()
                setItem(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadItem()
    }, [itemId])

    const addToCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, quantity: 1 }),
            })

            if (!response.ok) {
                throw new Error('Unable to add item to cart.')
            }

            navigate('/cart')
        } catch (err) {
            console.error('Error adding item to cart:', err)
        }
    }

    if (loading) return <p>Loading product...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="item-details">
            <img src={item.image_url} alt={item.name} className="item-image item-image-large" />
            <h1>{item.name}</h1>
            <p>Price: ${Number(item.price).toFixed(2)}</p>
            <p>Description: {item.description}</p>
            <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
        </div>
    )
}

export default ItemDetails