import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { Edit, Delete, Add, PhotoCamera } from '@mui/icons-material';
import { createProductAPI, updateProductAPI, deleteProductAPI, getAllProductsAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';


const ProductsManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    nutrition: {
      calories: '',
      sugar: '',
      caffeine: '',
      serving: ''
    },
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const result = await getAllProductsAPI();
      if (result.status === 200) {
        setProducts(result.data);
      } else {
        setError('Failed to fetch products');
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
      toast.error('Error fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.description || !newProduct.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate nutrition fields
      if (!newProduct.nutrition.calories || !newProduct.nutrition.sugar || !newProduct.nutrition.caffeine || !newProduct.nutrition.serving) {
        toast.error('Please fill in all nutrition information');
        return;
      }

      // Validate image
      if (!newProduct.image) {
        toast.error('Please upload a product image');
        return;
      }

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('stock', parseInt(newProduct.stock));
      formData.append('description', newProduct.description);
      formData.append('category', newProduct.category);
      formData.append('nutrition.calories', newProduct.nutrition.calories);
      formData.append('nutrition.sugar', newProduct.nutrition.sugar);
      formData.append('nutrition.caffeine', newProduct.nutrition.caffeine);
      formData.append('nutrition.serving', newProduct.nutrition.serving);

      if (newProduct.image) {
        // Convert base64 to file
        const response = await fetch(newProduct.image);
        const blob = await response.blob();
        formData.append('image', blob, 'product-image.png');
      }

      const result = await createProductAPI(formData);
      if (result.status === 201) {
        toast.success('Product added successfully');
        setShowAddModal(false);
        setNewProduct({
          name: '',
          price: '',
          stock: '',
          description: '',
          category: '',
          nutrition: {
            calories: '',
            sugar: '',
            caffeine: '',
            serving: ''
          },
          image: null
        });
        // Refresh products list
        fetchProducts();
      } else {
        toast.error(result.data?.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      id: product._id, // Ensure we're using the MongoDB _id
      nutrition: product.nutrition || {
        calories: '',
        sugar: '',
        caffeine: '',
        serving: ''
      }
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('price', editingProduct.price);
      formData.append('stock', editingProduct.stock);
      formData.append('description', editingProduct.description);
      formData.append('category', editingProduct.category);
      formData.append('nutrition.calories', editingProduct.nutrition.calories);
      formData.append('nutrition.sugar', editingProduct.nutrition.sugar);
      formData.append('nutrition.caffeine', editingProduct.nutrition.caffeine);
      formData.append('nutrition.serving', editingProduct.nutrition.serving);

      if (editingProduct.image && editingProduct.image.startsWith('data:')) {
        const response = await fetch(editingProduct.image);
        const blob = await response.blob();
        formData.append('image', blob, 'product-image.png');
      }

      const result = await updateProductAPI(editingProduct.id, formData);
      if (result.status === 200) {
        toast.success('Product updated successfully');
        setShowEditModal(false);
        setEditingProduct(null);
        // Update the products list with the updated product
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === editingProduct.id ? result.data.product : product
          )
        );
      } else {
        toast.error(result.data?.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        const result = await deleteProductAPI(productId);
        if (result.status === 200) {
          toast.success('Product deleted successfully');
          // Refresh products list
          fetchProducts();
        } else {
          toast.error(result.data?.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white mb-0">Products Management</h5>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <Add /> Add Product
            </Button>
          </div>
          <Table hover className="table-dark" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ width: '50px', height: '50px', position: 'relative' }}>
                      <img
                        src={`${SERVER_URL}/uploads/${product.image}`}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      {editProductId === product._id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            cursor: 'pointer'
                          }}
                          onClick={() => document.getElementById(`imageUpload-${product._id}`).click()}
                        >
                          <PhotoCamera sx={{ color: 'white' }} />
                          <input
                            type="file"
                            id={`imageUpload-${product._id}`}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditClick(product)}
                    >
                      <Edit fontSize="small" />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        contentClassName="bg-transparent"
        dialogClassName="mt-5"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Modal.Title className="text-white">Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Row>
            <Col md={6} className="text-center">
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => document.getElementById('newProductImage').click()}
              >
                {newProduct.image ? (
                  <img
                    src={newProduct.image}
                    alt="Product Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div className="text-white-50">
                    <PhotoCamera sx={{ fontSize: 40 }} />
                    <p>Click to upload image</p>
                  </div>
                )}
                <input
                  type="file"
                  id="newProductImage"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleNewImageChange}
                />
              </div>
              <Form.Group className="mt-3">
                <Form.Label>Nutrition Information</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Calories"
                      value={newProduct.nutrition.calories}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        nutrition: { ...prev.nutrition, calories: e.target.value }
                      }))}
                      className="mb-2"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Sugar"
                      value={newProduct.nutrition.sugar}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        nutrition: { ...prev.nutrition, sugar: e.target.value }
                      }))}
                      className="mb-2"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Caffeine"
                      value={newProduct.nutrition.caffeine}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        nutrition: { ...prev.nutrition, caffeine: e.target.value }
                      }))}
                      className="mb-2"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Serving Size"
                      value={newProduct.nutrition.serving}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        nutrition: { ...prev.nutrition, serving: e.target.value }
                      }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select Category</option>
                    <option value="Soft Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Soft Drinks</option>
                    <option value="Energy Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Energy Drinks</option>
                    <option value="Coffee" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Coffee</option>
                    <option value="Tea" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Tea</option>
                    <option value="Smoothies" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Smoothies</option>
                    <option value="Mocktails" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Mocktails</option>
                    <option value="Water" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Water</option>
                    <option value="Sports Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sports Drinks</option>
                    <option value="Wine" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Wine</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Button variant="outline-light" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleAddProduct();
            }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        contentClassName="bg-transparent"
        dialogClassName="mt-5"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Modal.Title className="text-white">Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        >
          {editingProduct && (
            <Row>
              <Col md={6} className="text-center">
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => document.getElementById('editProductImage').click()}
                >
                  {editingProduct.image ? (
                    <img
                      src={editingProduct.image.startsWith('data:') ? editingProduct.image : `${SERVER_URL}/uploads/${editingProduct.image}`}
                      alt="Product Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className="text-white-50">
                      <PhotoCamera sx={{ fontSize: 40 }} />
                      <p>Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="editProductImage"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleEditImageChange}
                  />
                </div>
                <Form.Group className="mt-3">
                  <Form.Label>Nutrition Information</Form.Label>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Calories"
                        value={editingProduct.nutrition.calories}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, calories: e.target.value }
                        }))}
                        className="mb-2"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Sugar"
                        value={editingProduct.nutrition.sugar}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, sugar: e.target.value }
                        }))}
                        className="mb-2"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Caffeine"
                        value={editingProduct.nutrition.caffeine}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, caffeine: e.target.value }
                        }))}
                        className="mb-2"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Serving Size"
                        value={editingProduct.nutrition.serving}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          nutrition: { ...prev.nutrition, serving: e.target.value }
                        }))}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select Category</option>
                      <option value="Soft Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Soft Drinks</option>
                      <option value="Energy Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Energy Drinks</option>
                      <option value="Coffee" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Coffee</option>
                      <option value="Tea" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Tea</option>
                      <option value="Smoothies" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Smoothies</option>
                      <option value="Mocktails" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Mocktails</option>
                      <option value="Water" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Water</option>
                      <option value="Sports Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sports Drinks</option>
                      <option value="Wine" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Wine</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: e.target.value }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Button variant="outline-light" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductsManagement;