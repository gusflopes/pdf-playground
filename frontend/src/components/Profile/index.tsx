import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import NextLink from '../NextLink';
// import { Container } from './styles';

const Profile: React.FC = () => {
  const {
    accessToken,
    refreshToken,
    login,
    isAuthenticated,
    user,
    logout,
    refresh,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <>
      {isAuthenticated && (
        <article className="prose">
          <h2>Perfil</h2>
          <span>
            <strong>Nome: </strong>
            {user?.name}
          </span>
          <br />
          <span>
            <strong>Email: </strong>
            {user?.email}
          </span>
          <br />
          <div className="flex items-center justify-center">
            <div className="mx-2 p-2 w-max space-x-4 ">
              <button type="button" className="btn">
                Editar
              </button>
              <button type="button" className="btn" onClick={() => logout()}>
                Sair
              </button>
            </div>
          </div>
          <p className="break-words">
            <strong>[Access Token]</strong> <br />
            {accessToken}
            <br />
            <strong>[Refresh Token]</strong> <br />
            {refreshToken}
            <br />
            <button
              className="btn btn-accent text-base-100 w-full my-6"
              onClick={() => refresh()}
            >
              Refresh Token
            </button>
          </p>
        </article>
      )}

      {!isAuthenticated && (
        <article className="prose flex items-center justify-center w-full">
          <div className="flex-col items-center justify-center w-full max-w-sm">
            <h2 className="my-2 text-center">Acessar sua conta</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div>
                <div className="form-control w-full max-w-lg">
                  <label className="label">
                    <span className="label-text font-bold">
                      Digite seu e-mail
                    </span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    type="email"
                    placeholder="exemplo@gmail.com"
                    className="input input-bordered input-primary "
                  />
                  <label className="label">
                    <span className="label-text-alt hidden">Errors</span>
                    <span className="label-text-alt">Alt label 3</span>
                  </label>
                </div>
                <div className="form-control w-full max-w-sm ">
                  <label className="label">
                    <span className="label-text font-bold">
                      Digite sua senha
                    </span>
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    type="password"
                    placeholder="******"
                    className="input input-bordered input-primary w-full max-w-sm"
                  />
                  <label className="label">
                    <span className="label-text-alt hidden">Errors</span>
                    <span className="label-text-alt">Alt label 3</span>
                  </label>
                </div>
                <button
                  className="btn btn-accent text-base-100 w-full"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="text-center">
              Ainda não possui conta?{' '}
              <NextLink className="link-hover link-accent" href="#">
                Registrar!
              </NextLink>
              <br />
              <span className="text-base-300">Registro desabilitado.</span>
            </p>
          </div>
        </article>
      )}
    </>
  );
};

export default Profile;
