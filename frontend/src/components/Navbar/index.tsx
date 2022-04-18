import React from 'react';
import { Menu } from './Menu';
import { BurgerSvg } from './BurgerSvg';
// import { Container } from './styles';
import NextLink from '../NextLink';
import SlideOver from '../SlideOver';
import Profile from '../Profile';

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-neutral text-base-100 ">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <BurgerSvg />
          </label>
          <Menu dropdown />
        </div>
        <NextLink className="btn btn-ghost normal-case text-xl" href="/">
          HUB<strong className="text-accent">LAW</strong>
        </NextLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <Menu />
      </div>
      <div className="navbar-end mr-6">
        <SlideOver name="Perfil" title="MEU PERFIL">
          <Profile />
        </SlideOver>
        {/* <a className="btn bg-accent text-base-100 hover:bg-secondary">Perfil</a> */}
      </div>
    </div>
  );
};

export default Navbar;
