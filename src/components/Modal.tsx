import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";

import { Provider } from "./Provider";
import {
  MODAL_LIGHTBOX_CLASSNAME,
  MODAL_CONTAINER_CLASSNAME,
  MODAL_HITBOX_CLASSNAME,
  MODAL_CARD_CLASSNAME,
  MODAL_CARD_CONTAINER_CLASSNAME,
  MODAL_CARD_HEADER_CLASSNAME,
  MODAL_CARD_CLOSE_BUTTON_CLASSNAME,
  MODAL_CARD_CLOSE_BUTTON_SVG_CLASSNAME
} from "../constants";
import { SimpleFunction, IProviderUserOptions, ThemeColors } from "../helpers";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    web3: any;
    updateWeb3Modal: any;
  }
}

interface ILightboxStyleProps {
  show: boolean;
  offset: number;
  opacity?: number;
}

const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SLightbox = styled.div<ILightboxStyleProps>`
  transition: opacity 0.1s ease-in-out;
  text-align: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  top: ${({ offset }) => (offset ? `-${offset}px` : 0)};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({ opacity }) => {
    let alpha = 0.4;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;

  & * {
    box-sizing: border-box !important;
  }
`;

interface IModalContainerStyleProps {
  show: boolean;
}

const SModalContainer = styled.div<IModalContainerStyleProps>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
`;

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IModalCardStyleProps {
  show: boolean;
  themeColors: ThemeColors;
  maxWidth?: number;
}

const SModalCardContainer = styled.div<{show: boolean}>`
  margin: 10px;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  z-index: 100;
`;

const SModalCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  background-color: ${({ themeColors }) => themeColors.background};
  border-radius: 12px;
  margin: 0;
  padding: 0;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "800px")};
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;

  @media screen and (max-width: 768px) {
    max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "500px")};
    grid-template-columns: 1fr;
  }
`;

interface IModalProps {
  themeColors: ThemeColors;
  userOptions: IProviderUserOptions[];
  onClose: SimpleFunction;
  resetState: SimpleFunction;
  lightboxOpacity: number;
}

interface IModalState {
  show: boolean;
  lightboxOffset: number;
}

const INITIAL_STATE: IModalState = {
  show: false,
  lightboxOffset: 0
};

export class Modal extends React.Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    window.updateWeb3Modal = async (state: IModalState) => {
      this.setState(state);
    };
  }
  public static propTypes = {
    userOptions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    lightboxOpacity: PropTypes.number.isRequired
  };

  public lightboxRef?: HTMLDivElement | null;
  public mainModalCard?: HTMLDivElement | null;

  public state: IModalState = {
    ...INITIAL_STATE
  };

  public componentDidUpdate(prevProps: IModalProps, prevState: IModalState) {
    if (prevState.show && !this.state.show) {
      this.props.resetState();
    }
    if (this.lightboxRef) {
      const lightboxRect = this.lightboxRef.getBoundingClientRect();
      const lightboxOffset = lightboxRect.top > 0 ? lightboxRect.top : 0;

      if (
        lightboxOffset !== INITIAL_STATE.lightboxOffset &&
        lightboxOffset !== this.state.lightboxOffset
      ) {
        this.setState({ lightboxOffset });
      }
    }
  }

  public render = () => {
    const { show, lightboxOffset } = this.state;

    const { onClose, lightboxOpacity, userOptions, themeColors } = this.props;

    return (
      <SLightbox
        className={MODAL_LIGHTBOX_CLASSNAME}
        offset={lightboxOffset}
        opacity={lightboxOpacity}
        ref={c => (this.lightboxRef = c)}
        show={show}
      >
        <SModalContainer className={MODAL_CONTAINER_CLASSNAME} show={show}>
          <SHitbox className={MODAL_HITBOX_CLASSNAME} onClick={onClose} />
          <SModalCardContainer
            show={show}
            className={MODAL_CARD_CONTAINER_CLASSNAME} 
            onClick={(e) => { e.stopPropagation(); }}
          >
            <SHeader className={MODAL_CARD_HEADER_CLASSNAME}>
              <span>Connect Wallet</span>
              <a className={MODAL_CARD_CLOSE_BUTTON_CLASSNAME} onClick={onClose}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className={MODAL_CARD_CLOSE_BUTTON_SVG_CLASSNAME} fill-rule="evenodd" clip-rule="evenodd" d="M15.8252 14.4111L22.5898 7.64648L24.004 9.0607L17.2395 15.8253L24.004 22.5898L22.5898 24.004L15.8252 17.2395L9.0607 24.004L7.64648 22.5898L14.411 15.8253L7.64649 9.06082L9.0607 7.6466L15.8252 14.4111Z" />
                </svg>
              </a>
            </SHeader>
            <SModalCard
              className={MODAL_CARD_CLASSNAME}
              show={show}
              themeColors={themeColors}
              maxWidth={userOptions.length < 3 ? 500 : 800}
              ref={c => (this.mainModalCard = c)}
            >
              {userOptions.map(provider =>
                !!provider ? (
                  <Provider
                    name={provider.name}
                    logo={provider.logo}
                    description={provider.description}
                    themeColors={themeColors}
                    onClick={provider.onClick}
                  />
                ) : null
              )}
            </SModalCard>
          </SModalCardContainer>
        </SModalContainer>
      </SLightbox>
    );
  };
}
