import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <Rect width={24} height={24} rx={8} fill="#0084F4" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.938 7.188l1.874 1.875c.25.25.25.624 0 .874l-1.125 1.126-2.75-2.75 1.126-1.126c.25-.25.624-.25.874 0zm-7.75 6.875l4.875-4.876 2.75 2.75-4.876 4.876A.567.567 0 019.5 17H7.625C7.25 17 7 16.75 7 16.375V14.5c0-.188.063-.313.188-.438z"
                fill="#fff"
            />
        </Svg>
    )
}

const SvgEdit = React.memo(SvgComponent)
export default SvgEdit
