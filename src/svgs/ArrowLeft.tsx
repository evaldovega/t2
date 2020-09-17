import * as React from "react"
import Svg, { G, Path, Mask } from "react-native-svg"

function Icon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/Svg"
      x="0"
      y="0"
      width={props.width}
      height={props.height}
      enableBackground="new 0 0 490.787 490.787"
      version="1.1"
      viewBox="0 0 490.787 490.787"
      xmlSpace="preserve"
    >
      <Path
        fill={props.color}
        d="M362.671 490.787a10.663 10.663 0 01-7.552-3.115L120.452 253.006c-4.164-4.165-4.164-10.917 0-15.083L355.119 3.256c4.093-4.237 10.845-4.354 15.083-.262 4.237 4.093 4.354 10.845.262 15.083-.086.089-.173.176-.262.262L143.087 245.454l227.136 227.115c4.171 4.16 4.179 10.914.019 15.085a10.67 10.67 0 01-7.571 3.133z"
      ></Path>
      <Path d="M362.671 490.787a10.663 10.663 0 01-7.552-3.115L120.452 253.006c-4.164-4.165-4.164-10.917 0-15.083L355.119 3.256c4.093-4.237 10.845-4.354 15.083-.262 4.237 4.093 4.354 10.845.262 15.083-.086.089-.173.176-.262.262L143.087 245.454l227.136 227.115c4.171 4.16 4.179 10.914.019 15.085a10.67 10.67 0 01-7.571 3.133z"></Path>
    </Svg>
  );
}


const ArrowLeft = React.memo(Icon)

export default ArrowLeft