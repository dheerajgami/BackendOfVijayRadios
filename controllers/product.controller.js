import * as productService from "../services/product.service.js";
import ServerResponse from "../response/pattern.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(new ServerResponse(true, products, "Products fetched successfully", null));
  } catch (error) {
    console.error("Error fetching products:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server Error", error.status ? null : error));
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(new ServerResponse(true, product, "Product fetched successfully", null));
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server Error", error.status ? null : error));
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const createdProduct = await productService.createProduct(req.body, req.files);
    res.status(201).json(new ServerResponse(true, createdProduct, "Product created successfully", null));
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Failed to create product", error.status ? null : error));
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body, req.files);
    res.status(200).json(new ServerResponse(true, updatedProduct, "Product updated successfully", null));
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Failed to update product", error.status ? null : error));
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json(new ServerResponse(true, null, "Product removed", null));
  } catch (error) {
    console.error("Delete product error:", error);
    const status = error.status || 500;
    res.status(status).json(new ServerResponse(false, null, error.status ? error.message : "Server Error", error.status ? null : error));
  }
};
