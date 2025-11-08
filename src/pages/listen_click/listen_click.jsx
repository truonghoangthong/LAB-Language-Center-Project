import './listen_click.css';
import { Icon } from '@iconify/react';
import SubNavBar from '../../components/sub-nav-bar/sub-nav-bar';

const ListenAndClick = () => {
  return (
    <div className="listen-click">
      <div className="title-row">
        <Icon icon="famicons:book" width="32" height="32" />
        <h1 className="section-title">Listening section</h1>
      </div>
      <SubNavBar />
    </div>
  );
};

export default ListenAndClick;
