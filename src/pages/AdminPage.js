import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    categoryid: ''
  });
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productIdToUpdate, setProductIdToUpdate] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://oufapi-5cc267ed7086.herokuapp.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', formData.image);
    data.append('categoryid', formData.categoryid);

    try {
      const response = await axios.post('https://oufapi-5cc267ed7086.herokuapp.com/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Handle successful product addition response
      setError(null);
      fetchProducts(); // Refresh products list after adding a new product
      resetForm();
    } catch (error) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    console.log('Deleting product with id:', productId);
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');

    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://oufapi-5cc267ed7086.herokuapp.com/api/products/${productId}`);
        console.log('Product deleted:', response.data);
        fetchProducts();
      } catch (error) {
        setError('Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('categoryid', formData.categoryid);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`https://oufapi-5cc267ed7086.herokuapp.com/api/products/${productIdToUpdate}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Handle successful product update response
      setError(null);
      fetchProducts(); // Refresh products list after updating a product
      setIsUpdating(false); // Close the update form/modal
      resetForm();
    } catch (error) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryid: product.categoryid
    });
    setProductIdToUpdate(product.product_id);
    setIsUpdating(true);
  };

  const handleCancelUpdate = () => {
    resetForm();
    setIsUpdating(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      categoryid: ''
    });
    setProductIdToUpdate(null);
  };

  return (
    <div className='container'>
      <h1>Admin Panel - Manage Products</h1>

      {/* Form to add or update a product */}
      <form onSubmit={isUpdating ? handleUpdateProduct : handleAddProduct}>
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
        </div>
        <div>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            required={!isUpdating} // Only required when adding a new product
          />
        </div>
        <div>
          <input
            type="text"
            name="categoryid"
            value={formData.categoryid}
            onChange={handleChange}
            placeholder="Category ID"
            required
          />
        </div>
        <button type="submit">{isUpdating ? 'Update Product' : 'Add Product'}</button>
        {isUpdating && <button type="button" onClick={handleCancelUpdate}>Cancel</button>}
      </form>

      {/* Display list of products */}
      <div>
        <h2>Products</h2>
        {products.map((product) => (
          <div key={product.product_id}>
            <p>{product.name} - {product.description} - ${product.price}</p>
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
          </div>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AdminPage;
