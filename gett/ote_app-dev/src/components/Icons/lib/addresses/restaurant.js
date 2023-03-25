import React from 'react';
import * as SVG from 'react-native-svg';

export default function Restaurant({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 17 21" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M15.538 1.596c-.008-.092.01-.099.03-.092-.097.01-.11.023-.196.126a13.131 13.131 0 0 0-1.844 4.01c-.232.861-.342 1.646-.342 1.961v1.41c0 .49.027.867.077 1.12.027.135.044.173.043.18l1.411 1.28v7.614c.064.22.16.277.413.277s.344-.055.405-.274l.003-17.612zm-2.286 10.669l-.842-.771c-.537-.372-.69-1.143-.69-2.483v-1.41c0-.454.13-1.372.395-2.36A14.671 14.671 0 0 1 14.21.72c.383-.47.74-.706 1.425-.705.795.04 1.29.608 1.366 1.516V19.3l-.018.165c-.212.964-.887 1.518-1.852 1.518-.962 0-1.639-.551-1.858-1.512l-.02-.17v-7.036zM0 6.993V0h1.465v6.993c0 .85.302 1.152 1.168 1.152h.738l-.006.757a1337.51 1337.51 0 0 0 0 9.85c.024.574.202.747.771.747.557 0 .708-.153.708-.713V8.172l.706-.026c.95-.035 1.273-.348 1.258-1.153V0h1.465v6.978c.027 1.407-.688 2.31-1.964 2.583v9.225C6.31 20.178 5.5 21 4.136 21c-1.35 0-2.175-.803-2.236-2.212-.01-4.452-.011-7.523-.004-9.213C.684 9.323 0 8.413 0 6.993zM3.406 0h1.465v6.74H3.406V0z" />
    </SVG.Svg>
  );
}
