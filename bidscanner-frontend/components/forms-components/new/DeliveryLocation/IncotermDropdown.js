// import React, { Component } from 'react';
// import styled from 'styled-components';

// import Popover from 'material-ui/Popover';

// import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
// import Close from 'material-ui/svg-icons/navigation/close';

// const Button = styled.button`
//   padding: 0px 0px 6px 0px;
//   border: none;
//   background-color: white;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
//   font-size: 15px;
//   &:active,
//   &:focus {
//     outline: none;
//   }
// `;

// const Clear = styled.span`cursor: pointer;`;

// const Option = styled.div`
//   padding: 5px 15px;
//   cursor: pointer;
//   font-size: 15px;
//   &:hover {
//     background-color: #e5e5e5;
//   }
// `;

// const Options = styled.div`
//   padding: 5px 0px;
//   max-height: 40vh;
// `;

// export default class StandartFilter extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       open: false,
//     };
//   }

//   handleTouchTap = event => {
//     event.preventDefault();

//     this.setState({
//       open: true,
//       anchorEl: event.currentTarget,
//     });
//   };

//   handleRequestClose = () => {
//     this.setState({
//       open: false,
//     });
//   };

//   handleOptionClick = option => {
//     const { input: { onChange } } = this.props;
//     onChange(option);
//     this.handleRequestClose();
//   };

//   handleClearClick = e => {
//     e.stopPropagation();
//     const { input: { onChange } } = this.props;
//     onChange('');
//     this.setState({
//       open: false,
//     });
//   };

//   render() {
//     const { input: { value }, title, options = [] } = this.props;
//     return (
//       <DropdownMenu subfield="currency">
//         <MenuItem value="USD" primaryText="USD" />
//         <MenuItem value="EUR" primaryText="EUR" />
//         <MenuItem value="GBP" primaryText="GBP" />
//       </DropdownMenu>
//     );
//   }
// }
