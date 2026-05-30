import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const Home = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await fetch('http://localhost:3000/items')
                if (!response.ok) {
                    throw new Error('Unable to load products.')
                }
                const data = await response.json()
                setItems(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadItems()
    }, [])

    const addToCart = async (itemId) => {
        try {
            const response = await fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, quantity: 1 }),
            })

            if (!response.ok) {
                throw new Error('Unable to add item to cart.')
            }

        } catch (err) {
            console.error('Error adding item to cart:', err)
        }
    }

  return (
    <div className="home">
            <h1>Welcome to Our E-Commerce Store</h1>
            <p>Discover amazing products at unbeatable prices.</p>

            {loading && <p>Loading products...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <div className="items">
                    {items.map((item) => (
                        <div className="item" key={item.id}>
                            <img src={item.image_url} alt={item.name} className="item-image" />
                            <h2>{item.name}</h2>
                            <p>{item.description}</p>
                            <p>Price: ${Number(item.price).toFixed(2)}</p>
                            <div className="item-actions">
                                <Link to={`/items/${item.id}`}>View Details</Link>
                                <button onClick={() => addToCart(item.id)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
    </div>
    )
}

export default Home