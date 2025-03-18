import React  from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

const Card = ({
  title,
  color,
  barValue,
  value,
  series,
  isExpanded,
  onCardClick,
}) => {
  return (
    <AnimatePresence>
      {isExpanded ? (
        <ExpandedCard
          key={`expanded-${title}`} // Unique key for expanded card
          title={title}
          color={color}
          series={series}
          onClose={onCardClick}
        />
      ) : (
        <CompactCard
          key={`compact-${title}`} // Unique key for compact card
          title={title}
          color={color}
          barValue={barValue}
          value={value}
          onClick={onCardClick}
        />
      )}
    </AnimatePresence>
  );
};

const CompactCard = ({ title, color, barValue, value, onClick }) => {
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
      layoutId={`card-${title}`} // Unique layoutId for each card
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="radialBar">
        <CircularProgressbar value={barValue} text={`${barValue}%`} />
        <span>{title}</span>
      </div>
      <div className="detail">
        <span>${value}</span>
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
};

const ExpandedCard = ({ title, color, series, onClose }) => {
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      xaxis: {
        type: "datetime",
      },
    },
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
      layoutId={`card-${title}`} // Match the layoutId with CompactCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={onClose} />
      </div>
      <span>{title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={series} type="area" />
      </div>
      <span>Last 24 hours</span>
    </motion.div>
  );
};

export default Card;
