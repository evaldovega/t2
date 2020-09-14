import * as React from "react"
import Svg, { Path } from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.364c-3.636 0-6.742 2.261-8 5.454 1.258 3.193 4.364 5.455 8 5.455s6.742-2.262 8-5.455c-1.258-3.193-4.364-5.454-8-5.454zm0 9.09a3.638 3.638 0 01-3.636-3.636A3.638 3.638 0 0112 8.182a3.638 3.638 0 013.636 3.636A3.638 3.638 0 0112 15.454zm-2.182-3.636c0-1.207.975-2.182 2.182-2.182 1.207 0 2.182.975 2.182 2.182A2.179 2.179 0 0112 14a2.179 2.179 0 01-2.182-2.182z"
                fill="#6D5F6F"
            />
        </Svg>
    )
}

const SvgEyes = React.memo(SvgComponent)
export default SvgEyes
