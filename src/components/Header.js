import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-center items-center space-x-6">
      <div className="h-24 flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
        <p>M</p>
        <p>A</p>
        <img
          src="https://cdn.prod.website-files.com/62ecfefc58b878e68b3c7c20/6673f3ade8f353e75cd1f090_Vector.svg"
          loading="lazy"
          alt="maxion logo"
          className="h-8"
        />
        <p>I</p>
        <p>O</p>
        <p>N</p>
      </div>
      <div className="flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
        <p>D</p>
        <p>E</p>
        <p>V</p>
      </div>
      <div className="flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
        <p>H</p>
        <p>U</p>
        <p>B</p>
      </div>
    </div>
  );
};

export default Header;
