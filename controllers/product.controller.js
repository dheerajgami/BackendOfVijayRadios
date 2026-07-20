import Product from "../model/product.model.js";
import ServerResponse from "../response/pattern.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(new ServerResponse(true, products, "Products fetched successfully", null));
  } catch (error) {
    res.status(500).json(new ServerResponse(false, null, "Server Error", null));
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(new ServerResponse(false, null, "Product not found", null));
    }
    res.status(200).json(new ServerResponse(true, product, "Product fetched successfully", null));
  } catch (error) {
    res.status(500).json(new ServerResponse(false, null, "Server Error", null));
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, category, brand, stock, isFeatured, status } = req.body;
    
    // Extract image paths from multer
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const product = new Product({
      name,
      description,
      price,
      mrp,
      category,
      brand,
      stock,
      images,
      isFeatured: isFeatured === 'true',
      status,
    });

    const createdProduct = await product.save();
    res.status(201).json(new ServerResponse(true, createdProduct, "Product created successfully", null));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ServerResponse(false, null, "Failed to create product", null));
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, mrp, category, brand, stock, isFeatured, status, existingImages } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json(new ServerResponse(false, null, "Product not found", null));
    }

    let parsedExistingImages = [];
    if (existingImages) {
        // If sent from formData, it might be a JSON string or an array
        parsedExistingImages = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
    }

    // New uploaded images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => `/uploads/${file.filename}`);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.mrp = mrp || product.mrp;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
    product.status = status || product.status;
    
    // Combine old images kept by user with new uploaded images
    product.images = [...parsedExistingImages, ...newImages];

    const updatedProduct = await product.save();
    res.status(200).json(new ServerResponse(true, updatedProduct, "Product updated successfully", null));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ServerResponse(false, null, "Failed to update product", null));
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json(new ServerResponse(false, null, "Product not found", null));
    }
    
    res.status(200).json(new ServerResponse(true, null, "Product removed", null));
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json(new ServerResponse(false, null, "Server Error", null));
  }
};
