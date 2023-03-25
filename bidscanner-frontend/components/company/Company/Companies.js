import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ContentFilterIcon from 'material-ui/svg-icons/content/filter-list';

const IconMenuExampleSimple = ({ companies, changeCurrentCompany }) => (
  <div>
    <IconMenu
      iconButtonElement={
        <IconButton>
          <ContentFilterIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      }
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {companies.map(company => (
        <MenuItem key={company.id} onClick={() => changeCurrentCompany(company)}>
          {company.name}
        </MenuItem>
      ))}
    </IconMenu>
  </div>
);

export default IconMenuExampleSimple;
