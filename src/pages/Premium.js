import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import {
  EditIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import './Product.css'; // Import your custom CSS file for styling

const ProductsAll = () => {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({
    Name: '',
    Description: '',
    CostPrice: '',
    EatOutPrice: '',
    SalePrice: '',
    Supplier: '',
    product_image: ''
  });

  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('https://thevesttobackend.vercel.app/web/pincode/get-all-pincode', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setData(response.data.data);
      setTotalResults(response.data.data.length);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, resultsPerPage]);

  const onPageChange = (p) => {
    setPage(p);
  };

  async function openDeleteModal(productId) {
    let product = data.find((product) => product.Id === productId);
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeDeleteModal() {
    setIsModalOpen(false);
  }

  const handleDeleteProduct = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`https://thevesttobackend.vercel.app/web/product/delete/${selectedDeleteProduct.Id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setData(data.filter((product) => product.Id !== selectedDeleteProduct.Id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  async function openEditModal(productId) {
    let product = data.find((product) => product.Id === productId);
    setSelectedEditProduct(product);
    setEditProductData({
      Name: product.Name,
      Description: product.Description,
      CostPrice: product.CostPrice,
      EatOutPrice: product.EatOutPrice,
      SalePrice: product.SalePrice,
      Supplier: product.Supplier,
      product_image: product.product_image
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  const handleEditProductChange = (e) => {
    setEditProductData({ ...editProductData, [e.target.name]: e.target.value });
  };

  const handleEditProductSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`https://thevesttobackend.vercel.app/web/product/update/${selectedEditProduct.Id}`, editProductData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setData(data.map((product) =>
        product.Id === selectedEditProduct.Id ? { ...selectedEditProduct, ...editProductData } : product
      ));
      closeEditModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };


  return (
    <div>
      <PageTitle>Premium Products</PageTitle>

      {/* <Button onClick={handleGetFromEposNow} className="mb-4">
        Get from EposNow
      </Button> */}

      <Modal isOpen={isModalOpen} onClose={closeDeleteModal}>
        <ModalHeader className="flex items-center">
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Delete Product
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete product{" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.Name}"`}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Loading indicator */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner text-white"></div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Product List/Grid */}
      <div className={view === "list" ? "mb-8" : "grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"}>
        {data.map((product) => (
          <Card key={product.Id}>
            <CardBody>
              <img
                src={`https://thevesttobackend.vercel.app/storege/userdp/${product.Product_image}`}
                alt={product.Name}
                className="w-full h-48 object-cover"
              />
              <div className="mt-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-300">
                  {product.Name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.Description}
                </p>
              </div>
              <div className="mt-4 items-center text-lg text-black dark:text-gray-300 font-bold">
                <p><span className="text-black dark:text-gray-300 underline font-semibold">Price: </span>{product.Price}</p>
                {/* <p><span className="text-black dark:text-gray-300 underline font-semibold">EatOutPrice: </span>{product.EatOutPrice}</p>
                <p><span className="text-black dark:text-gray-300 underline font-semibold">SalePrice: </span>{product.SalePrice}</p> */}
              </div>
              <div className="mt-4 flex items-center">
                <Button
                  layout="link"
                  size="small"
                  className="text-blue-500 hover:underline mr-4"
                  onClick={() => openEditModal(product.Id)}
                >
                  <Icon icon={EditIcon} className="w-5 h-5" />
                </Button>
                <Button
                  layout="link"
                  size="small"
                  className="text-red-500 hover:underline"
                  onClick={() => openDeleteModal(product.Id)}
                >
                  <Icon icon={TrashIcon} className="w-5 h-5" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Pagination
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        label="Table navigation"
        onChange={onPageChange}
        className="mt-6"
      />
    </div>
  );
};

export default ProductsAll;
