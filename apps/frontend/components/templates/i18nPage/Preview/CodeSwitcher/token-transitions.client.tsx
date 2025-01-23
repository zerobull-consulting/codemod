"use client";

import { type CustomPreProps, InnerPre, getPreRef } from "codehike/code";

import {
  type TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions";
import React from "react";

const MAX_TRANSITION_DURATION = 3000; // milliseconds

export class PreWithRef extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement>;
  constructor(props: CustomPreProps) {
    super(props);
    this.ref = getPreRef(this.props);
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: "relative" }} />;
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!);
  }

  componentDidUpdate(
    prevProps: never,
    prevState: never,
    snapshot: TokenTransitionsSnapshot,
  ) {
    const transitions = calculateTransitions(this.ref.current!, snapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any;
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ];
      }

      element.animate(kf, {
        duration: 750 + options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      });
    });

    setTimeout(() => {
      if (this.props.onTransitionEnd) {
        this.props.onTransitionEnd({} as any);
      }
    }, MAX_TRANSITION_DURATION);
  }
}
