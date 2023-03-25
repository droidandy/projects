import React from "react";
import styles from "./styles.module.scss";

const Tab2 = () => (
  <>
    <div className={styles.content}>
      <label className="subheader-medium h4">One API for all platforms</label>
      <p className="text text_xl">
        Apphud supports iOS and Android apps. If a customer purchases
        subscription on Android device, he will still remain access to the
        premium features on iPhone.
      </p>
      <a href="/development" className="link">
        Learn about Apphud for development
      </a>
    </div>

    <div className={styles.platform}>
      <img src={require("./img.svg")} />
    </div>
  </>
);

export default Tab2;

// const Tab2 = () => (
//   <>
//     <div className={styles.content}>
//       <h4 className="subheader-medium">One API for all platforms</h4>
//       <p className="text text_xl">
//         Apphud supports iOS and Android apps. If a customer purchases
//         subscription on Android device, he will still remain access to the
//         premium features on iPhone.
//       </p>
//       <a href="/" className="link">
//         Learn about Apphud for development
//       </a>
//     </div>

//     <div className={styles.platform}>
//       <div className={styles.star}>
//         <svg
//           width="25"
//           height="26"
//           viewBox="0 0 25 26"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M12.4517 26C12.297 25.7596 12.1616 25.6194 12.1036 25.4592C11.3689 23.416 10.6535 21.3729 9.93813 19.3297C9.72544 18.7288 9.51276 18.1079 9.31941 17.4869C9.1454 16.9461 8.87471 16.4854 8.33333 16.2851C7.40526 15.9445 6.49652 15.604 5.56845 15.2435C4.50503 14.8428 3.46094 14.4222 2.41686 14.0216C1.77881 13.7812 1.14076 13.5809 0.502707 13.3205C0.309358 13.2404 0.174014 13.0401 0 12.8798C0.174014 12.7396 0.309358 12.5193 0.502707 12.4592C1.56613 12.0385 2.64888 11.6379 3.7123 11.2373C4.69838 10.8567 5.66512 10.4961 6.6512 10.1156C7.19258 9.91525 7.73395 9.71495 8.29466 9.51464C8.7587 9.33436 9.06806 9.01387 9.24207 8.53313C9.57077 7.59168 9.89946 6.65023 10.2282 5.72881C10.7695 4.2265 11.3109 2.70416 11.8523 1.20185C11.949 0.921418 11.9876 0.620955 12.123 0.340524C12.2003 0.180277 12.3743 0 12.5097 0C12.645 0 12.819 0.200308 12.877 0.360555C13.6118 2.4037 14.3271 4.44684 15.0619 6.48998C15.2746 7.11094 15.4872 7.75193 15.6999 8.37288C15.8739 8.93374 16.164 9.33436 16.7247 9.53467C18.1168 10.0354 19.5089 10.5562 20.901 11.0971C21.8871 11.4777 22.8732 11.8783 23.8786 12.2589C24.1299 12.359 24.42 12.3991 24.652 12.5193C24.8067 12.5994 25 12.7596 25 12.8998C25 13.02 24.8067 13.2404 24.6713 13.2804C22.2351 14.2419 19.8183 15.1433 17.4014 16.0647C17.3047 16.1048 17.1887 16.1448 17.0727 16.1649C16.2606 16.3451 15.8353 16.8459 15.5839 17.6872C15.2746 18.7689 14.8299 19.8105 14.4625 20.8721C14.1145 21.8736 13.7471 22.8552 13.3991 23.8567C13.2057 24.4176 13.0317 24.9985 12.819 25.5593C12.7997 25.6795 12.645 25.7997 12.4517 26Z"
//             fill="#FFB9F8"
//           />
//         </svg>
//       </div>
//       <img src={require('../images/platform.svg')} />
//       <div className={styles.user}>
//         <div>
//           <h4>User #81714</h4>
//           <div className={styles.item}>
//             <div>
//               <img src={require('../images/rocket.svg')} />
//             </div>

//             <span>Trial User</span>
//           </div>

//           <div className={styles.item}>
//             <div>
//               <img src={require('../images/dollar.svg')} />
//             </div>

//             <span>Paying User</span>
//           </div>

//           <div className={styles.item}>
//             <div>
//               <img src={require('../images/return.svg')} />
//             </div>

//             <span>
//               Subscription <br /> Renewed
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );

// export default Tab2;
