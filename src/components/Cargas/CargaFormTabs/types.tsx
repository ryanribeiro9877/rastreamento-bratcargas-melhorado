// components/Cargas/CargaFormTabs/types.ts
// Tipos e helpers compartilhados entre os sub-componentes do CargaForm

import type { CargaFormData } from '../../../types';

export interface TabProps {
  formData: CargaFormData;
  handleChange: (field: keyof CargaFormData, value: any) => void;
}

export function somenteDigitos(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatarCelular(valor: string): string {
  const digits = somenteDigitos(valor).slice(0, 9);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatarDDD(valor: string): string {
  const digits = somenteDigitos(valor).slice(0, 2);
  if (digits.length === 0) return '';
  return `(${digits}${digits.length === 2 ? ')' : ''}`;
}

export function formatarPlaca(valor: string): string {
  const limpo = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7);
  if (limpo.length <= 3) return limpo;
  return `${limpo.slice(0, 3)}-${limpo.slice(3)}`;
}

export function validarCelular(numero: string): boolean {
  const n = somenteDigitos(numero);
  return n.length === 9 && n.startsWith('9');
}

export function montarTelefoneBr(ddd: string, numero: string): string {
  const d = somenteDigitos(ddd);
  const n = somenteDigitos(numero);
  return `${d}${n}`;
}

export function SpinnerIcon({ className = 'h-5 w-5 text-blue-500' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
