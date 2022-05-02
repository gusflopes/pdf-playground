import { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../providers/api';

type Batch = {
  id: string;
  account_id: string;
  parser: string;
  transaction_type: string;
  name: string;
  created_at: string;
  updated_at: string;
  _count: {
    receipts: number;
    files: number;
  };
};

const Receipts: NextPage = () => {
  const something = '730ada6e-c184-4a89-88d4-19d9429b8123';
  const [accountId, setAccountId] = useState<string>();
  const [batches, setBatches] = useState([] as Array<Batch>);

  const loadReceipts = async (id: string) => {
    try {
      const response: AxiosResponse<Batch[]> = await api.get(
        `/accounts/${id}/batches`
      );
      console.log(response.data);
      setBatches(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = (id: string) => {
    // api request
    // delete from state
    const newArray = batches.filter((b) => b.id !== id);
    setBatches(newArray);
  };

  useEffect(() => {
    loadReceipts(accountId ? accountId : something);
  }, []);

  return (
    <Layout>
      <h1>Receipts</h1>
      <br />
      <button onClick={() => loadReceipts(accountId ? accountId : something)}>
        LOAD
      </button>
      <span> - </span>
      <button onClick={() => setBatches([])}>CLEAR</button>
      <br />
      <span>accountId: {accountId}</span>
      <br />
      <input
        type="text"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
      <br />
      <h2>Batches</h2>
      {batches.length > 0 && batches && (
        <table className="table-fixed border">
          <thead>
            <tr className="border bg-slate-900 text-white p-10 m-32">
              <th>id</th>
              <th>name</th>
              <th>parser</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id} className="border">
                <td className="px-3">{b.id}</td>
                <td className="px-3">{b.name}</td>
                <td className="px-3">{b.parser}</td>
                <td className="px-3">
                  <button onClick={() => alert(`EDIT ${b.id}`)}>EDIT</button> |{' '}
                  <button onClick={() => removeItem(b.id)}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
    </Layout>
  );
};

export default Receipts;
