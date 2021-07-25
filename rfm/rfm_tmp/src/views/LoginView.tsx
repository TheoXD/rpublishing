import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as rchainToolkit from 'rchain-toolkit';
import React, { Suspense, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonSlides,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonLoading,
} from '@ionic/react';
import './LoginView.scoped.css';
import { HistoryState, getPlatform } from '../store';

import NoIdentityScreen from '../components/identity/NoIdentityScreen';
//import CreateIdentityScreen from "../components/identity/CreateIdentityScreen";
import { ReactComponent as RChainLogo } from '../assets/rchain.svg';

interface LoginViewProps {
  platform: string;
  action: string;
  init: (a: {
    registryUri: string;
    privateKey: string;
    platform: string;
  }) => void;
}
const LoginViewComponent: React.FC<LoginViewProps> = props => {
  const history = useHistory();
  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('');

  const [devLogin, setDevLogin] = useState(false);

  const [maxSlide, setMaxSlide] = useState<string>('');

  const slideOpts: Record<string, unknown> = {
    initialSlide: 0,
    speed: 400,
  };

  const CreateIdentityScreen = React.lazy(() =>
    import('../components/identity/CreateIdentityScreen')
  );
  const RestoreIdentityScreen = React.lazy(() =>
    import('../components/identity/RestoreIdentityScreen')
  );

  return (
    <IonContent>
      <IonSlides
        class="Instructions"
        options={slideOpts}
        pager={true}
        onIonSlideDidChange={(event: any) => console.info(event)}
      >
        <IonSlide>
          {devLogin ? (
            <React.Fragment>
              <div className="login">
                <IonItem>
                  <IonLabel position="floating">Address</IonLabel>
                  <IonInput
                    placeholder="address"
                    type="text"
                    value={registryUri}
                    onIonChange={e =>
                      setRegstryUri((e.target as HTMLInputElement).value)
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Private key</IonLabel>
                  <IonInput
                    placeholder="Private key"
                    type="password"
                    value={privateKey}
                    onIonChange={e =>
                      setPrivateKey((e.target as HTMLInputElement).value)
                    }
                  />
                </IonItem>
                <div className="LoadButtonDiv">
                  <IonButton
                    disabled={!privateKey || !registryUri}
                    onClick={async () => {
                      props.init({
                        registryUri: registryUri,
                        privateKey: privateKey,
                        platform: props.platform,
                      });
                    }}
                  >
                    Load
                  </IonButton>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NoIdentityScreen />
            </React.Fragment>
          )}
          <div className="BottomBar">
            <IonItem>
              <IonLabel>Dev Login: </IonLabel>
              <IonToggle
                color="secondary"
                checked={devLogin}
                onIonChange={e => setDevLogin(e.detail.checked)}
              />
            </IonItem>
          </div>
        </IonSlide>
        {props.action === 'new' ? (
          <Suspense fallback={<IonLoading isOpen={true} />}>
            <IonSlide>
              <CreateIdentityScreen />
            </IonSlide>
          </Suspense>
        ) : (
          undefined
        )}
        {props.action === 'restore' ? (
          <Suspense fallback={<IonLoading isOpen={true} />}>
            <IonSlide>
              <RestoreIdentityScreen />
            </IonSlide>
          </Suspense>
        ) : (
          undefined
        )}
      </IonSlides>
    </IonContent>
  );
};
export const LoginView = connect(
  (state: HistoryState) => {
    return {
      platform: getPlatform(state),
    };
  },
  (dispatch: Dispatch) => {
    return {
      init: (a: {
        registryUri: string;
        privateKey: string;
        platform: string;
      }) => {
        dispatch({
          type: 'INIT',
          payload: {
            platform: a.platform,
            authorised: true,
            privateKey: a.privateKey,
            publicKey: rchainToolkit.utils.publicKeyFromPrivateKey(
              a.privateKey as string
            ),
            registryUri: a.registryUri,
          },
        });
      },
    };
  }
)(LoginViewComponent);

export default LoginView;
