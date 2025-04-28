import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { RootState } from '../store/store';
import { removeContact } from '../store/contactsSlice';
import { Contact, ContactPriority, ContactStatus } from '../types/Contact';
import ContactForm from './ContactForm';
import { Trash, PencilSimple, Clock, CheckCircle, Warning } from '@phosphor-icons/react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.active ? 'white' : '#374151'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#d1d5db'};
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ContactCard = styled.div<{ priority: ContactPriority }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'urgente': return '#ef4444';
      case 'importante': return '#f59e0b';
      default: return '#10b981';
    }
  }};
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ContactInfo = styled.div`
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0;
  }
`;

const StatusBadge = styled.span<{ status: ContactStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.status === 'concluido' ? '#d1fae5' : '#fef3c7'};
  color: ${props => props.status === 'concluido' ? '#059669' : '#d97706'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button<{ variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: ${props => props.variant === 'danger' ? '#fee2e2' : '#e5e7eb'};
  color: ${props => props.variant === 'danger' ? '#dc2626' : '#374151'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#fecaca' : '#d1d5db'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContactList: React.FC = () => {
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const dispatch = useDispatch();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'todos' | ContactStatus | ContactPriority>('todos');

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      dispatch(removeContact(id));
      toast.success('Contato excluído com sucesso!');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'todos') return true;
    return contact.status === filter || contact.priority === filter;
  });

  const stats = {
    total: contacts.length,
    pendentes: contacts.filter(c => c.status === 'pendente').length,
    concluidos: contacts.filter(c => c.status === 'concluido').length,
    urgentes: contacts.filter(c => c.priority === 'urgente').length,
    importantes: contacts.filter(c => c.priority === 'importante').length,
  };

  return (
    <Container>
      {editingContact ? (
        <>
          <h2>Editar Contato</h2>
          <ContactForm 
            contact={editingContact} 
            onSubmit={() => setEditingContact(null)}
          />
          <FilterButton onClick={() => setEditingContact(null)}>
            Cancelar
          </FilterButton>
        </>
      ) : (
        <>
          <StatsContainer>
            <StatCard>
              <h3>Total de Contatos</h3>
              <p>{stats.total}</p>
            </StatCard>
            <StatCard>
              <h3>Pendentes</h3>
              <p>{stats.pendentes}</p>
            </StatCard>
            <StatCard>
              <h3>Concluídos</h3>
              <p>{stats.concluidos}</p>
            </StatCard>
            <StatCard>
              <h3>Urgentes</h3>
              <p>{stats.urgentes}</p>
            </StatCard>
          </StatsContainer>

          <FiltersContainer>
            <FilterButton 
              active={filter === 'todos'} 
              onClick={() => setFilter('todos')}
            >
              Todos
            </FilterButton>
            <FilterButton 
              active={filter === 'pendente'} 
              onClick={() => setFilter('pendente')}
            >
              Pendentes
            </FilterButton>
            <FilterButton 
              active={filter === 'concluido'} 
              onClick={() => setFilter('concluido')}
            >
              Concluídos
            </FilterButton>
            <FilterButton 
              active={filter === 'urgente'} 
              onClick={() => setFilter('urgente')}
            >
              Urgentes
            </FilterButton>
            <FilterButton 
              active={filter === 'importante'} 
              onClick={() => setFilter('importante')}
            >
              Importantes
            </FilterButton>
          </FiltersContainer>

          <ContactGrid>
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} priority={contact.priority}>
                <ContactHeader>
                  <StatusBadge status={contact.status}>
                    {contact.status === 'concluido' ? (
                      <>
                        <CheckCircle weight="bold" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <Clock weight="bold" />
                        Pendente
                      </>
                    )}
                  </StatusBadge>
                  <ButtonGroup>
                    <IconButton onClick={() => setEditingContact(contact)}>
                      <PencilSimple weight="bold" />
                    </IconButton>
                    <IconButton 
                      variant="danger"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash weight="bold" />
                    </IconButton>
                  </ButtonGroup>
                </ContactHeader>

                <ContactInfo>
                  <h3>{contact.fullName}</h3>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </ContactInfo>

                {contact.priority !== 'normal' && (
                  <StatusBadge status="pendente">
                    <Warning weight="bold" />
                    {contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1)}
                  </StatusBadge>
                )}
              </ContactCard>
            ))}
          </ContactGrid>
        </>
      )}
    </Container>
  );
};

export default ContactList;