import * as React from "react"
import Svg, { G, Path, Mask } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 404.375 404.375"
      version="1.1"
      viewBox="0 0 404.375 404.375"
      xmlSpace="preserve"
    >
      <Path
        fill="#1185E0"
        d="M108.669 404.375c-4.18 0-7.837-1.567-10.971-4.702-6.269-6.269-6.269-16.196 0-21.943l176.065-175.543L97.698 26.645c-6.269-6.269-6.269-16.196 0-21.943 6.269-6.269 16.196-6.269 21.943 0l187.037 186.514c3.135 3.135 4.702 6.792 4.702 10.971 0 4.18-1.567 8.359-4.702 10.971L119.641 399.673c-3.135 3.135-6.792 4.702-10.972 4.702z"
      ></Path>
    </Svg>
  )
}

const ArrowRight = React.memo(SvgComponent)

export default ArrowRight