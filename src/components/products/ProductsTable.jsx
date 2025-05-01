import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { Edit, Trash2, Search, PlusCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import NewProductModal from "./NewProductModal";
import { getProducts } from '../../services/productService';
import { deleteProduct, updateProduct } from '../../services/adminService';
import toast from 'react-hot-toast';
import { useDebounce } from "../../hooks/useDebounce";

const ProductsTable = () => {
  // Data + filtering state
  const [productData, setProductData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm);

  // Modal state
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products on component mount and when debounced search term changes
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProducts({ 
        name: debouncedSearchTerm,
        // Add other filters as needed
      });
      setProductData(result.products);
      setFilteredProducts(result.products);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };

  const handleAddProduct = async (newProduct) => {
    try {
      await fetchProducts(); // Refresh the products list
      toast.success('Product added successfully');
      setIsNewProductModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => { setIsEditModalOpen(false); setSelectedProduct(null); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setSelectedProduct(null); };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      setLoading(true);
      // Convert formData to match API expectations
      const productData = {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock),
        existingImages: updatedProduct.existingImages || [],
        // Only include newImages if there are any
        ...(updatedProduct.newImages?.length > 0 && { newImages: updatedProduct.newImages })
      };
      
      await updateProduct(updatedProduct._id, productData);
      toast.success('Product updated successfully');
      await fetchProducts(); // Refresh the products list
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
      handleCloseEditModal();
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      await fetchProducts(); // Refresh the products list
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setLoading(false);
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="rounded-xl border dark:border-gray-700 border-gray-200 bg-opacity-50 dark:bg-gray-800 bg-white backdrop-blur-md mb-6">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-gray-200 text-gray-800">
            Products
          </h2>
          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
          >
            <PlusCircle className="size-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        className="bg-white dark:bg-gray-800 bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Product List
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500 border 
                border-gray-300 dark:border-gray-600"
              onChange={handleSearch}
              value={searchTerm}
            />
            <div className="absolute left-3 top-2.5">
              {isSearching && debouncedSearchTerm !== searchTerm ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
            No products found
          </div>
        ) : (
          <div className={`overflow-x-auto ${
            filteredProducts.length > 7 ? "max-h-96 overflow-y-auto" : ""
          }`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  {["Name", "Category", "Price", "Stock", "Sales", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex gap-2 items-center">
                      {product.imagesUrl && product.imagesUrl.length > 0 ? (
                        <div className="relative group h-10 w-10">
                          <img
                            src={product.imagesUrl[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {product.imagesUrl.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              +{product.imagesUrl.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {product.sales || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <button
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-2"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* MODALS */}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}
      {isDeleteModalOpen && selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          product={selectedProduct}
          onDelete={() => handleDeleteProduct(selectedProduct._id)}
        />
      )}
      {isNewProductModalOpen && (
        <NewProductModal
          onClose={() => setIsNewProductModalOpen(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </>
  );
};

export default ProductsTable;
