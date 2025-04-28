import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    desc: '',
    stockQuantity: 0,
    price: 0,
    categoryId: 0,
    imgurl: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:7046/api/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProductId) {
      await updateProduct(editingProductId);
    } else {
      await createProduct();
    }
    setForm({
      productName: '',
      desc: '',
      stockQuantity: 0,
      price: 0,
      categoryId: 0,
      imgurl: '',
    });
    setEditingProductId(null);
    setShowModal(false);
    fetchProducts();
    alert('Product successfully added!');
  };

  const createProduct = async () => {
    try {
      await axios.post('https://localhost:7046/api/Product', form);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const updateProduct = async (id) => {
    try {
      await axios.put(`https://localhost:7046/api/Product/${id}`, form);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7046/api/Product/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingProductId(product.productId);
    setShowModal(true);
  };

  return (
    <div className="admin-products">
      <h1>Manage Products</h1>
      <button onClick={() => setShowModal(true)} className="add-product-button">Add Product</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <form onSubmit={handleSubmit} className="product-form">
              <input
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
              <input
                type="text"
                name="desc"
                value={form.desc}
                onChange={handleInputChange}
                placeholder="Description"
                required
              />
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleInputChange}
                placeholder="Stock Quantity"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              <input
                type="number"
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                placeholder="Category ID"
                required
              />
              <input
                type="text"
                name="imgurl"
                value={form.imgurl}
                onChange={handleInputChange}
                placeholder="Image URL"
              />
              <button type="submit">{editingProductId ? 'Update' : 'Add'} Product</button>
            </form>
          </div>
        </div>
      )}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.productId} className="product-item">
            <h3>{product.productName}</h3>
            <p>{product.desc}</p>
            <img src={product.imgurl} alt={product.productName} />
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stockQuantity}</p>
            {/* <p>Category ID: {product.categoryId}</p> */}
            <button className='b1' onClick={() => handleEdit(product)}>Edit</button>
            <button className='b2' onClick={() => deleteProduct(product.productId)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;