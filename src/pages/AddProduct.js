import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Modal,
} from "@windmill/react-ui";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle adding a new product
  const handleAddProduct = async () => {
    setLoading(true);

    const productData = new FormData();
    productData.append("Name", productName);
    // productData.append("Description", description);
    // productData.append("CostPrice", parseFloat(cost));
    // productData.append("Barcode", barcode);
    // productData.append("Sku", sku);
    productData.append("product_image", productImage);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        "https://thevesttobackend.vercel.app/web/product/update-product-image",
        productData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added successfully:", response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-black dark:text-gray-300">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3 ">
        <Card className="row-span-2 md:col-span-2">
          <CardBody>
            <FormTitle>Product Image</FormTitle>
            <input
              type="file"
              className="mb-4 text-gray-800 dark:text-gray-300"
              onChange={(e) => setProductImage(e.target.files[0])}
            />

            <FormTitle>Product Name</FormTitle>
            <Label>
              <Input
                className="mb-4"
                placeholder="Type product name here"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Label>

            {/* <FormTitle>Product Description</FormTitle>
            <Label>
              <Textarea
                className="mb-4"
                rows="3"
                placeholder="Type product description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>

            <FormTitle>Product Cost</FormTitle>
            <Label>
              <Input
                className="mb-4"
                placeholder="Type product cost here"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Label>

            <FormTitle>Product Barcode</FormTitle>
            <Label>
              <Input
                className="mb-4"
                placeholder="Type product barcode here"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </Label>

            <FormTitle>Product SKU</FormTitle>
            <Label>
              <Input
                className="mb-4"
                placeholder="Type product SKU here"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </Label> */}

            <Button block className="mt-4" onClick={handleAddProduct}>
              <Icon className="w-4 h-4 mr-2" aria-hidden="true" icon={AddIcon} />
              Add Product
            </Button>

            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={closeModal}>
        <Card>
          <CardBody className="text-center">
            <p className="mb-4 text-white font-bold">Product added successfully!</p>
            <Button onClick={closeModal}>Close</Button>
          </CardBody>
        </Card>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={showErrorModal} onClose={closeModal}>
        <Card>
          <CardBody className="text-center">
            <p className="mb-4 text-red-600">Error adding product. Please try again.</p>
            <Button onClick={closeModal}>Close</Button>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
};

export default AddProduct;
