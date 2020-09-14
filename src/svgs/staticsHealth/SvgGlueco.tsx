import * as React from "react"
import Svg, {Rect, Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <Rect width={24} height={24} rx={8} fill="#F7F8F9"/>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.325 4.305a.729.729 0 00-1.186 0C9.673 6.35 6 11.733 6 14.267a5.732 5.732 0 1011.465 0c0-2.534-3.674-7.916-5.14-9.962zM9.72 17.512a.794.794 0 01-1.121.096c-2.26-1.903-1.48-4.715-1.446-4.834a.795.795 0 011.53.438c-.024.091-.512 1.954.942 3.179a.796.796 0 01.095 1.121zm.72.736a.847.847 0 101.693-.002.847.847 0 00-1.694.002z"
                fill="#FF647C"
            />
        </Svg>
    )
}

const SvgGlueco = React.memo(SvgComponent)
export default SvgGlueco
