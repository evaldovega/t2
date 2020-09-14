import * as React from "react"
import Svg, {Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.25 13.15c0 .58.47 1.05 1.05 1.05a.7.7 0 110 1.4H1.7a.7.7 0 110-1.4c.58 0 1.05-.47 1.05-1.05V9.747A5.57 5.57 0 017.3 4.1V3.7a.7.7 0 111.4 0v.401a5.57 5.57 0 014.55 5.646v3.403zm-7.237 3.628a.2.2 0 01.198-.178H9.79c.102 0 .188.076.198.178a2 2 0 11-3.974 0z"
                fill="#433246"
            />
            <Path
                d="M14 9a4 4 0 100-8 4 4 0 000 8z"
                fill="#FF647C"
                stroke="#F7F8F9"
            />
        </Svg>
    )
}

const SvgNoti = React.memo(SvgComponent)
export default SvgNoti
