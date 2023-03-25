import React from 'react';
import Star from './Start';
import styles from './styles.module.scss';

const UsedList = () => {
  return (
    <div className={styles.used}>
      <div className="container">
        <h2>
          Used by{' '}
          <div>
            <span>300+</span>
          </div>{' '}
          great apps worldwide
        </h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <img src={require('./cards/1.png')} alt="PREQUEL" />
            <div className={styles.content}>
              <strong>PREQUEL</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/2.png')} alt="Very long name of the app"  />
            <div className={styles.content}>
              <strong>
                Very long name <br /> of the app
              </strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/3.png')} alt="Scanner"/>
            <div className={styles.content}>
              <strong>Scanner</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/4.png')} alt="Duolingo" />
            <div className={styles.content}>
              <strong>Duolingo</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/1.png')} alt="PREQUEL" />
            <div className={styles.content}>
              <strong>PREQUEL</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/2.png')} alt="Very long name of the app" />
            <div className={styles.content}>
              <strong>
                Very long name <br /> of the app
              </strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/3.png')} alt="Scanner" />
            <div className={styles.content}>
              <strong>Scanner</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <img src={require('./cards/4.png')} alt="Duolingo" />
            <div className={styles.content}>
              <strong>Duolingo</strong>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span>43k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsedList;
