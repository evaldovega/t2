import * as React from "react"
import Svg, {Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={16} height={4} viewBox="0 0 16 4" fill="none" {...props}>
            <Path d="M0 4a4 4 0 014-4h8a4 4 0 014 4H0z" fill="#0F4C81"/>
        </Svg>
    )
}

const SvgHover = React.memo(SvgComponent)
export default SvgHover
