import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <Rect width={24} height={24} rx={8} fill="#F7F8F9" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 4H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-8.077 7.385L6.462 8.308S8.308 5.846 12 5.846s5.538 2.462 5.538 2.462l-2.461 3.077H8.923zm5.527-4.302l-.842 3.686h-1.596l2.438-3.686z"
                fill="#00C48C"
            />
        </Svg>
    )
}

const SvgWeight = React.memo(SvgComponent)
export default SvgWeight
