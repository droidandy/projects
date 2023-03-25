import React from "react";
import styles from "./styles.module.scss";

const items = [
  {
    id: 1,
    img: "01.png",
    name: "Alexander Selivanov",
    position: "Co-founder & CTO",
  },
  {
    id: 5,
    img: "05.png",
    name: "Denis Minnetdinov",
    position: "Co-founder & CEO",
  },
  {
    id: 6,
    img: "06.png",
    name: "Renat Kurbanov",
    position: "Co-founder & SDK Engineer",
  },
];

const Team = ({ title }) => {
  return (
    <div className={styles.team}>
      <div className="container">
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.list}>
          {items.map((item) => {
            return (
              <div className={styles.item} key={item.id}>
                <div className={styles.img}>
                  <img src={`/images/team/${item.img}`} alt={item.text} />
                </div>
                <div className={styles.text}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.position}>{item.position}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
