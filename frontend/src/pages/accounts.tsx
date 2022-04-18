import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../providers/api';

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

  function handleEdit(id: string) {
    console.log('Edit account: ', id);
    const account = accounts.find((a) => a.id === id);
    console.log(account);
  }

  return (
    <Layout>
      <h1>Accounts</h1>
      <ul>
        {accounts &&
          accounts.map((a) => (
            <li key={a.id}>
              {a.bank_code} - {a.name} -{' '}
              <button onClick={() => handleEdit(a.id)}>Editar</button>
            </li>
          ))}
      </ul>
    </Layout>
  );
};

export default Accounts;
