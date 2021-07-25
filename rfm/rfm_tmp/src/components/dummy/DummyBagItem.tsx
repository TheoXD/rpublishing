import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonSkeletonText
} from '@ionic/react';

import '../BagItem.scoped.css';

import { document } from 'ionicons/icons';

interface DummyBagItemProps {
  id: string;
}
const DummyBagItem: React.FC<DummyBagItemProps> = ({ id }) => {
  return (
    <IonItem detail={false}>
      <div className="IconContainer">
        <IonIcon icon={document} size="large" color="secondary" />
      </div>
      <IonLabel className="ion-text-wrap">
        <h4>
          <IonSkeletonText animated style={{ width: '80%' }}></IonSkeletonText>
        </h4>
        <h4>
          <IonSkeletonText animated style={{ width: '60%' }}></IonSkeletonText>
        </h4>
      </IonLabel>
    </IonItem>
  );
};

export default DummyBagItem;
