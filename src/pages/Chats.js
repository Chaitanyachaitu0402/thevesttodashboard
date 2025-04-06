import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";

const ManagePincodes = () => {
  const [pincodes, setPincodes] = useState([]);
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(
        "https://thevesttobackend.vercel.app/pincodes", // Replace with your API endpoint
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setPincodes(response.data);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
    }
  };

  const addPincode = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.post(
        "https://thevesttobackend.vercel.app/pincodes", // Replace with your API endpoint
        {
          pincode,
          deliveryDate,
          deliveryCharge,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      fetchPincodes(); // Refresh pincodes after adding
      setModalOpen(false);
      // Clear input fields
      setPincode("");
      setDeliveryDate("");
      setDeliveryCharge("");
    } catch (error) {
      console.error("Error adding pincode:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Pincodes and Delivery Charges</h2>
        <Button onClick={() => setModalOpen(true)}>Add New Pincode</Button>
      </div>

      {/* Modal for adding new pincode */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>Add New Pincode</ModalHeader>
        <ModalBody>
          <Label>
            <span>Pincode:</span>
            <Input
              className="mt-1"
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter Pincode"
            />
          </Label>
          <Label className="mt-4">
            <span>Delivery Date:</span>
            <Input
              className="mt-1"
              type="text"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              placeholder="Enter Delivery Date"
            />
          </Label>
          <Label className="mt-4">
            <span>Delivery Charge:</span>
            <Input
              className="mt-1"
              type="text"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              placeholder="Enter Delivery Charge"
            />
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button onClick={addPincode}>Add Pincode</Button>
          <Button onClick={() => setModalOpen(false)} className="ml-4">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Table to display pincodes */}
      <TableContainer className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Pincode</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Delivery Charge</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pincodes.map((pincode, index) => (
              <TableRow key={index}>
                <TableCell>{pincode.pincode}</TableCell>
                <TableCell>{pincode.deliveryDate}</TableCell>
                <TableCell>{pincode.deliveryCharge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Pincodes: {pincodes.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManagePincodes;
