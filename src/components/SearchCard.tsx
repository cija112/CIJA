import React from 'react';
import { SearchItem } from 'types/search';
import { User, Building2, MapPin, Mail, Phone, Briefcase, UserPlus } from 'lucide-react';
import styles from './searchCard.module.css';

interface Props {
  item: SearchItem;
}

export const SearchCard: React.FC<Props> = ({ item }) => {
  const isCompany = item.type === 'empresa';

  return (
    <div className={styles.userCard}>
      <div className={styles.userCardLeft}>
        <div className={styles.userAvatarFallback}>
          {isCompany ? <Building2 size={22} color="#7c3aed" /> : <User size={22} color="#ffffff" />}
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userNameRow}>
            <h3>{item.name}</h3>
            <span className={isCompany ? styles.badgeEmpresa : styles.badgeJa}>
              {isCompany ? 'Empresa' : 'Jovem Aprendiz'}
            </span>
          </div>

          <p className={styles.userRole}>{item.subtitle}</p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {item.location !== 'Não informada' && (
              <p className={styles.userLocation}><MapPin size={13} /> {item.location}</p>
            )}
            {item.email && (
              <p className={styles.userLocation}><Mail size={13} /> {item.email}</p>
            )}
            {item.telefone && (
              <p className={styles.userLocation}><Phone size={13} /> {item.telefone}</p>
            )}
          </div>
        </div>
      </div>

      <button className={styles.connectBtn}>
        {isCompany ? (
          <><Briefcase size={16} /> Ver Vagas</>
        ) : (
          <><UserPlus size={16} /> Conectar</>
        )}
      </button>
    </div>
  );
};