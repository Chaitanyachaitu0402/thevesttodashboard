import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
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
  Avatar,
  Label,
  Select,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import './Product.css'; // Import your custom CSS file for styling

const ProductsAll = () => {
  const [view, setView] = useState("grid");

  // Table and grid data handling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // Credentials
  const eposKey = "4IUQP4AY3GCQHEKN8TFUECT5AE16FK91";
  const eposSecret = "HWQWEWZSXXBO6GHAN2HSPELYCUSZJBSZ";
  const authToken = "NElVUVA0QVkzR0NRSEVLTjhURlVFQ1Q1QUUxNkZLOTE6SFdRV0VXWlNYWEJPNkdIQU4ySFNQRUxZQ1VTWkpCU1o=";

  // Function to fetch products from API
  const fetchProducts = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get(
        `http://localhost:8080/https://api.eposnowhq.com/api/v4/Product`,
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            "Content-Type": "application/json",
            "epos-api-key": eposKey,
            "epos-api-secret": eposSecret,
          },
        }
      );
      const products = response.data;
      setData(products);
      setTotalResults(products.length);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading back to false after fetching
    }
  };

  // Fetch products on page load and page change
  useEffect(() => {
    fetchProducts();
  }, [page, resultsPerPage]);

  // Pagination change control
  const onPageChange = (p) => {
    setPage(p);
  };

  // Delete action modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);

  async function openModal(productId) {
    let product = data.find((product) => product.Id === productId);
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/https://api.eposnowhq.com/api/v4/Product`,
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            "Content-Type": "application/json",
            "epos-api-key": eposKey,
            "epos-api-secret": eposSecret,
          },
        }
      );
      setData(data.filter((product) => product.Id !== selectedDeleteProduct.Id));
      closeModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle list/grid view
  const handleChangeView = () => {
    setView(view === "list" ? "grid" : "list");
  };

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300 mb-10">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Product Views */}
      <div className="flex justify-between mb-5">
        {/* <Label>
          <Select
            className="py-3"
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </Label> */}
        <Button
          icon={view === "list" ? GridViewIcon : ListViewIcon}
          onClick={handleChangeView}
        >
          {view === "list" ? "Grid View" : "List View"}
        </Button>
      </div>

      {/* Delete product modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Delete Product
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete product{" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.Name}"`}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Loading indicator */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Product List/Grid */}
      {view === "list" ? (
        <div className="mb-8">
          {data && data.map((product) => (
            <Card key={product.Id} className="mb-4">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    
                    <div>
                      <p className="font-semibold">{product.Name}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {product.Description}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Badge
                      type={
                        product.StockStatus === "In Stock" ? "success" : "danger"
                      }
                    >
                      {product.StockStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm mr-4">£{product.CostPrice}</p>
                    {/* <Button
                      icon={EyeIcon}
                      aria-label="Preview"
                      size="small"
                      className="mr-2"
                    /> */}
                    <Button
                      icon={EditIcon}
                      layout="outline"
                      aria-label="Edit"
                      size="small"
                      className="mr-2"
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      aria-label="Delete"
                      size="small"
                      onClick={() => openModal(product.Id)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {data && data.map((product) => (
            <Card key={product.Id}>
              
              <CardBody>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold truncate text-gray-600 dark:text-gray-300">
                    {product.Name}
                  </p>
                  <Badge
                    type={product.StockStatus === "In Stock" ? "success" : "danger"}
                    className="whitespace-nowrap"
                  >
                    {product.StockStatus}
                  </Badge>
                </div>
                <p className="mb-2 text-purple-500 font-bold text-lg">
                  £{product.CostPrice}
                </p>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                  {product.Description}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    icon={EyeIcon}
                    aria-label="Preview"
                    size="small"
                    className="mr-3"
                  />
                  <div>
                    <Button
                      icon={EditIcon}
                      layout="outline"
                      aria-label="Edit"
                      size="small"
                      className="mr-3"
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      aria-label="Delete"
                      size="small"
                      onClick={() => openModal(product.Id)}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        label="Table navigation"
        onChange={onPageChange}
      />
    </div>
  );
};

export default ProductsAll;
