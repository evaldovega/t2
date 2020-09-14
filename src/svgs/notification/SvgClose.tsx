import * as React from "react"
import Svg, {Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.275 3.725a.625.625 0 00-.884 0L10 9.116 4.609 3.725a.625.625 0 00-.884.884L9.116 10l-5.391 5.391a.625.625 0 00.884.884L10 10.884l5.391 5.391a.625.625 0 00.884-.884L10.884 10l5.391-5.391a.625.625 0 000-.884z"
                fill="#0F4C81"
            />
        </Svg>
    )
}

const SvgClose = React.memo(SvgComponent)
export default SvgClose
