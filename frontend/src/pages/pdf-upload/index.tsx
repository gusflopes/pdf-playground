// import React from 'react';
import type { NextPage } from 'next';
// import classes from './styles.module.scss';
import { useDropzone, FileRejection, DropzoneState } from 'react-dropzone';
import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Button from '../../components/Button';
import Navbar from '../../components/Navbar';
import { api } from '../../providers/api';

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
  amount: string;
  cpfCnpj: string;
  date: string;
  name: string;
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
  }: DropzoneState = useDropzone({ accept: 'application/pdf', maxFiles: 10 });

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
    const accountId = '730ada6e-c184-4a89-88d4-19d9429b8123';
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGY0OWYzOC04NzAxLTQyNzctOTZhYS0xMjMzZjE2NzE2NmIiLCJpYXQiOjE2NDk2ODc0NjQsImV4cCI6MTY0OTY4OTI2NH0.9zyM_uX3P0CZZn81HUfSaIukmzGGcYIfiNK5hGRTHvo';
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
    formData.append('name', 'Primeira Importação');
    formData.append('parser', 'P_341_PIX');
    formData.append('transaction_type', 'PIX');

    try {
      const response: AxiosResponse<Receipt[]> = await api.post(
        `/accounts/${accountId}/batches`,
        formData,
        config
      );
      console.log(response.data);
      setReceipts(response.data);
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
        <h2>Configurações</h2>
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
          Faça upload dos comprovantes (um por página) em formato PDF apenas
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
            <li key={`${r.date}-${r.cpfCnpj}-${r.amount}`}>
              {r.date} - {r.name} - {r.cpfCnpj} - {r.amount}
            </li>
          ))}
      </aside>
    </>
  );
};

export default PdfUpload;
