import React from "react";
import styles from "./styles.module.scss";

const data = [
  {
    id: '1',
    title: '99.9%',
    description:
      'Platform uptime',
  },

  {
    id: '2',
    title: '6M+',
    description:
      'Events per month tracked',
  },

  {
    id: '3',
    title: '$40M+',
    description:
      'Total revenue tracked',
  },
];

const ReliabilityApp = () => {
  return (
    <div className={styles.reliability}>
      <div className="container container_sm">
        <h2>Delivering high reliability to every app. At scale</h2>
        <div className={styles.list}>
          {data.map((e, i) => (
            <div className={styles.item} key={i}>
              <label className="h3">{e.title}</label>
              <p className="text_md">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReliabilityApp;
