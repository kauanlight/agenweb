import React from 'react';
import styles from '../layout/DashboardLayout/styles.module.css';
import { Play, Info } from 'lucide-react';

interface AssistantCardProps {
  name: string;
  description: string;
  image: string;
  category: string;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({
  name,
  description,
  image,
  category
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        <img src={image} alt={name} className={styles.cardImage} />
        <div className={styles.cardOverlay}>
          <button className={styles.playButton}>
            <Play size={24} />
          </button>
          <button className={styles.infoButton}>
            <Info size={20} />
          </button>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardCategory}>
          <span className={styles.categoryTag}>{category}</span>
        </div>
      </div>
    </div>
  );
};
