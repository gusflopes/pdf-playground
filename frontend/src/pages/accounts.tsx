import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../providers/api';
import { useForm } from 'react-hook-form';

type Account = {
  id: string;
  user_id: string;
  name: string;
  bank_code: string;
  branch?: string;
  number?: string;
  created_at: string; // DateTime
  updated_at: string; // DateTime
};

const Accounts: NextPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState({} as Account);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm();

  const onSubmit = async (data: Partial<Account>) => {
    // ...
    console.log('New Account: ', !isEditing);
    console.log(data);

    // Create new account
    if (!isEditing) {
      try {
        const newAccount: AxiosResponse<Account> = await api.post(
          '/accounts',
          data
        );
        setAccounts((accounts) => [...accounts, newAccount.data]);
        setCurrentAccount(newAccount.data);

        console.log(newAccount);
        return;
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          console.log('axios error: ', err);
          console.log('error code: ', err.code);
          // console.log(err.code === ' ');
        } else {
          console.log('Unexpected Error: ', err);
        }
      }
    }
    console.log('Updating account: ', currentAccount.id);

    // Update account
  };

  const resetForm = () => {
    // clear form
    setIsEditing(false);
    setCurrentAccount({} as Account);
    for (const [key] of Object.entries(currentAccount)) {
      resetField(key);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const accounts: AxiosResponse<Account[]> = await api.get('/accounts');
        console.log(accounts.data);
        setAccounts(accounts.data);
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          console.log('axios error: ', err);
          console.log('error code: ', err.code);
          // console.log(err.code === ' ');
        } else {
          console.log('Unexpected Error: ', err);
        }
      }
    }
    console.log('Load accounts');
    fetchData();
  }, []);

  const handleSelect = (id: string) => {
    console.log('Edit account: ', id);
    const selectedAccount = accounts.find((a) => a.id === id);
    if (!selectedAccount) {
      return;
    }
    setCurrentAccount(selectedAccount);
    setIsEditing(true);
    // update the form

    for (const [key, value] of Object.entries(selectedAccount)) {
      setValue(key, value);
      // console.log(`updating key: ${key}`);
    }
    console.log(selectedAccount);
  };

  const handleDelete = (id: string) => {
    console.log('Delete account: ', id);
    if (id === currentAccount.id) resetForm;
    // delete account api
  };

  return (
    <Layout>
      <h1>Accounts</h1>
      <ul>
        {accounts &&
          accounts.map((a) => (
            <li key={a.id}>
              {a.bank_code} - {a.name} - {a.branch} - {a.number}
              <button onClick={() => handleSelect(a.id)}>Editar</button>
              <button onClick={() => handleDelete(a.id)}>Excluir</button>
            </li>
          ))}
      </ul>
      <h2>----</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>name</label>
        <input type="text" {...register('name')} />
        {errors.name && <span>Name is required.</span>}
        <label>bank_code</label>
        <input type="text" {...register('bank_code')} />
        {errors.bank_code && <span>Bank_code is required.</span>}
        <label>branch</label>
        <input type="text" {...register('branch')} />
        <label>number</label>
        <input type="text" {...register('number')} />
        <button type="submit">Enviar</button>
        <button type="button" onClick={resetForm}>
          Limpar
        </button>
      </form>
    </Layout>
  );
};

export default Accounts;
