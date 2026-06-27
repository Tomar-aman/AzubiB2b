import React, { useState, useEffect } from 'react';
import { SVG } from '@/assets/svg';
import { Box } from '@mui/material';
export default function Header() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    // Add or remove the 'active' class on the <body> element
    if (isActive) {
      document.body.classList.add('active');
    } else {
      document.body.classList.remove('active');
    }

    // Cleanup function to ensure class is removed when component unmounts
    return () => {
      document.body.classList.remove('active');
    };
  }, [isActive]);

  return (
    <Box className="header">
      <Box sx={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
        <SVG.Slide onClick={handleClick} style={{ margin: "30px 18px", cursor: "pointer" }} />
        {/* <Box sx={{ width: "100%" }}>
          <Box className="toggleButton" onClick={()=>setShow(!show)}>
            <span>A</span>
            <SVG.Down />
          </Box>
         {show && <Box className="dropBoxed">
            <Link href="/account-setting">Account Setting</Link>
            <Link href="/">Log Out</Link>
          </Box>}
        </Box> */}
      </Box>
    </Box>
  );
}
