import { useHistory } from 'react-router-dom';
import './styles.css';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Department } from 'types/department';
import { Employee } from 'types/employee';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';

type UrlParams = {
  employeeId: string;
};

const Form = () => {
  const { employeeId } = useParams<UrlParams>();

  const isEditing = employeeId !== 'create';

  const history = useHistory();

  const [selectCategories, setSelectCategories] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Employee>();

  useEffect(() => {
    requestBackend({ url: '/departments' }).then((response) => {
      setSelectCategories(response.data.content);
    });
  }, []);

  useEffect(() => {
    if (isEditing) {
      requestBackend({ url: `/employees/${employeeId}` }).then((response) => {
        const employee = response.data as Employee;

        setValue('name', employee.name);
        setValue('email', employee.email);
        setValue('department', employee.department);
      });
    }
  }, [isEditing, employeeId, setValue]);

  const onSubmit = (formData: Department) => {
    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/employees/${employeeId}` : '/employees',
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Cadastrado com sucesso');
        history.push('/admin/employees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar employee');
      });
  };

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatorio',
                  })}
                  type="text"
                  className={`form-control base-input cor-branca  ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Nome do Funcionário"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">Mensagem de erro</div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatorio',
                  })}
                  type="text"
                  className={`form-control base-input cor-branca  ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Email do funcionário"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block"></div>
              </div>

              <div className="margin-bottom-30">
                <label htmlFor="departments" className="d-none">
                  Departamento
                </label>
                <Controller
                  name="department"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectCategories}
                      classNamePrefix="product-crud-select"
                      isMulti
                      getOptionLabel={(department: Department) =>
                        department.name
                      }
                      getOptionValue={(department: Department) =>
                        String(department.id)
                      }
                      inputId="departments"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatorio
                  </div>
                )}
              </div>
            </div>
            <div className="employee-crud-buttons-container">
              <button
                className="btn btn-outline-danger employee-crud-button"
                onClick={handleCancel}
              >
                CANCELAR
              </button>
              <button className="btn btn-primary employee-crud-button text-white">
                SALVAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
