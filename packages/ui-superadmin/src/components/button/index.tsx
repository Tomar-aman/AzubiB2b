import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface FilledButtonProps extends ButtonProps {
    children: ReactNode;
    className?: string;
}

const FilledButton: React.FC<FilledButtonProps> = ({ children, className, ...rest }) => {
    return (
        <Button className={className} {...rest}>
            {children}
        </Button>
    );
};

export default FilledButton;