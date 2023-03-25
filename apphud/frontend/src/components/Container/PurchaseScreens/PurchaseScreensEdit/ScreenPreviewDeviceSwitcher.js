import React from "react"
import Aux from "../../../../hoc/Aux"

class ScreenPreviewDeviceSwitcher extends React.Component {
  render() {
    const { devices, currentDeviceId, handleChangeDevice } = this.props
    return (
      <div className="purchase-screen__edit-left__device-switcher">
        {devices.map((device) => (
          <Aux key={device.id}>
            <input
              type="radio"
              id={device.id}
              name={device.id}
              className="hidden purchase-screen__edit-left__device-switcher__radio"
              value={device.id}
              checked={device.id === currentDeviceId}
              onChange={handleChangeDevice}
            />
            <label
              htmlFor={device.id}
              className="purchase-screen__edit-left__device-switcher__item"
            >
              <span
                className="purchase-screen__edit-left__device-switcher__item-icon"
                dangerouslySetInnerHTML={{ __html: device.icon }}
              />
            </label>
          </Aux>
        ))}
      </div>
    )
  }
}

export default ScreenPreviewDeviceSwitcher
