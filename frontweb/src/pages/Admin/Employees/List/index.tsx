import './styles.css';

import Pagination from 'components/Pagination';

import { Link } from 'react-router-dom';

const List = () => {
  const handlePageChange = (pageNumber: number) => {
    // to do
  };

  return (
    <>
      <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>

      <Pagination
        forcePage={0}
        pageCount={1}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
