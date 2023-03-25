// @flow
import React from 'react';
import styled from 'styled-components';

import FroalaEditor from 'react-froala-wysiwyg';

const FroalaClassAdapter = props => {
  const { config, className } = props;
  const updatedConfig = className ? { ...config, editorClass: className } : config;

  return <FroalaEditor {...props} config={updatedConfig} />;
};

const StyledFroala = styled(FroalaClassAdapter)`
  width: 100%;

  .fr-wrapper {
    box-shadow: none !important;
    border-radius: 4px;
  }

  .fr-element {
    padding-right: 1.5em !important;
    padding-left: 1em !important;
  }

  .fr-placeholder {
    color: #BCBEC0 !important;
  }

  .fr-counter {
    margin: 0 !important;
    border: 0 none !important;
    z-index: 9;
    background: transparent !important;
  }

  .fr-toolbar {
    box-shadow: none !important;
    border: 0 none !important;
    padding: 6px 12px !important;
    border-radius: 4px;

    .fr-separator.fr-vs {
      width: 0 !important;
      height: 26px !important;
      margin: 0 16px !important;
    }

    .fr-btn {
      width: 26px !important;
      height: 26px !important;
      margin: 0 !important;
      text-align: center;

      i {
        margin: 6px 6px !important;
      }

      &.fr-active {
        background: #ebebeb !important;
      }
    }

    .fr-btn[data-cmd=insertImage] {
      width: auto !important;
      padding: 0 2px;
      color: #bcbec0;

      object, img {
        all: initial;
        display: inline;
        vertical-align: middle;
        margin-right: 3px;
        cursor: pointer;
      }
    }

    .fr-btn[data-cmd=bold] {
      &::after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        margin: 1px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjQkNCRUMwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNS42IDEwLjc5Yy45Ny0uNjcgMS42NS0xLjc3IDEuNjUtMi43OSAwLTIuMjYtMS43NS00LTQtNEg3djE0aDcuMDRjMi4wOSAwIDMuNzEtMS43IDMuNzEtMy43OSAwLTEuNTItLjg2LTIuODItMi4xNS0zLjQyek0xMCA2LjVoM2MuODMgMCAxLjUuNjcgMS41IDEuNXMtLjY3IDEuNS0xLjUgMS41aC0zdi0zem0zLjUgOUgxMHYtM2gzLjVjLjgzIDAgMS41LjY3IDEuNSAxLjVzLS42NyAxLjUtMS41IDEuNXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+);
      }

      i {
        display: none;
      }
    }

    .fr-btn[data-cmd=italic] {
      &::after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        margin: 1px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjQkNCRUMwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xMCA0djNoMi4yMWwtMy40MiA4SDZ2M2g4di0zaC0yLjIxbDMuNDItOEgxOFY0eiIvPgo8L3N2Zz4=);
      }

      i {
        display: none;
      }
    }

    .fr-btn[data-cmd=underline] {
      &::after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        margin: 1px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjQkNCRUMwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xMiAxN2MzLjMxIDAgNi0yLjY5IDYtNlYzaC0yLjV2OGMwIDEuOTMtMS41NyAzLjUtMy41IDMuNVM4LjUgMTIuOTMgOC41IDExVjNINnY4YzAgMy4zMSAyLjY5IDYgNiA2em0tNyAydjJoMTR2LTJINXoiLz4KPC9zdmc+);
      }

      i {
        display: none;
      }
    }

    .fr-btn[data-cmd=formatUL] {
      &::after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        margin: 1px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjQkNCRUMwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0zIDEzaDJ2LTJIM3Yyem0wIDRoMnYtMkgzdjJ6bTAtOGgyVjdIM3Yyem00IDRoMTR2LTJIN3Yyem0wIDRoMTR2LTJIN3Yyek03IDd2MmgxNFY3SDd6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==);
      }

      i {
        display: none;
      }
    }

    .fr-btn[data-cmd=formatOL] {
      &::after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        margin: 1px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjQkNCRUMwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAxN2gydi41SDN2MWgxdi41SDJ2MWgzdi00SDJ2MXptMS05aDFWNEgydjFoMXYzem0tMSAzaDEuOEwyIDEzLjF2LjloM3YtMUgzLjJMNSAxMC45VjEwSDJ2MXptNS02djJoMTRWNUg3em0wIDE0aDE0di0ySDd2MnptMC02aDE0di0ySDd2MnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
      }

      i {
        display: none;
      }
    }
  }
`;

export default StyledFroala;
