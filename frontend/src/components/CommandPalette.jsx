import React, { useState, useEffect, useRef } from 'react';
import { Input, Typography, Tag, Modal, List } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SearchOutlined, 
  DashboardOutlined, 
  ContainerOutlined, 
  UserOutlined, 
  SettingOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const translate = useLanguage();
  const inputRef = useRef(null);

  const actions = [
    { id: 'dash', title: translate('dashboard'), icon: <DashboardOutlined />, path: '/', shortcut: 'D' },
    { id: 'cust', title: translate('customers'), icon: <UserOutlined />, path: '/customer', shortcut: 'C' },
    { id: 'inv', title: translate('invoices'), icon: <ContainerOutlined />, path: '/invoice', shortcut: 'I' },
    { id: 'quote', title: translate('quote'), icon: <ThunderboltOutlined />, path: '/quote', shortcut: 'Q' },
    { id: 'sett', title: translate('settings'), icon: <SettingOutlined />, path: '/settings', shortcut: 'S' },
  ];

  const filteredActions = actions.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
          navigate(filteredActions[selectedIndex].path);
          setIsOpen(false);
        } else if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, navigate]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setSelectedIndex(0);
      setSearch('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="cmdk-overlay"
          onClick={() => setIsOpen(false)}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            paddingTop: '80px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            position: 'fixed', inset: 0, zIndex: 10000
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '600px',
              backgroundColor: '#18181B',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Input
                ref={inputRef}
                prefix={<SearchOutlined style={{ color: '#71717A', fontSize: '20px', marginRight: '12px' }} />}
                variant="borderless"
                placeholder="Search modules or actions... [Esc to close]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '18px', color: '#FFF' }}
              />
            </div>
            
            <div style={{ padding: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {filteredActions.map((action, idx) => (
                <div
                  key={action.id}
                  onClick={() => { navigate(action.path); setIsOpen(false); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: idx === selectedIndex ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                    border: idx === selectedIndex ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: '18px', marginRight: '16px', color: idx === selectedIndex ? '#7C3AED' : '#71717A' 
                    }}>
                      {action.icon}
                    </div>
                    <Text style={{ color: idx === selectedIndex ? '#FFF' : '#A1A1AA', fontWeight: 600 }}>
                      {action.title}
                    </Text>
                  </div>
                  <Tag style={{ 
                    backgroundColor: idx === selectedIndex ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)', 
                    color: '#D4D4D8', border: 'none', borderRadius: '4px', fontSize: '10px' 
                  }}>
                    {action.shortcut}
                  </Tag>
                </div>
              ))}
              {filteredActions.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#71717A' }}>
                   No results found for "{search}"
                </div>
              )}
            </div>
            
            <div style={{ 
              padding: '12px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex', justifyContent: 'flex-end', gap: '8px'
            }}>
              <Tag color="purple">⌘K to trigger</Tag>
              <Tag color="default">↵ to Select</Tag>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
