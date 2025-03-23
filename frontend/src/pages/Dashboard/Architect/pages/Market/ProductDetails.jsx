import React from "react";
import'./Market.css';
import { Card, List, Typography, Row, Col, Statistic } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetails = ({ product, reviews, stats }) => {
  // Guard clause in case product data is not loaded yet
  if (!product) return null;

  const { name, description, price, stock, images } = product;

  // Format chart data for product sales statistics
  const chartData = {
    labels: stats?.topProducts?.map((p) => p.product.name) || [],
    datasets: [
      {
        label: "Sales",
        data: stats?.topProducts?.map((p) => p.sales) || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Selling Products",
      },
    },
  };

  return (
    <Card title="Product Details" style={{ marginTop: 20 }}>
      <Row gutter={16}>
        <Col span={8}>
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              style={{ width: "100%", borderRadius: 8 }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 200,
                background: "#f0f0f0",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Image
            </div>
          )}
        </Col>
        <Col span={16}>
          <Typography.Title level={4}>{name}</Typography.Title>
          <Typography.Paragraph>{description}</Typography.Paragraph>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Price" value={price} prefix="$" />
            </Col>
            <Col span={8}>
              <Statistic title="Stock" value={stock} />
            </Col>
            <Col span={8}>
              <Statistic title="Orders" value={stats?.productOrders || 0} />
            </Col>
          </Row>
        </Col>
      </Row>

      <Typography.Title level={4} style={{ marginTop: 24 }}>
        Reviews
      </Typography.Title>
      {reviews && reviews.length > 0 ? (
        <List
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item>
              <List.Item.Meta
                title={`${review.client?.pseudo || "Anonymous"} (${
                  review.rating
                }/5)`}
                description={review.comment}
              />
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text type="secondary">No reviews yet</Typography.Text>
      )}

      <Typography.Title level={4} style={{ marginTop: 24 }}>
        Sales Statistics
      </Typography.Title>
      {stats && stats.topProducts && stats.topProducts.length > 0 ? (
        <div style={{ height: 300 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <Typography.Text type="secondary">
          No sales data available
        </Typography.Text>
      )}
    </Card>
  );
};

export default ProductDetails;
