import * as React from "react"
import Svg, { Path } from "react-native-svg"

// @ts-ignore
function SvgComponent(props) {
    return (
        <Svg width={48} height={48} viewBox="0 0 48 48" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24a23.899 23.899 0 0015.016-5.276c.356-.23.68-.505.964-.817l.13-.117-.017-.012a4.875 4.875 0 10-7.657-6.026l-.053-.042A14.334 14.334 0 0124 38.4c-7.953 0-14.4-6.447-14.4-14.4S16.047 9.6 24 9.6c3.214 0 6.182 1.053 8.578 2.832a4.875 4.875 0 007.686-5.998l.047-.04-.33-.3a4.898 4.898 0 00-.965-.818A23.9 23.9 0 0024 0z"
                fill="#0F4C81"
            />
            <Path
                d="M43.125 33.75a4.875 4.875 0 100-9.75 4.875 4.875 0 000 9.75z"
                fill="#FF647C"
            />
        </Svg>
    )
}

const SvgLogo = React.memo(SvgComponent)
export default SvgLogo
