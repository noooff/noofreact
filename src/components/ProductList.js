import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://noufapi-5cc267ed7086.herokuapp.com/api/products');
            setProducts(response.data); // Assuming your API returns an array of products
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="product-list-container">
            <h1>Product List</h1>
            <div className='container'>
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>
                    {products.map(product => (
                        <div className="col" key={product.product_id}>
                            <div className="card shadow-sm">
                                <img src={`https://noufapi-5cc267ed7086.herokuapp.com/uploads/${product.image_url}`} alt={product.name} className="product-image" />
 
                                <div className="card-body">
                                    <h5>{product.name}</h5>
                                    <p className="card-text">{product.description}</p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-outline-secondary">Category ID: {product.categoryid}</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                        </div>
                                        <small className="text-body-secondary">${product.price}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
