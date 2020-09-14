import * as React from "react"
import Svg, { Path } from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
            <Path
                d="M6.665 8l2.823 2.823a.69.69 0 11-.976.975l-3.31-3.31a.69.69 0 010-.976l3.31-3.31a.69.69 0 11.976.975L6.665 8z"
                fill="#433246"
            />
        </Svg>
    )
}

const SvgBack = React.memo(SvgComponent)
export default SvgBack
