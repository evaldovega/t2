import * as React from "react"
import Svg, {Rect, Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
            <Rect
                width={32}
                height={32}
                rx={16}
                transform="matrix(1 0 0 -1 0 32)"
                fill="#FF647C"
            />
            <Path
                d="M19.766 12.234a.8.8 0 00-1.13 0l-2.631 2.631-2.631-2.631a.8.8 0 00-1.13 1.13l2.631 2.631-2.631 2.631a.799.799 0 101.13 1.13l2.631-2.631 2.631 2.631a.799.799 0 001.13-1.13l-2.631-2.631 2.631-2.631a.8.8 0 000-1.13z"
                fill="#fff"
            />
        </Svg>
    )
}

const SvgClose = React.memo(SvgComponent);
export default SvgClose
