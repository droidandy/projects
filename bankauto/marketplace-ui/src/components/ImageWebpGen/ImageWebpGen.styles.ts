import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      transform: 'translate(-50%, -50%)',
    },
    wrapper: {
      width: '100%',
      height: '100%',
    },
    image: {
      opacity: 1,
      width: '100%',
      height: '100%',
    },
    loadingOverlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.05s ease-in',
      opacity: 1,
      pointerEvents: 'none',
      '& +$wrapper': {
        opacity: 0,
      },
    },
    errorFallback: {
      width: '100%',
      height: '100%',
      backgroundPosition: 'center',
      backgroundSize: '30%',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      backgroundImage:
        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0zIDIyLjVINDUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICA8cGF0aCBkPSJNNDIgMzQuNVYzOUM0MiAzOS4zOTc4IDQxLjg0MiAzOS43Nzk0IDQxLjU2MDcgNDAuMDYwN0M0MS4yNzk0IDQwLjM0MiA0MC44OTc4IDQwLjUgNDAuNSA0MC41SDM2QzM1LjYwMjIgNDAuNSAzNS4yMjA2IDQwLjM0MiAzNC45MzkzIDQwLjA2MDdDMzQuNjU4IDM5Ljc3OTQgMzQuNSAzOS4zOTc4IDM0LjUgMzlWMzQuNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICAgIDxwYXRoIGQ9Ik0xMy41IDM0LjVWMzlDMTMuNSAzOS4zOTc4IDEzLjM0MiAzOS43Nzk0IDEzLjA2MDcgNDAuMDYwN0MxMi43Nzk0IDQwLjM0MiAxMi4zOTc4IDQwLjUgMTIgNDAuNUg3LjVDNy4xMDIxOCA0MC41IDYuNzIwNjQgNDAuMzQyIDYuNDM5MzQgNDAuMDYwN0M2LjE1ODA0IDM5Ljc3OTQgNiAzOS4zOTc4IDYgMzlWMzQuNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICAgIDxwYXRoIGQ9Ik0xMiAyOC41SDE1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogICAgPHBhdGggZD0iTTMzIDI4LjVIMzYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICA8cGF0aCBkPSJNNDIgMjIuNUwzNi4zOTU5IDkuODkwNzlDMzYuMjc4MSA5LjYyNTY1IDM2LjA4NTkgOS40MDAzNyAzNS44NDI2IDkuMjQyMjZDMzUuNTk5MyA5LjA4NDE1IDM1LjMxNTMgOSAzNS4wMjUyIDlIMTIuOTc0OEMxMi42ODQ3IDkgMTIuNDAwNyA5LjA4NDE1IDEyLjE1NzQgOS4yNDIyNkMxMS45MTQyIDkuNDAwMzcgMTEuNzIxOSA5LjYyNTY1IDExLjYwNDEgOS44OTA3OUw2IDIyLjVWMzQuNUg0MlYyMi41WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==)',
      '& +$wrapper': {
        opacity: 0,
      },
    },
  }),
  { name: 'Image' },
);

export { useStyles };
