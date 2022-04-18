import { FC } from 'react';
import NextLink from '../NextLink';

type CustomProps = {
  dropdown?: boolean;
};

export const Menu: FC<CustomProps> = ({ dropdown }) => {
  return (
    <ul
      className={
        dropdown
          ? 'menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral box w-60'
          : 'menu menu-horizontal p-0'
      }
    >
      <li className="hover:bg-secondary">
        <NextLink href="/accounts">Contas</NextLink>
      </li>
      <li tabIndex={0} className="hover:bg-secondary">
        <a>
          Comprovantes Bancários
          <svg
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
        </a>
        <ul className="p-2 text-base-100 bg-neutral">
          <li className="hover:bg-secondary">
            <NextLink href="/pdf-upload">Importar</NextLink>
          </li>
          <li className="hover:bg-secondary">
            <a>Lotes Importados</a>
          </li>
          <li className="hover:bg-secondary">
            <a>Alguma coisa</a>
          </li>
        </ul>
      </li>
      <li className="hover:bg-secondary">
        <a>Exportação</a>
      </li>
    </ul>
  );
};
