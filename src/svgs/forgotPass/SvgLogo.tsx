import * as React from "react"
import Svg, {Path} from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16c3.789 0 7.27-1.317 10.01-3.518.238-.153.454-.336.643-.544l.087-.078-.011-.008a3.25 3.25 0 10-5.105-4.017l-.035-.029A9.557 9.557 0 0116 25.6a9.6 9.6 0 010-19.2c2.143 0 4.121.702 5.719 1.889a3.25 3.25 0 005.124-3.999l.031-.027a15.779 15.779 0 00-.22-.2 3.266 3.266 0 00-.644-.545A15.933 15.933 0 0016 0z"
                fill="#0F4C81"
            />
            <Path
                d="M28.75 22.5a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z"
                fill="#FF647C"
            />
        </Svg>
    )
}

const SvgLogo = React.memo(SvgComponent)
export default SvgLogo
