import React from "react";

//Todo change to React Lotie
import bodymovin from "bodymovin";
import animationRose from "./animation_rose";
import MobileMenu from "../MobileMenu";
import "./index.scss";

export default class MobileMenuAnimation extends React.Component {

  constructor(props) {
    super(props);

    this.refAnimationDiv = React.createRef();
 
    this.animationManager = null;

    this.state = {
      isAnimationDone : props.isAnimationDone ? props.isAnimationDone : false,
    }
  }

  componentDidMount() {


    //reference for all config options
    //https://airbnb.io/lottie/#/web?id=usage


    this.lottieAnimationManager = bodymovin.loadAnimation({
      container : this.refAnimationDiv.current,
      renderer: "svg",
      loop: false,
      autoplay: !1,
      animationData: animationRose,
      rendererSettings: {
        preserveAspectRatio: "none",
        clearCanvas:true
      },
    }); 
    this.lottieAnimationManager.onComplete = () => {};
    this.lottieAnimationManager.addEventListener('enterFrame', () => {
      if (this.state.isAnimationDone == false &&  this.lottieAnimationManager.currentFrame >25) 
        this.setState({isAnimationDone:true});

    });
    this.lottieAnimationManager.setSpeed(1);
    this.lottieAnimationManager.playSegments([0, 1]);
     
  }

  render() {
    return (
      <div className="MobileMenuAnimation">
        <div style={{display: this.state.isAnimationDone ? 'block' : 'none'}}>
          <MobileMenu {...this.props} />
        </div>
       <div className="animation" ref={this.refAnimationDiv} style={{display: this.state.isAnimationDone ? 'none' : 'block'}}/>
      </div>
    );
  }

 /* 
 fadeEffect = null;
   nextMenuBackground = null;
   menuAnimation = null;
   animationsList = null;
   
   handleClickBurger = (e) => {
     e.preventDefault();
 
     this.setState({ isMobileMenuOpen: false });
 
     e.target.classList.add("show_mobile_menu");
 
     const direction = document
       .querySelector("body")
       .classList.contains("activeOffCanvas")
       ? -1
       : 1;
     this.menuAnimation.setDirection(direction);
 
     if (direction > 0) {
       this.nextMenuBackground++;
       this.menuAnimation.setSpeed(1);
       this.fadeOut(".off-canvas-menu nav", 0);
       document.querySelector("body").classList.add("activeOffCanvas");
       this.menuAnimation.play();
       this.fadeIn(".off-canvas-menu nav", 60);
     }
   };
 
   handleClickCross = (e) => {
     e.preventDefault();
 
     this.setState({ isMobileMenuOpen: true });
 
     e.target.classList.remove("show_mobile_menu");
 
     this.menuAnimation.setSpeed(1.5);
 
     this.menuAnimation.addEventListener("complete", () => {
       document.querySelector("body").classList.remove("activeOffCanvas");
 
       const direction = document
         .querySelector("body")
         .classList.contains("activeOffCanvas")
         ? -1
         : 1;
       this.menuAnimation.setDirection(direction);
       document.querySelector("#off-canvas-animation").innerHTML = "";
       this.menuAnimation = this.loadNextAnimation();
     });
 
     this.menuAnimation.play();
     this.fadeOut(".off-canvas-menu nav", 1000);
   }; 
   menuInit(animationsList) {
     this.nextMenuBackground = 0;
     this.animationsList = animationsList;
     this.menuAnimation = this.loadNextAnimation();
   }
   getNextMenuBackground() {
     if (this.nextMenuBackground === this.animationsList.length)
       this.nextMenuBackground = 0;
     return this.animationsList[this.nextMenuBackground];
   }
   loadNextAnimation() {
     if (this.props.isAnimationOff) return null;
     return bodymovin.loadAnimation({
       container: document.getElementById("off-canvas-animation"),
       renderer: "svg",
       loop: false,
       autoplay: !1,
       //path: this.getNextMenuBackground(),
       animationData: animationRose,
       rendererSettings: {
         preserveAspectRatio: "none",
       },
     });
   }
 
   fadeOut = (target, interval) => {
     const fadeTarget = document.querySelector(target);
     fadeTarget.style.opacity = 1;
 
     clearInterval(this.fadeEffect);
 
     this.fadeEffect = setInterval(function() {
       if (!fadeTarget.style.opacity) {
         fadeTarget.style.opacity = 1;
       }
       if (fadeTarget.style.opacity > 0) {
         fadeTarget.style.opacity -= 0.1;
       } else {
         clearInterval(this.fadeEffect);
       }
     }, interval);
   };
   fadeIn = (target, interval) => {
     const fadeTarget = document.querySelector(target);
     fadeTarget.style.opacity = 0;
 
     clearInterval(this.fadeEffect);
 
     this.fadeEffect = setInterval(function() {
       if (!fadeTarget.style.opacity) {
         fadeTarget.style.opacity = 0;
       }
       if (fadeTarget.style.opacity < 1) {
         fadeTarget.style.opacity = Number(fadeTarget.style.opacity) + 0.1;
       } else {
         clearInterval(this.fadeEffect);
       }
     }, interval);
   };
 
   */
}
