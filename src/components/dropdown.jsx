import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';

const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9]/g, '_');

const Dropdown = ({ data, onSelect, reset }) => {
    const [selectedCriteria, setSelectedCriteria] = useState('Select Criteria');
    
    useEffect(() => {
        if (reset) {
            setSelectedCriteria('Select Criteria');
        }
    }, [reset]);
    
    const items = data && data[0] 
        ? Object.keys(data[0]).filter(key => typeof data[0][key] === 'string')
        : [];
    
    const handleSelect = (item) => {
        const sanitizedKey = sanitizeKey(item);
        onSelect(sanitizedKey);
        setSelectedCriteria(item);
    }
    
    return (
        <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {selectedCriteria}
            </button>
            <ul className="dropdown-menu">
                {items.map(item => (
                    <li key={item}>
                        <a className="dropdown-item" href="#" onClick={(e) => {
                            e.preventDefault();
                            handleSelect(item);
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
