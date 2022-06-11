import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CloseIcon = () => {
  return (
    <Svg viewBox="0 0 24 24" width={28} height={28}>
      <Path
        fill="#d1d1d1"
        d="M4.99 3.99a1 1 0 0 0-.697 1.717L10.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 1 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 0 0-.727-1.717 1 1 0 0 0-.687.303L12 10.586 5.707 4.293a1 1 0 0 0-.717-.303z"
      />
    </Svg>
  );
};

export default CloseIcon;
