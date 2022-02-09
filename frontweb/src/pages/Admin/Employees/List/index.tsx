import './styles.css';

import Pagination from 'components/Pagination';

import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';

type controlComponentsData = {
  activePage: number;
  //filterData: EmployeeFilterData;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<controlComponentsData>({
      activePage: 0,
      //  filterData: { name: '', category: null },
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
      // filterData: controlComponentsData.filterData,
    });
  };

  const getProducts = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/products`,
      params: {
        page: controlComponentsData.activePage,
        size: 3,
        // name: controlComponentsData.filterData.name,
        //categoryId: controlComponentsData.filterData.category?.id,
      },
    };
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
