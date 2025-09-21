import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Filter,
  FeTurbulence,
  FeColorMatrix,
  FeComponentTransfer,
  FeFuncA,
  FeComposite,
  FeDropShadow,
  Rect,
  G,
  Line,
  Path,
  Circle,
} from 'react-native-svg';

interface BookTextureProps {
  style?: ViewStyle;
  width?: number | string;
  height?: number | string;
}

export const BookTexture: React.FC<BookTextureProps> = ({ 
  style, 
  width = '100%', 
  height = '100%' 
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 400 600"
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}
      preserveAspectRatio="xMidYMid slice"
    >
      <Defs>
        {/* Paper texture gradient */}
        <RadialGradient id="paperGradient" cx="50%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#fefcf7" stopOpacity="1" />
          <Stop offset="40%" stopColor="#faf8f1" stopOpacity="1" />
          <Stop offset="80%" stopColor="#f5f2e8" stopOpacity="1" />
          <Stop offset="100%" stopColor="#f0ede1" stopOpacity="1" />
        </RadialGradient>
        
        {/* Subtle aging gradient */}
        <LinearGradient id="agingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#faf8f1" stopOpacity="0.3" />
          <Stop offset="50%" stopColor="#f5f2e8" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="#ede8d8" stopOpacity="0.4" />
        </LinearGradient>
        
        {/* Paper fiber texture */}
        <Filter id="paperTexture">
          <FeTurbulence baseFrequency="0.9" numOctaves="4" result="noise" seed="1"/>
          <FeColorMatrix in="noise" type="saturate" values="0"/>
          <FeComponentTransfer>
            <FeFuncA type="discrete" tableValues="0.02 0.04 0.06 0.08"/>
          </FeComponentTransfer>
          <FeComposite operator="over" in2="SourceGraphic"/>
        </Filter>
        
        {/* Subtle shadow for depth */}
        <Filter id="bookShadow">
          <FeDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#d4c4a8" floodOpacity="0.3"/>
        </Filter>
      </Defs>
      
      {/* Main paper background */}
      <Rect width="400" height="600" fill="url(#paperGradient)" filter="url(#paperTexture)"/>
      
      {/* Aging overlay */}
      <Rect width="400" height="600" fill="url(#agingGradient)" opacity="0.6"/>
      
      {/* Subtle horizontal lines like notebook paper */}
      <G stroke="#e8e0d1" strokeWidth="0.5" opacity="0.3">
        <Line x1="40" y1="80" x2="360" y2="80"/>
        <Line x1="40" y1="120" x2="360" y2="120"/>
        <Line x1="40" y1="160" x2="360" y2="160"/>
        <Line x1="40" y1="200" x2="360" y2="200"/>
        <Line x1="40" y1="240" x2="360" y2="240"/>
        <Line x1="40" y1="280" x2="360" y2="280"/>
        <Line x1="40" y1="320" x2="360" y2="320"/>
        <Line x1="40" y1="360" x2="360" y2="360"/>
        <Line x1="40" y1="400" x2="360" y2="400"/>
        <Line x1="40" y1="440" x2="360" y2="440"/>
        <Line x1="40" y1="480" x2="360" y2="480"/>
        <Line x1="40" y1="520" x2="360" y2="520"/>
      </G>
      
      {/* Left margin line */}
      <Line x1="60" y1="40" x2="60" y2="560" stroke="#e0d4c1" strokeWidth="1" opacity="0.4"/>
      
      {/* Subtle corner wear */}
      <Path d="M 0 0 Q 15 0 15 15 L 15 0 Z" fill="#ede8d8" opacity="0.6"/>
      <Path d="M 385 0 Q 400 0 400 15 L 400 0 Z" fill="#ede8d8" opacity="0.6"/>
      <Path d="M 0 585 Q 0 600 15 600 L 0 600 Z" fill="#ede8d8" opacity="0.6"/>
      <Path d="M 385 600 Q 400 600 400 585 L 400 600 Z" fill="#ede8d8" opacity="0.6"/>
      
      {/* Very subtle stains/aging spots */}
      <Circle cx="320" cy="150" r="8" fill="#f0ede1" opacity="0.4"/>
      <Circle cx="80" cy="380" r="6" fill="#ede8d8" opacity="0.3"/>
      <Circle cx="280" cy="480" r="5" fill="#f0ede1" opacity="0.3"/>
      
      {/* Book binding shadow on left */}
      <Rect x="0" y="0" width="20" height="600" fill="url(#agingGradient)" opacity="0.2"/>
    </Svg>
  );
};