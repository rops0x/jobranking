import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9]/g, '_');

const Dropdown = ({ data, onSelect }) => {
    const items = data && data[0] 
        ? Object.keys(data[0]).filter(key => typeof data[0][key] === 'string')
        : [];
    
    return (
        <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Select Criteria
            </button>
            <ul className="dropdown-menu">
                {items.map(item => (
                    <li key={item}>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            onSelect(sanitizeKey(item));
                        }}>
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dropdown;
