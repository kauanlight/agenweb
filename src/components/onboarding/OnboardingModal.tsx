import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './styles.module.css';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  teamSize: string;
  businessType: 'health' | 'ecommerce';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    teamSize: '',
    businessType: 'health',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.content}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
          </div>

          {step === 1 ? (
            <div className={styles.step1}>
              <h2 className={styles.title}>Quantas pessoas tem na sua equipe?</h2>
              <div className={styles.options}>
                <button
                  className={`${styles.option} ${formData.teamSize === '1-5' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, teamSize: '1-5' })}
                >
                  1-5 pessoas
                </button>
                <button
                  className={`${styles.option} ${formData.teamSize === '6-20' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, teamSize: '6-20' })}
                >
                  6-20 pessoas
                </button>
                <button
                  className={`${styles.option} ${formData.teamSize === '21-50' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, teamSize: '21-50' })}
                >
                  21-50 pessoas
                </button>
                <button
                  className={`${styles.option} ${formData.teamSize === '50+' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, teamSize: '50+' })}
                >
                  Mais de 50 pessoas
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.step2}>
              <h2 className={styles.title}>Qual é o seu ramo de atuação?</h2>
              <div className={styles.options}>
                <button
                  className={`${styles.option} ${formData.businessType === 'health' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, businessType: 'health' })}
                >
                  Saúde
                </button>
                <button
                  className={`${styles.option} ${formData.businessType === 'ecommerce' ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, businessType: 'ecommerce' })}
                >
                  E-commerce
                </button>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {step > 1 && (
              <button className={styles.backButton} onClick={handleBack}>
                Voltar
              </button>
            )}
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!formData.teamSize && step === 1}
            >
              {step === 2 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
