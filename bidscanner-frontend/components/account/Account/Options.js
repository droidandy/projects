import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Link from 'next/link';
import StyledLink from 'components/styled/StyledLink';

/**
 * Simple Icon Menus demonstrating some of the layouts possible using the `anchorOrigin` and
 * `targetOrigin` properties.
 */
const IconMenuExampleSimple = () => (
  <div>
    <IconMenu
      iconButtonElement={
        <IconButton>
          <SettingsIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      }
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem>
        <StyledLink>
          <Link href="/">
            <a>Change Password</a>
          </Link>
        </StyledLink>
      </MenuItem>
      <MenuItem>
        <StyledLink>
          <Link href="/">
            <a>Delete Account</a>
          </Link>
        </StyledLink>
      </MenuItem>
    </IconMenu>
  </div>
);

export default IconMenuExampleSimple;
