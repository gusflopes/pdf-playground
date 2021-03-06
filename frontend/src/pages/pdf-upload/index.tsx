// import React from 'react';
import type { NextPage } from 'next';
// import classes from './styles.module.scss';
import { useDropzone, FileRejection, DropzoneState } from 'react-dropzone';
import styled from 'styled-components';
import { useState, useEffect, useMemo, useContext } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Button from '../../components/Button';
import Navbar from '../../components/Navbar';
import { api } from '../../providers/api';
import { AuthContext } from '../../context/AuthContext';

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const FileContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

interface Receipt {
  id: string;
  account_id: string;
  batch_id: string;
  date: string;
  amount: string;
  payee: string;
  cpf_cnpj: string;
  pix: string | null;
  raw: string;
  type?: string;
  memo?: string;
  exclude: boolean;
  created_at: string;
  updated_at: string;
}

interface BatchResponse {
  newBatch: {
    id: string;
    account_id: string;
    parser: string;
    name: string;
    receipts: Receipt[];
  };
}

const PdfUpload: NextPage = () => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  }: DropzoneState = useDropzone({ accept: 'application/pdf', maxFiles: 200 });
  const { accessToken } = useContext(AuthContext);

  const [files, setFiles] = useState(acceptedFiles as File[]);
  const [receipts, setReceipts] = useState([] as Receipt[]);
  const [parsers, setParsers] = useState([] as string[]);
  const [selectedParser, setSelectedParser] = useState('');

  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      // setFiles(files => [...files, acceptedFiles]) // singleFile
      setFiles((files) => files.concat([...acceptedFiles]));
    }
  }, [acceptedFiles]);

  const deleteItem = async (item: string) => {
    console.log(item);
    const updatedFiles = files.filter((file) => item !== file.name);
    setFiles(updatedFiles);
  };

  const FileItems = useMemo(() => {
    return files.map((f) => (
      <li key={f.name}>
        {f.name}{' '}
        <button key={f.name} onClick={() => deleteItem(f.name)}>
          Delete
        </button>
      </li>
    ));
  }, [files]);

  async function handleUpload() {
    console.log('Handle Upload !');
    console.log(files);
    const accountId = '814bd772-62fa-4e28-b24c-6192078595db';
    // const accessToken =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDY1YTc5Ny03MGQ1LTRlYWQtYTlkMi1kZGYxNWEzYTYzNmUiLCJpYXQiOjE2NTIxNzE2NzgsImV4cCI6MTY1MjE3MzQ3OH0.n0FitA4WcF4DhlnpuZuQfhYI1Xc9QN13FwWEjXebUB0';
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'multipart/form-data',
      },
    };
    const url = `http://localhost:3333/accounts/${accountId}/batches`;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('name', 'Terceira Importa????o');
    formData.append('parser', 'P_399_TEDC');
    formData.append('transaction_type', 'TEDC');

    // formData.append('parser', 'P_399_Transferencia');
    // formData.append('parser', 'P_341_PIX');
    // formData.append('transaction_type', 'PIX');

    try {
      const response: AxiosResponse<BatchResponse> = await api.post(
        `/accounts/${accountId}/batches`,
        formData,
        config
      );
      console.log(response.data);
      setReceipts(response.data.newBatch.receipts);
      setFiles([]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getParsers() {
      try {
        const response = await api.get(`parsers`);
        setParsers(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    getParsers();
  }, []);

  useEffect(() => {
    console.log(parsers);
  }, [parsers]);

  const fileRejectionItems = fileRejections.map(
    ({ file, errors }: FileRejection) => {
      return (
        <li key={file.name}>
          {file.name} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      );
    }
  );

  return (
    <>
      <Navbar />
      <header className="App-header">
        <h1>CTOOLS: Banking Receipt PDF Parser</h1>
      </header>
      <main>
        <h2>Configura????es</h2>
        {selectedParser ? (
          <span className="parser-selector">
            <strong>Parser: </strong>
            {selectedParser}
            <Button onClick={() => setSelectedParser('')}>Limpar</Button>
          </span>
        ) : (
          <>
            <span className="parser-selector">
              Selecione o interpretador antes de prosseguir:
            </span>
            <ul className="parser-list">
              {parsers.map((p) => {
                return (
                  <li key={p} onClick={() => setSelectedParser(p)}>
                    {p}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <h2>
          Fa??a upload dos comprovantes (um por p??gina) em formato PDF apenas
        </h2>
        <FileContainer
          {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          <p>Arraste seus arquivos aqui</p>
        </FileContainer>
      </main>
      <nav style={{ marginTop: 18 }}>
        <Button onClick={() => setFiles([])}>Clear All</Button>
        <Button onClick={() => console.log(files)}>LOG !</Button>
        <Button onClick={() => handleUpload()}>SAVE</Button>
      </nav>
      <aside>
        <h4>Accepted Files</h4>
        <ul>{files && FileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>

        <h4>Receipts</h4>
        {receipts &&
          receipts.map((r) => (
            <li key={`${r.date}-${r.cpf_cnpj}-${r.amount}`}>
              {r.date} - {r.payee} - {r.cpf_cnpj} - {r.amount}
            </li>
          ))}
      </aside>
    </>
  );
};

export default PdfUpload;
