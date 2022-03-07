import { AxiosRequestConfig } from 'axios';
import EmployeeCard from 'components/EmployeeCard';
import Pagination from 'components/Pagination';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { hasAnyRoles } from 'util/auth';
import { requestBackend } from 'util/requests';

import './styles.css';

type controlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<controlComponentsData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
    });
  };

  const getEmployess = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/employees`,
      params: {
        page: controlComponentsData.activePage,
        size: 4,
      },
    };
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getEmployess();
  }, [getEmployess]);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) ? (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      ) : (
        <h1>Não tem</h1>
      )}

      {page?.content.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}

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
