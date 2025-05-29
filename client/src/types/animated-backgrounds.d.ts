declare module 'animated-backgrounds' {
  import * as React from 'react';

  export interface AnimatedBackgroundProps {
    animationName: string;
    blendMode?: string;
    style?: React.CSSProperties;
  }

  export const AnimatedBackground: React.FC<AnimatedBackgroundProps>;
}
