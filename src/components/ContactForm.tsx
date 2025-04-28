import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { addContact, editContact } from '../store/contactsSlice';
import { Contact, ContactPriority, ContactStatus } from '../types/Contact';
import { v4 as uuidv4 } from 'uuid';
import { Plus, PencilSimple } from '@phosphor-icons/react';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 20px auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AccessibleSelect = styled(({ className, label, ...props }) => (
  <select className={className} aria-label={label} title={label} {...props} />
))`
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface ContactFormProps {
  contact?: Contact;
  onSubmit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: contact?.fullName || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    status: contact?.status || 'pendente' as ContactStatus,
    priority: contact?.priority || 'normal' as ContactPriority
  });

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contactData = {
      ...formData,
      id: contact?.id || uuidv4(),
      createdAt: contact?.createdAt || new Date()
    };

    if (contact) {
      dispatch(editContact(contactData));
      toast.success('Contato atualizado com sucesso!');
    } else {
      dispatch(addContact(contactData));
      toast.success('Contato adicionado com sucesso!');
    }

    setFormData({ 
      fullName: '', 
      email: '', 
      phone: '', 
      status: 'pendente',
      priority: 'normal'
    });
    
    if (onSubmit) onSubmit();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="status">Status</Label>
        <AccessibleSelect
          id="status"
          name="status"
          label="Status do contato"
          value={formData.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setFormData({ ...formData, status: e.target.value as ContactStatus })}
        >
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
        </AccessibleSelect>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="priority">Prioridade</Label>
        <AccessibleSelect
          id="priority"
          name="priority"
          label="Prioridade do contato"
          value={formData.priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setFormData({ ...formData, priority: e.target.value as ContactPriority })}
        >
          <option value="normal">Normal</option>
          <option value="importante">Importante</option>
          <option value="urgente">Urgente</option>
        </AccessibleSelect>
      </InputGroup>

      <Button type="submit">
        {contact ? (
          <>
            <PencilSimple weight="bold" />
            Salvar Alterações
          </>
        ) : (
          <>
            <Plus weight="bold" />
            Adicionar Contato
          </>
        )}
      </Button>
    </FormContainer>
  );
};

export default ContactForm;