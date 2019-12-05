import React from 'react';
import Thumb from '@assets/thumb.svg';

function HeaderIcon() {
    return (
        <span
            className={"h5p-category-task-header-icon"}
        >
            <img
                alt={"thumb"}
                src={Thumb}
            />
        </span>
    );
}

export default HeaderIcon;