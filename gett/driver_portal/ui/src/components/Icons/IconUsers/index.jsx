import React from 'react'

const IconUsers = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <g fill={ color }>
        <path d="M14.7847866 8.64484845C13.4571856 8.64484845 12.3809524 7.59013986 12.3809524 6.28909089 12.3809524 4.98804192 13.4571856 3.93333333 14.7847866 3.93333333 16.1123876 3.93333333 17.1886209 4.98804192 17.1886209 6.28909089 17.1886209 7.59013986 16.1123876 8.64484845 14.7847866 8.64484845zM14.7847866 7.24484845C15.3234094 7.24484845 15.7600494 6.81694121 15.7600494 6.28909089 15.7600494 5.76124057 15.3234094 5.33333333 14.7847866 5.33333333 14.2461638 5.33333333 13.8095238 5.76124057 13.8095238 6.28909089 13.8095238 6.81694121 14.2461638 7.24484845 14.7847866 7.24484845zM14.4601636 9.53333333C16.2439281 9.53333333 18.739971 10.5768022 19.1216797 11.3894096 19.2111469 11.5798735 19.2673146 11.8260286 19.3164557 12.154267 19.3570686 12.4255414 19.3832122 12.6912704 19.3983206 12.9239394 19.3983206 13.6525764 18.7955973 14.2448484 18.0516787 14.2448484L10.8686485 14.2448484C10.1247299 14.2448484 9.52200654 13.6525764 9.52381358 12.8741788 9.53711491 12.6912704 9.56325857 12.4255414 9.60387145 12.154267 9.65301252 11.8260286 9.70918027 11.5798735 9.79864749 11.3894096 10.1803562 10.5768022 12.676399 9.53333333 14.4601636 9.53333333zM17.640113 11.8877159C17.4205967 11.749334 17.1258374 11.5989159 16.798946 11.4622591 16.0135992 11.1339455 15.1733217 10.9333333 14.4601636 10.9333333 13.7470055 10.9333333 12.906728 11.1339455 12.1213812 11.4622591 11.7944897 11.5989159 11.4997305 11.749334 11.2802141 11.8877159 11.1557354 11.9661865 11.0741825 12.0345566 11.0919322 11.985243 11.0775308 12.0254691 11.0451342 12.1716507 11.0173111 12.3574955 10.9900451 12.5396192 10.9698457 12.7252268 10.9580681 12.8448484L17.9609457 12.8448484C17.9481839 12.7043326 17.9287466 12.5293627 17.9030161 12.3574955 17.8752531 12.1720522 17.8429363 12.0261008 17.8271716 11.9826596 17.8458379 12.0342996 17.7643578 11.9660391 17.640113 11.8877159zM11.0919322 11.985243C11.0930194 11.9822226 11.094479 11.9787608 11.0963242 11.9748328 11.0953896 11.9768224 11.0943649 11.9793451 11.0932577 11.9823789L11.0919322 11.985243zM6.8658008 9.09114214C5.21519954 9.09114214 3.87712284 7.77982697 3.87712284 6.16223774 3.87712284 4.5446485 5.21519954 3.23333333 6.8658008 3.23333333 8.51640206 3.23333333 9.85447876 4.5446485 9.85447876 6.16223774 9.85447876 7.77982697 8.51640206 9.09114214 6.8658008 9.09114214zM6.8658008 7.69114214C7.72742385 7.69114214 8.42590733 7.00662832 8.42590733 6.16223774 8.42590733 5.31784715 7.72742385 4.63333333 6.8658008 4.63333333 6.00417775 4.63333333 5.30569427 5.31784715 5.30569427 6.16223774 5.30569427 7.00662832 6.00417775 7.69114214 6.8658008 7.69114214z" />
        <path d="M6.8658008,10.3658274 C9.25989484,10.3658274 12.6456046,11.7267827 13.127808,12.7138476 C13.2404675,12.9444601 13.3157024,13.2614957 13.381315,13.6829001 C13.4140059,13.8928606 13.4414885,14.1150824 13.4641871,14.3369217 C13.4777928,14.4698938 13.4868718,14.5741671 13.4935064,14.6877971 C13.4935064,15.5412366 12.7712874,16.2236362 11.8939219,16.2236362 L1.83767965,16.2236362 C0.960314198,16.2236362 0.238095238,15.5412366 0.240049123,14.6360567 C0.244729841,14.5741671 0.253808779,14.4698938 0.267414494,14.3369217 C0.290113106,14.1150824 0.31759572,13.8928606 0.35028657,13.6829001 C0.415899205,13.2614957 0.491134139,12.9444601 0.603793586,12.7138476 C1.08599701,11.7267827 4.47170676,10.3658274 6.8658008,10.3658274 Z M6.8658008,11.7658274 C4.96223312,11.7658274 2.08595214,12.9220074 1.8923103,13.31839 C1.85982311,13.3848909 1.80739218,13.6058318 1.76251254,13.8940762 C1.73394361,14.0775633 1.70929215,14.2768926 1.68885763,14.4766044 C1.67658346,14.5965629 1.66853392,14.6890134 1.66666667,14.6877971 C1.66666667,14.7563702 1.73785784,14.8236362 1.83767965,14.8236362 L11.8939219,14.8236362 C11.9937438,14.8236362 12.0649349,14.7563702 12.0668888,14.7395374 C12.0630677,14.6890134 12.0550181,14.5965629 12.042744,14.4766044 C12.0223095,14.2768926 11.997658,14.0775633 11.9690891,13.8940762 C11.9242094,13.6058318 11.8717785,13.3848909 11.8392913,13.31839 C11.6456495,12.9220074 8.76936848,11.7658274 6.8658008,11.7658274 Z" />
      </g>
    </svg>
  )
}

IconUsers.defaultProps = {
  width: 20,
  height: 20,
  color: '#f6b530'
}

export default IconUsers
