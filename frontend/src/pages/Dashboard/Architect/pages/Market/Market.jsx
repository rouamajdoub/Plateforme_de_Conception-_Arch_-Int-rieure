import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsBySeller,
  fetchProductById,
  fetchProductReviews,
  fetchProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
} from "../../../../../redux/slices/marketplaceSlice"; // Make sure this path is correct
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Popconfirm,
  Select,
  InputNumber,
  Divider,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ProductDetails from "./ProductDetails";
import'./Market.css'; 

const Market = () => {
  const dispatch = useDispatch();
  const { products, product, reviews, stats, loading } = useSelector(
    (state) => state.marketplace
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch products when component mounts
    const sellerId = localStorage.getItem("userId") || "architectId"; // Get from auth or localStorage
    dispatch(fetchProductsBySeller(sellerId));

    // Also fetch stats for the dashboard overview
    dispatch(fetchProductStats());
  }, [dispatch]);

  // Set form values when editing product
  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        ...editingProduct,
        // Transform image URLs to upload file list format for Ant Design
        images: undefined, // Clear images field, we'll handle this separately
      });

      // Convert existing images to fileList format
      if (editingProduct.images && editingProduct.images.length > 0) {
        const newFileList = editingProduct.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: "done",
          url: url,
        }));
        setFileList(newFileList);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [editingProduct, form]);

  const handleViewDetails = async (productId) => {
    await dispatch(fetchProductById(productId));
    await dispatch(fetchProductReviews(productId));
    // Use the existing product object rather than just the ID
    const selectedProduct = products.find((p) => p._id === productId);
    if (selectedProduct) {
      dispatch(setSelectedProduct(selectedProduct));
    }
  };

  const handleCreateOrUpdateProduct = async (values) => {
    try {
      // Process images - in a real app, you would upload them to a server
      // and get back URLs. For now, we'll simulate this.
      const imageUrls = fileList.map((file) => {
        if (file.url) return file.url;
        // In a real app, you would actually upload the file here
        return URL.createObjectURL(file.originFileObj);
      });

      const productData = {
        ...values,
        images: imageUrls,
      };

      if (editingProduct) {
        await dispatch(
          updateProduct({
            productId: editingProduct._id,
            updatedData: productData,
          })
        );
        message.success("Product updated successfully!");
      } else {
        await dispatch(createProduct(productData));
        message.success("Product created successfully!");
      }
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingProduct(null);
    } catch (error) {
      message.error(
        "Failed to save product: " + (error.message || "Unknown error")
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      message.success("Product deleted successfully!");
      // If the deleted product is currently selected, clear it
      if (product && product._id === productId) {
        dispatch(setSelectedProduct(null));
      }
    } catch (error) {
      message.error(
        "Failed to delete product: " + (error.message || "Unknown error")
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
  };

  // Handle file upload change
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <div style={{ width: 60, height: 60, overflow: "hidden" }}>
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt="Product"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No img
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record._id)}
            type="primary"
            ghost
          >
            Details
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="market-container">
      <div
        className="market-header"
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Products</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            setIsModalVisible(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleViewDetails(record._id),
        })}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdateProduct}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              <Select.Option value="furniture">Furniture</Select.Option>
              <Select.Option value="lighting">Lighting</Select.Option>
              <Select.Option value="decoration">Decoration</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Images" name="images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent auto-upload
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Divider />

      {product && (
        <ProductDetails product={product} reviews={reviews} stats={stats} />
      )}
    </div>
  );
};

export default Market;
