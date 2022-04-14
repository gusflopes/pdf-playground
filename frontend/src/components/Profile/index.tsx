import React, { useState } from 'react';

// import { Container } from './styles';

const Profile: React.FC = () => {
  const [jwt, setJwt] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <article className="prose">
      <h2>Perfil</h2>
      <span>
        <strong>Nome: </strong>Gustavo Lopes
      </span>
      <br />
      <span>
        <strong>Email: </strong>gustavo@hublaw.com.br
      </span>
      <br />
      <span>
        <strong>Nome: </strong>Gustavo Lopes
      </span>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-control w-full max-w-xs ">
          <label className="label">
            <span className="label-text">JWT Token</span>
          </label>
          <input
            value={jwt}
            onChange={(e) => setJwt(e.currentTarget.value)}
            type="text"
            placeholder="Digite o JWT Token"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <label className="label">
            <span className="label-text-alt hidden">Errors</span>
            <span className="label-text-alt">Alt label 3</span>
          </label>
        </div>
        <button className="btn" type="submit">
          SUBMIT!
        </button>
      </form>
      <span>{jwt}</span>
    </article>
  );
};

export default Profile;
