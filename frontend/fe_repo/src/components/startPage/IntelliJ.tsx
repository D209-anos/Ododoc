import React, { useState, useEffect } from 'react';

function IntelliJ() {
    const [activeSection, setActiveSection] = useState<number>(0);

    useEffect(() => {
        const positions = [600, 1200, 1800, 2400];
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            const newActiveSection = positions.findIndex(pos => scrollPosition < pos) - 1;
            if (newActiveSection !== activeSection && newActiveSection >= 0) {
                setActiveSection(newActiveSection);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection])
    
    return (
        <div>
            <div>
                {activeSection >= 0 && <div>1</div>}
                {activeSection >= 1 && (
                <svg width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
                </svg>
                )}
                {activeSection >= 2 && <div>2</div>}
                {activeSection >= 3 && (
                <svg width="100" height="100">
                    <rect x="10" y="10" width="80" height="80" stroke="blue" strokeWidth="3" fill="green" />
                </svg>
                )}
                {activeSection >= 4 && <div>3</div>}
                {activeSection >= 5 && (
                <svg width="100" height="100">
                    <polygon points="50,5 95,99 5,39 95,39 5,99" stroke="orange" strokeWidth="3" fill="purple" />
                </svg>
                )}
                {activeSection >= 6 && <div>4</div>}
      </div>
        </div>
    )
}

export default IntelliJ;
