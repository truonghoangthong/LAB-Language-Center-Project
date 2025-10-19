import './module-title.css';

const ModuleTitle = ({ title, description }) => {
  return (
    <div className="module-title">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default ModuleTitle;
