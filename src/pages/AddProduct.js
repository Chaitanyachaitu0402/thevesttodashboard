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
  Select,
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
  const [categoriesId, setCategoriesId] = useState("");
  const [subCategoriesId, setSubCategoriesId] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false); // Step 1: Initialize loading state

  // Define default categories and subcategories
  const defaultCategories = [
    { id: "1", name: "Groceries" },
    { id: "2", name: "Vegetables" },
    { id: "3", name: "Fruits" },
    { id: "4", name: "HouseHold" },
    { id: "5", name: "Spices" },
    { id: "6", name: "Pickels" },
    { id: "7", name: "Sweets" },
    { id: "8", name: "Pooja" },
    { id: "9", name: "BreakFast" },
    { id: "10", name: "Fun & Party" },
    { id: "11", name: "Rice" },
    { id: "12", name: "Beverages" },
  ];

  const defaultSubCategories = {
    "1": [
      { id: "11", name: "GoGreen" },
      { id: "12", name: "Sweeteners" },
      { id: "13", name: "Atta's & Flours" },
      { id: "14", name: "Pluse's & Dal's" },
      { id: "15", name: "Nuts & Dry Fruits" },
      { id: "16", name: "Ghee's & Oils" },
      { id: "17", name: "Papads (Fryums)" },
      { id: "18", name: "Food Colors" },
      { id: "19", name: "Tea & Coffee" },
    ],
    "4": [
      { id: "41", name: "GoGreen" },
      { id: "42", name: "Accessories" },
      { id: "43", name: "Beauty" },
      { id: "44", name: "Health & Wellbeing" },
      { id: "45", name: "Party & Fun" },
      { id: "46", name: "Rakhi" },
      { id: "47", name: "Pet Food" },
      { id: "48", name: "Stationery" },
    ],
    "5": [
      { id: "51", name: "Herbs" },
      { id: "52", name: "Ground Spices" },
      { id: "53", name: "Whold Spices" },
      { id: "54", name: "Pastes & Sauces" },
    ],
    "6": [
      { id: "61", name: "Village Style" },
      { id: "62", name: "Telugu Foods" },
      { id: "63", name: "Non-Veg Pickels" },
      { id: "64", name: "Karampodi" },
    ],
    "7": [
      { id: "71", name: "Desi Sweets" },
      { id: "72", name: "Biscuits" },
      { id: "73", name: "Chocolates" },
      { id: "74", name: "Protein Bars & Drinks" },
    ],
  };

  // Initialize categories and subcategories state with defaults
  const [categories, setCategories] = useState(defaultCategories);
  const [subCategories, setSubCategories] = useState(
    defaultSubCategories["1"] // Default to first category's subcategories
  );

  const eposKey = "4IUQP4AY3GCQHEKN8TFUECT5AE16FK91";
  const eposSecret = "HWQWEWZSXXBO6GHAN2HSPELYCUSZJBSZ";
  const authToken =
    "NElVUVA0QVkzR0NRSEVLTjhURlVFQ1Q1QUUxNkZLOTE6SFdRV0VXWlNYWEJPNkdIQU4ySFNQRUxZQ1VTWkpCU1o=";

  // Function to handle category change
  const handleCategoryChange = (categoryId) => {
    // setCategoriesId(categoryId);
    // setSubCategories(defaultSubCategories[categoryId]);
  };

  // Function to add a new product
  const handleAddProduct = async () => {
    setLoading(true); // Step 1: Set loading to true when starting request

    const productData = [
      {
        Name: productName,
        Description: description,
        CostPrice: parseFloat(cost),
        Barcode: barcode,
        Sku: sku,
        CategoryId: categoriesId || null,
        ProductType: 0, // Adjust this based on your requirements
        SellOnWeb: false, // Adjust based on requirements
        SellOnTill: false, // Adjust based on requirements
        IsCostPriceIncTax: false,
        IsSalePriceIncTax: true,
        IsEatOutPriceIncTax: true,
        SalePrice: 0, // Adjust as necessary
        EatOutPrice: 0, // Adjust as necessary
        IsArchived: false,
        IsTaxExemptable: false,
        IsVariablePrice: false,
        ExcludeFromLoyaltyPointsGain: false,
      },
    ];

    try {
      const response = await axios.post(
        "http://localhost:8080/https://api.eposnowhq.com/api/V4/Product",
        productData,
        {
          headers: {
            Authorization: `Basic ${authToken}`,
            "Epos-Key": eposKey,
            "Epos-Secret": eposSecret,
            "Content-Type": "application/json",
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
      setLoading(false); // Step 1: Set loading back to false after request completes
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
        <div className="flex items-center text-purple-600">
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

            <FormTitle>Product Description</FormTitle>
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
            </Label>

            <FormTitle>Product Category</FormTitle>
            <Label>
              <Select
                className="mb-4"
                value={categoriesId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Label>

            <FormTitle>Product Subcategory</FormTitle>
            <Label>
              <Select
                className="mb-4"
                value={subCategoriesId}
                onChange={(e) => setSubCategoriesId(e.target.value)}
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </Select>
            </Label>

            <FormTitle>Stock Status</FormTitle>
            <Label>
              <Select
                className="mb-4"
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
              >
                <option value="">Select stock status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-order">Pre-order</option>
              </Select>
            </Label>

            <Button block className="mt-4" onClick={handleAddProduct}>
              <Icon className="w-4 h-4 mr-2" aria-hidden="true" icon={AddIcon} />
              Add Product
            </Button>

            {loading && ( // Step 2: Show loading indicator when loading is true
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
            <p className="mb-4">Product added successfully!</p>
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
