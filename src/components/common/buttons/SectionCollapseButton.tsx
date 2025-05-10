import React from 'react';

interface SectionCollapseButtonProps {
  onClick: () => void;
  collapsed: boolean;
  className?: string;
  children?: React.ReactNode;
}

const style = `
.button {
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  background: #222;
  color: #fff;
  border: none;
  border-radius: 4px 0 0 4px;
  padding-top: 12px;
  padding-bottom: 28px;
  padding-left: 5px;
  padding-right: 5px;
  min-width: 24px;
  min-height: 80px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  opacity: 0.85;
  transition: background 0.2s, opacity 0.2s;
  overflow: visible;
}
.button:hover, .button:focus {
  background: #444;
  opacity: 1;
}
.collapsed {
  right: 0;
}
.expanded {
  right: 10px;
}
.buttonContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.arrow {
  font-size: 1.2em;
  margin-bottom: 16px;
}
.verticalText {
  display: inline-block;
  transform: rotate(-90deg);
  font-size: 1em;
  letter-spacing: 0.1em;
  vertical-align: middle;
  padding: 0 1px;
}
`;

const injectStyle = () => {
  if (!document.getElementById('section-collapse-btn-style')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'section-collapse-btn-style';
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
  }
};

const SectionCollapseButton: React.FC<SectionCollapseButtonProps> = ({ onClick, collapsed, className, children }) => {
  React.useEffect(() => {
    injectStyle();
  }, []);

  return (
    <button
      onClick={onClick}
      className={`button ${collapsed ? 'collapsed' : 'expanded'}${className ? ' ' + className : ''}`}
      aria-label={collapsed ? 'Expand code editor' : 'Collapse code editor'}
      type="button"
    >
      <span className="buttonContent">
        <span className="arrow">{collapsed ? '\u2190' : '\u2192'}</span>
        <span className="verticalText">{children}</span>
      </span>
    </button>
  );
};

export default SectionCollapseButton; 