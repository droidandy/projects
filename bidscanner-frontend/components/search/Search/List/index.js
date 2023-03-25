import { Flex } from 'grid-styled';

import ProductList from 'components/search/Search/List/ProductList';
import RFQList from 'components/search/Search/List/RFQList';
import SupplierList from 'components/search/Search/List/SupplierList';

import Pagination from 'components/search/Search/Pagination';

export default ({ query: { entity } }) => {
  let List = null;
  switch (entity) {
    case 'Requests':
      List = <RFQList />;
      break;
    case 'Products':
      List = <ProductList />;
      break;
    case 'Suppliers':
      List = <SupplierList />;
      break;
    default:
      List = null;
  }
  return (
    <div>
      {List}
      <Flex justify="center" mt={4}>
        <Pagination />
      </Flex>
    </div>
  );
};
