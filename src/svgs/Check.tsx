import React from "react";
import Svg, { G, Path, Mask } from "react-native-svg"

function Icon(props) {
  return (
    <Svg
        width={props.width}
        height={props.height}
      xmlns='http://www.w3.org/2000/Svg'
      x='0'
      y='0'
      enableBackground='new 0 0 511.999 511.999'
      version='1.1'
      viewBox='0 0 511.999 511.999'
      xmlSpace='preserve'
    >
      <Path
        fill='#8CA82F'
        d='M510.114 108.448l-17.531-17.531-344.886 292.841v52.045l17.531 17.531a6.436 6.436 0 009.101 0l335.787-335.787a6.435 6.435 0 00-.002-9.099z'
      ></Path>
      <Path
        fill='#A5C244'
        d='M451.232 58.665L169.778 340.119 60.767 231.108a6.436 6.436 0 00-9.101 0L1.885 280.891a6.434 6.434 0 000 9.1l145.812 145.812L492.583 90.917l-32.251-32.251a6.434 6.434 0 00-9.1-.001z'
      ></Path>
    </Svg>
  );
}

const Check= React.memo(Icon);
export default Check