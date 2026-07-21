import Product from "../model/product.model.js";

export const getProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return product;
};

export const createProduct = async (productData, files) => {
  const { name, description, price, mrp, category, brand, stock, isFeatured, status } = productData;
  
  // Extract image paths from multer
  let images = [];
  if (files && files.length > 0) {
    images = files.map((file) => `/uploads/${file.filename}`);
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

  return await product.save();
};

export const updateProduct = async (id, updateData, files) => {
  const { name, description, price, mrp, category, brand, stock, isFeatured, status, existingImages } = updateData;
  
  const product = await Product.findById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  let parsedExistingImages = [];
  if (existingImages) {
      // If sent from formData, it might be a JSON string or an array
      parsedExistingImages = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
  }

  // New uploaded images
  let newImages = [];
  if (files && files.length > 0) {
    newImages = files.map((file) => `/uploads/${file.filename}`);
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

  return await product.save();
};

export const deleteProduct = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  
  return deletedProduct;
};
