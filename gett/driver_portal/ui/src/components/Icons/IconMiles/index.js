import React from 'react'

const IconMiles = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 24 24" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M19.3495273,6.44020602 L18.7461818,8.14463761 C20.8939636,9.9632605 22.2545455,12.6312866 22.2545455,15.6019477 C22.2545455,18.1127498 21.3559273,18.312444 20.1812364,18.312444 C19.3570909,18.312444 18.3412364,18.1425633 17.1650909,17.945963 C16.6050909,17.8523037 16.0171636,17.7544254 15.4062545,17.6675163 C15.2357818,15.9951483 13.7771636,14.6884174 12.0026182,14.6884174 C10.2280727,14.6884174 8.77003636,15.994867 8.59898182,17.6669538 C7.98632727,17.7541442 7.39665455,17.8520224 6.83490909,17.945963 C5.65876364,18.1422821 4.64290909,18.3121627 3.81876364,18.312444 C2.85149091,18.312444 2.50094545,18.0730923 2.30370909,17.8646791 C1.93338182,17.4728848 1.74545455,16.7117971 1.74545455,15.6019477 C1.74545455,10.13511 6.3456,5.68755603 12,5.68755603 C13.7922909,5.68755603 15.4781091,6.13560216 16.9457455,6.92031571 L18.0258909,5.57533356 C16.2536727,4.57573787 14.1957818,4 12,4 C5.38327273,4 0,9.20470406 0,15.6019477 C0,17.168281 0.332218182,18.2809429 1.01585455,19.0037794 C1.65003636,19.6740204 2.56698182,20 3.81876364,20 C4.79272727,19.9997187 5.92901818,19.8098687 7.13221818,19.6087683 C8.60305455,19.3629476 10.2702545,19.0845009 12,19.0845009 C13.7297455,19.0845009 15.3969455,19.3629476 16.8677818,19.6087683 C18.0709818,19.8098687 19.2072727,20 20.1812364,20 C22.7866182,20 24,18.6024223 24,15.6019477 C24,11.8803242 22.176,8.56483907 19.3495273,6.44020602 Z M12.0244364,18.6027036 C11.4082909,18.6027036 10.9090909,18.1197813 10.9090909,17.5246366 C10.9090909,16.9292105 11.4082909,16.4462883 12.0244364,16.4462883 C12.64,16.4462883 13.1394909,16.9292105 13.1394909,17.5246366 C13.1394909,18.1197813 12.64,18.6027036 12.0244364,18.6027036 Z M15.3454545,15.655387 C15.3454545,15.655387 14.7557818,14.9004869 13.9051636,14.4870357 C13.0545455,14.0735845 12.0727273,14.1084606 12.0727273,14.1084606 L18.9029818,5.60430327 L15.3454545,15.655387 Z" />
    </svg>
  )
}

IconMiles.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconMiles
